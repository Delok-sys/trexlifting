import { useEffect, useMemo, useState } from "react";
import {
  PLAN_DURATION_OPTIONS,
  PLAN_EXPERIENCE_OPTIONS,
  PLAN_FOCUS_OPTIONS,
  PLAN_GOAL_OPTIONS,
  PLAN_TRAINING_DAYS_OPTIONS,
} from "../../lib/trainingPlanEngine";

function mapProfileGoal(goal) {
  if (goal === "Muskelaufbau") {
    return "Muskelaufbau / Hypertrophie";
  }

  return PLAN_GOAL_OPTIONS.includes(goal) ? goal : "Kraftaufbau";
}

function mapProfileExperience(level) {
  if (level === "Einsteiger") {
    return "Anfaenger";
  }

  if (level === "Wettkampfathlet") {
    return "Wettkaempfer";
  }

  return PLAN_EXPERIENCE_OPTIONS.includes(level) ? level : "Fortgeschritten";
}

export function BlockBuilder({ profile, hasAnyOneRepMax, onCreateBlock }) {
  const initialForm = useMemo(
    () => ({
      goal: mapProfileGoal(profile?.goal),
      durationWeeks: 4,
      trainingDaysPerWeek: 4,
      focusLift: "Gesamt",
      experienceLevel: mapProfileExperience(profile?.experienceLevel),
      useDemoValues: !hasAnyOneRepMax,
      useManualValues: false,
      manualOneRms: {
        squat: "",
        bench: "",
        deadlift: "",
      },
    }),
    [hasAnyOneRepMax, profile?.experienceLevel, profile?.goal],
  );

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleFieldChange = (fieldName, value) => {
    setForm((current) => ({
      ...current,
      [fieldName]: value,
    }));
  };

  const handleManualOneRmChange = (liftKey, value) => {
    setForm((current) => ({
      ...current,
      manualOneRms: {
        ...current.manualOneRms,
        [liftKey]: value,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    try {
      onCreateBlock({
        builderInput: {
          goal: form.goal,
          durationWeeks: Number(form.durationWeeks),
          trainingDaysPerWeek: Number(form.trainingDaysPerWeek),
          focusLift: form.focusLift,
          experienceLevel: form.experienceLevel,
        },
        manualOneRms: form.useManualValues ? form.manualOneRms : {},
        useDemoValues: form.useDemoValues,
      });
    } catch (createError) {
      setError(createError.message ?? "Trainingsblock konnte nicht erstellt werden.");
    }
  };

  return (
    <section className="panel page-stack" aria-labelledby="block-builder-head">
      <div className="page-section-head">
        <p className="section-kicker">Block Builder</p>
        <h2 id="block-builder-head">Trainingsblock erstellen</h2>
      </div>

      {!hasAnyOneRepMax ? (
        <p className="form-feedback">
          Fuer praezise Empfehlungen sollte ein Strength Profil mit 1RM-Werten vorliegen. Du kannst
          trotzdem mit Demo-Werten oder manueller Eingabe starten.
        </p>
      ) : null}

      <form className="page-stack" onSubmit={handleSubmit}>
        <div className="card-grid">
          <label className="form-field">
            <span>Ziel</span>
            <select value={form.goal} onChange={(event) => handleFieldChange("goal", event.target.value)}>
              {PLAN_GOAL_OPTIONS.map((option) => (
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
              {PLAN_DURATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} Wochen
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Trainingstage pro Woche</span>
            <select
              value={form.trainingDaysPerWeek}
              onChange={(event) => handleFieldChange("trainingDaysPerWeek", Number(event.target.value))}
            >
              {PLAN_TRAINING_DAYS_OPTIONS.map((option) => (
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
              {PLAN_FOCUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Erfahrungslevel</span>
            <select
              value={form.experienceLevel}
              onChange={(event) => handleFieldChange("experienceLevel", event.target.value)}
            >
              {PLAN_EXPERIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="smart-plan-inline-settings">
          <label className="smart-plan-checkbox">
            <input
              type="checkbox"
              checked={form.useDemoValues}
              onChange={(event) => handleFieldChange("useDemoValues", event.target.checked)}
            />
            <span>Demo-Werte als Fallback erlauben</span>
          </label>

          <label className="smart-plan-checkbox">
            <input
              type="checkbox"
              checked={form.useManualValues}
              onChange={(event) => handleFieldChange("useManualValues", event.target.checked)}
            />
            <span>1RM manuell ueberschreiben</span>
          </label>
        </div>

        {form.useManualValues ? (
          <div className="card-grid">
            <label className="form-field">
              <span>Squat 1RM (kg)</span>
              <input
                type="text"
                value={form.manualOneRms.squat}
                onChange={(event) => handleManualOneRmChange("squat", event.target.value)}
                placeholder="z. B. 180"
              />
            </label>
            <label className="form-field">
              <span>Bench 1RM (kg)</span>
              <input
                type="text"
                value={form.manualOneRms.bench}
                onChange={(event) => handleManualOneRmChange("bench", event.target.value)}
                placeholder="z. B. 125"
              />
            </label>
            <label className="form-field">
              <span>Deadlift 1RM (kg)</span>
              <input
                type="text"
                value={form.manualOneRms.deadlift}
                onChange={(event) => handleManualOneRmChange("deadlift", event.target.value)}
                placeholder="z. B. 220"
              />
            </label>
          </div>
        ) : null}

        <div className="action-row">
          <button className="button button--primary" type="submit">
            Trainingsblock erstellen
          </button>
        </div>

        {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
      </form>
    </section>
  );
}
