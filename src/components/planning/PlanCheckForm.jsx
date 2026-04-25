import {
  PLAN_CHECK_DURATION_OPTIONS,
  PLAN_CHECK_EXPERIENCE_OPTIONS,
  PLAN_CHECK_FOCUS_OPTIONS,
  PLAN_CHECK_GOAL_OPTIONS,
  PLAN_CHECK_TRAINING_DAY_OPTIONS,
} from "../../lib/trainingPlanRecommendations";

export function PlanCheckForm({ form, onFieldChange, onOneRmChange, onSubmit, error }) {
  return (
    <section className="panel page-stack" aria-labelledby="plan-check-form-head">
      <div className="page-section-head">
        <p className="section-kicker">Smart Strength Plan Check</p>
        <h2 id="plan-check-form-head">Trainingsblock Check starten</h2>
      </div>

      <p className="form-feedback">
        Datenbasierte Orientierung fuer den naechsten Trainingsblock. Kein vollstaendiger Plantracker.
      </p>

      <form className="page-stack" onSubmit={onSubmit}>
        <div className="card-grid">
          <label className="form-field">
            <span>Ziel</span>
            <select value={form.goal} onChange={(event) => onFieldChange("goal", event.target.value)}>
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
              onChange={(event) => onFieldChange("durationWeeks", Number(event.target.value))}
            >
              {PLAN_CHECK_DURATION_OPTIONS.map((option) => (
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
              onChange={(event) => onFieldChange("trainingDaysPerWeek", Number(event.target.value))}
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
            <select value={form.focusLift} onChange={(event) => onFieldChange("focusLift", event.target.value)}>
              {PLAN_CHECK_FOCUS_OPTIONS.map((option) => (
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
              onChange={(event) => onFieldChange("experienceLevel", event.target.value)}
            >
              {PLAN_CHECK_EXPERIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className="panel panel--soft page-stack page-stack--sm" aria-labelledby="one-rm-input-head">
          <h3 id="one-rm-input-head">1RM-Werte (kg)</h3>
          <p className="form-feedback">
            Falls vorhanden, wurden Werte aus deinem Strength Profil vorbefuellt. Du kannst sie jederzeit anpassen.
          </p>

          <div className="card-grid">
            <label className="form-field">
              <span>Squat 1RM</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.oneRms.squat}
                onChange={(event) => onOneRmChange("squat", event.target.value)}
                placeholder="z. B. 180"
              />
            </label>

            <label className="form-field">
              <span>Bench 1RM</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.oneRms.bench}
                onChange={(event) => onOneRmChange("bench", event.target.value)}
                placeholder="z. B. 125"
              />
            </label>

            <label className="form-field">
              <span>Deadlift 1RM</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.oneRms.deadlift}
                onChange={(event) => onOneRmChange("deadlift", event.target.value)}
                placeholder="z. B. 220"
              />
            </label>
          </div>
        </section>

        <div className="action-row">
          <button className="button button--primary" type="submit">
            Smart Strength Plan Check erstellen
          </button>
        </div>

        {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
      </form>
    </section>
  );
}
