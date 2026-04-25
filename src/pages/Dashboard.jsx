import { useMemo, useState } from "react";
import { CoachingCTA } from "../components/planning/CoachingCTA";
import { IntensityRanges } from "../components/planning/IntensityRanges";
import { PlanRecommendation } from "../components/planning/PlanRecommendation";
import { SampleWeek } from "../components/planning/SampleWeek";
import { LiftStats } from "../components/strength/LiftStats";
import { AttemptSelector } from "../components/tools/AttemptSelector";
import { OneRmCalculator } from "../components/tools/OneRmCalculator";
import { VariationCalculator } from "../components/tools/VariationCalculator";
import { useStrengthProfile } from "../context/StrengthProfileContext";
import {
  PLAN_CHECK_DURATION_OPTIONS,
  PLAN_CHECK_EXPERIENCE_OPTIONS,
  PLAN_CHECK_FOCUS_OPTIONS,
  PLAN_CHECK_GOAL_OPTIONS,
  PLAN_CHECK_STORAGE_KEY,
  PLAN_CHECK_TRAINING_DAY_OPTIONS,
  createTrainingPlanCheck,
  getPlanCheckInitialInput,
} from "../lib/trainingPlanRecommendations";
import {
  calculateEstimatedOneRepMax,
  formatWeight,
  parseDecimalInput,
  parseIntegerInput,
} from "../lib/strengthCalculations";
import "../styles/Dashboard.css";

const DASHBOARD_TABS = [
  { id: "planung", label: "Planung" },
  { id: "variation", label: "Lift Variation" },
  { id: "wettkampf", label: "Wettkampf Versuchswahl" },
  { id: "analyse", label: "Technikanalyse" },
];

const TECHNIQUE_FOCUS_AREAS = [
  {
    lift: "Kniebeuge",
    description: "Tiefe, Bar-Pfad, Rumpfspannung, Stand und Tempo in den kritischen Phasen.",
  },
  {
    lift: "Bankdruecken",
    description: "Setup, Leg Drive, Touchpoint, Ellbogenpfad und stabile Presslinie.",
  },
  {
    lift: "Kreuzheben",
    description: "Startposition, Lat-Spannung, Hip-Height, Lockout und Effizienz vom Boden.",
  },
];

const TECHNIQUE_WORKFLOW_STEPS = [
  {
    step: "Step 1",
    title: "Video Upload",
    description: "Upload-Flow mit Kamerawinkel-Hinweisen fuer reproduzierbare Analysen.",
  },
  {
    step: "Step 2",
    title: "Frame-by-Frame Review",
    description: "Markierungen, Zeitstempel und priorisierte Beobachtungen pro Lift.",
  },
  {
    step: "Step 3",
    title: "Prioritaeten und Drills",
    description: "2-3 klare Korrekturpunkte fuer die naechsten Einheiten.",
  },
];

function loadSavedPlanInput() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(PLAN_CHECK_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function savePlanInput(planInput) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PLAN_CHECK_STORAGE_KEY, JSON.stringify(planInput));
}

function createCombinedInitialForm(profile) {
  const savedInput = loadSavedPlanInput();
  const planInput = getPlanCheckInitialInput(profile, savedInput);

  return {
    bodyweight: profile.bodyweight ?? "",
    goal: planInput.goal ?? profile.goal ?? "",
    experienceLevel: planInput.experienceLevel ?? profile.experienceLevel ?? "",
    durationWeeks: planInput.durationWeeks,
    trainingDaysPerWeek: planInput.trainingDaysPerWeek,
    focusLift: planInput.focusLift,
    oneRms: {
      squat: `${planInput.oneRms.squat ?? ""}`,
      bench: `${planInput.oneRms.bench ?? ""}`,
      deadlift: `${planInput.oneRms.deadlift ?? ""}`,
    },
  };
}

export function DashboardPage() {
  const { profile, updateProfileFields, updateLiftOneRepMax } = useStrengthProfile();
  const [form, setForm] = useState(() => createCombinedInitialForm(profile));
  const [activeTab, setActiveTab] = useState("planung");
  const [saveError, setSaveError] = useState("");
  const [status, setStatus] = useState("idle");
  const [planResult, setPlanResult] = useState(null);
  const [calcForm, setCalcForm] = useState({
    liftKey: "squat",
    weight: "",
    reps: "1",
    rir: "0",
  });

  const calculatedOneRm = useMemo(() => {
    const weight = parseDecimalInput(calcForm.weight);

    if (!Number.isFinite(weight) || weight <= 0) {
      return null;
    }

    const reps = parseIntegerInput(calcForm.reps) ?? 1;
    const rir = parseIntegerInput(calcForm.rir) ?? 0;

    if (reps <= 0 || rir < 0) {
      return null;
    }

    return calculateEstimatedOneRepMax({ weight, reps, rir });
  }, [calcForm]);

  const handleFieldChange = (fieldName, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));
  };

  const handleOneRmChange = (liftKey, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      oneRms: {
        ...currentForm.oneRms,
        [liftKey]: value,
      },
    }));
  };

  const handleApplyCalculatedOneRm = () => {
    if (!calculatedOneRm) {
      return;
    }

    handleOneRmChange(calcForm.liftKey, `${calculatedOneRm}`);
  };

  const handleSaveAndRunPlan = (event) => {
    event.preventDefault();
    setSaveError("");
    setStatus("idle");

    const parsedOneRms = {
      squat: parseDecimalInput(form.oneRms.squat),
      bench: parseDecimalInput(form.oneRms.bench),
      deadlift: parseDecimalInput(form.oneRms.deadlift),
    };

    const invalidLift = Object.entries(parsedOneRms).find(
      ([, value]) => value !== null && value <= 0,
    );

    if (invalidLift) {
      setSaveError("1RM-Werte muessen groesser als 0 sein.");
      setStatus("error");
      return;
    }

    const nextProfileFields = {
      bodyweight: form.bodyweight,
      experienceLevel: form.experienceLevel,
      goal: form.goal,
    };

    updateProfileFields(nextProfileFields);

    Object.entries(parsedOneRms).forEach(([liftKey, oneRm]) => {
      if (oneRm !== null) {
        updateLiftOneRepMax(liftKey, oneRm);
      }
    });

    const builderInput = {
      goal: form.goal,
      durationWeeks: form.durationWeeks,
      trainingDaysPerWeek: form.trainingDaysPerWeek,
      focusLift: form.focusLift,
      experienceLevel: form.experienceLevel,
    };

    const nextPlanInput = {
      ...builderInput,
      oneRms: form.oneRms,
    };

    savePlanInput(nextPlanInput);

    const profileForPlanCheck = {
      ...profile,
      ...nextProfileFields,
      lifts: {
        ...profile.lifts,
        squat: {
          ...profile.lifts.squat,
          oneRepMax: parsedOneRms.squat ?? profile.lifts.squat.oneRepMax,
        },
        bench: {
          ...profile.lifts.bench,
          oneRepMax: parsedOneRms.bench ?? profile.lifts.bench.oneRepMax,
        },
        deadlift: {
          ...profile.lifts.deadlift,
          oneRepMax: parsedOneRms.deadlift ?? profile.lifts.deadlift.oneRepMax,
        },
      },
    };

    try {
      const nextPlanResult = createTrainingPlanCheck({
        builderInput,
        profile: profileForPlanCheck,
        manualOneRms: form.oneRms,
      });

      setPlanResult(nextPlanResult);
      setStatus("saved");
    } catch (error) {
      setSaveError(error.message ?? "Plan Check konnte nicht erstellt werden.");
      setStatus("error");
    }
  };

  return (
    <main className="page-shell dashboard-page-shell">
      <section className="dashboard-layout">
        <aside className="dashboard-input-column panel" aria-label="Input Cockpit">
          <form className="dashboard-input-form" onSubmit={handleSaveAndRunPlan}>
            <div className="dashboard-input-grid">
              <label className="form-field">
                <span>Koerpergewicht (kg)</span>
                <input
                  type="text"
                  value={form.bodyweight}
                  placeholder="z. B. 93"
                  onChange={(event) => handleFieldChange("bodyweight", event.target.value)}
                />
              </label>

              <label className="form-field">
                <span>Erfahrungslevel</span>
                <select
                  value={form.experienceLevel}
                  onChange={(event) => handleFieldChange("experienceLevel", event.target.value)}
                >
                  {PLAN_CHECK_EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Ziel</span>
                <select
                  value={form.goal}
                  onChange={(event) => handleFieldChange("goal", event.target.value)}
                >
                  {PLAN_CHECK_GOAL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Blockdauer</span>
                <select
                  value={form.durationWeeks}
                  onChange={(event) => handleFieldChange("durationWeeks", Number(event.target.value))}
                >
                  {PLAN_CHECK_DURATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} Wochen
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Trainingstage</span>
                <select
                  value={form.trainingDaysPerWeek}
                  onChange={(event) =>
                    handleFieldChange("trainingDaysPerWeek", Number(event.target.value))
                  }
                >
                  {PLAN_CHECK_TRAINING_DAY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Fokuslift</span>
                <select
                  value={form.focusLift}
                  onChange={(event) => handleFieldChange("focusLift", event.target.value)}
                >
                  {PLAN_CHECK_FOCUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="dashboard-one-rm-grid">
              {["squat", "bench", "deadlift"].map((liftKey) => (
                <label className="form-field" key={liftKey}>
                  <span>{liftKey.toUpperCase()} 1RM (kg)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.oneRms[liftKey]}
                    placeholder="z. B. 180"
                    onChange={(event) => handleOneRmChange(liftKey, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <section className="panel panel--soft dashboard-live-calculator">
              <h2>1RM Rechner (live)</h2>
              <div className="dashboard-live-calculator-grid">
                <label className="form-field">
                  <span>Lift</span>
                  <select
                    value={calcForm.liftKey}
                    onChange={(event) =>
                      setCalcForm((current) => ({ ...current, liftKey: event.target.value }))
                    }
                  >
                    <option value="squat">Squat</option>
                    <option value="bench">Bench</option>
                    <option value="deadlift">Deadlift</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Gewicht</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={calcForm.weight}
                    placeholder="z. B. 160"
                    onChange={(event) =>
                      setCalcForm((current) => ({ ...current, weight: event.target.value }))
                    }
                  />
                </label>

                <label className="form-field">
                  <span>Reps</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcForm.reps}
                    onChange={(event) =>
                      setCalcForm((current) => ({ ...current, reps: event.target.value }))
                    }
                  />
                </label>

                <label className="form-field">
                  <span>RIR</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcForm.rir}
                    onChange={(event) =>
                      setCalcForm((current) => ({ ...current, rir: event.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="action-row">
                <article className="result-panel">
                  <span>Neues 1RM</span>
                  <strong>{calculatedOneRm ? `${formatWeight(calculatedOneRm)} kg` : "-"}</strong>
                </article>

                <button
                  className="button button--ghost"
                  type="button"
                  disabled={!calculatedOneRm}
                  onClick={handleApplyCalculatedOneRm}
                >
                  In 1RM-Feld uebernehmen
                </button>
              </div>
            </section>

            <div className="action-row">
              <button className="button button--primary" type="submit">
                Profil aktualisieren
              </button>
              {status === "saved" ? <span className="status-pill">Aktualisiert</span> : null}
            </div>

            {saveError ? <p className="form-feedback form-feedback--error">{saveError}</p> : null}
          </form>
        </aside>

        <section className="dashboard-main-column panel page-stack" aria-labelledby="dashboard-main-head">
          <div className="page-section-head">
            <p className="section-kicker">Dashboard</p>
          </div>

          <LiftStats lifts={profile.lifts} />

          <div className="dashboard-tab-list" role="tablist" aria-label="Dashboard Funktionen">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`dashboard-tab-button${activeTab === tab.id ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="dashboard-tab-panel"
            role="tabpanel"
            id={`tab-panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === "planung" ? (
              <>
                {planResult ? (
                  <div className="page-stack page-stack--lg">
                    <PlanRecommendation
                      recommendation={planResult.recommendation}
                      settings={planResult.settings}
                      oneRmSource={planResult.oneRmSource}
                    />
                    <IntensityRanges ranges={planResult.intensityRanges} />
                    <SampleWeek days={planResult.sampleWeek} />
                    <section className="panel panel--soft">
                      <h3>Hinweise</h3>
                      <ul className="plain-list">
                        {planResult.hints.map((hint) => (
                          <li key={hint}>{hint}</li>
                        ))}
                      </ul>
                    </section>
                    <CoachingCTA />
                  </div>
                ) : (
                  <section className="panel panel--soft">
                    <p className="form-feedback">
                      Starte links im Input-Cockpit mit "Profil speichern + Plan Check aktualisieren".
                      Danach erscheinen hier automatisch Empfehlung, Intensitaeten und Beispielwoche.
                    </p>
                  </section>
                )}
              </>
            ) : null}

            {activeTab === "variation" ? <VariationCalculator /> : null}
            {activeTab === "wettkampf" ? <AttemptSelector /> : null}
            {activeTab === "analyse" ? (
              <section className="page-stack page-stack--sm">
                <div className="card-grid dashboard-tech-grid">
                  {TECHNIQUE_FOCUS_AREAS.map((area) => (
                    <article className="panel panel--soft" key={area.lift}>
                      <h3>{area.lift}</h3>
                      <p className="page-copy">{area.description}</p>
                    </article>
                  ))}
                </div>

                <div className="card-grid dashboard-tech-grid">
                  {TECHNIQUE_WORKFLOW_STEPS.map((step) => (
                    <article className="panel panel--soft" key={step.step}>
                      <span className="status-pill">{step.step}</span>
                      <h3>{step.title}</h3>
                      <p className="page-copy">{step.description}</p>
                    </article>
                  ))}
                </div>

                <OneRmCalculator />
              </section>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
