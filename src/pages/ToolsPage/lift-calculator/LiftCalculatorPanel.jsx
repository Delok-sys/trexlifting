const liftLabels = {
  squat: "Kniebeuge",
  bench: "Bankdruecken",
  deadlift: "Kreuzheben",
};

function LiftInputCard({
  liftKey,
  label,
  liftValues,
  storedLift,
  onLiftInputChange,
}) {
  return (
    <fieldset className="tools-lift-card panel panel--soft">
      <legend>{label}</legend>

      <div className="tools-lift-card-head">
        <div className="result-panel">
          <span>Gespeichertes 1RM</span>
          <strong>{storedLift.oneRepMax ? `${storedLift.oneRepMax} kg` : "-"}</strong>
        </div>
      </div>

      <div className="tools-lift-inputs">
        <label className="form-field">
          <span>Gewicht</span>
          <input
            type="text"
            min="0"
            step="0.1"
            value={liftValues.weight}
            onChange={(event) => onLiftInputChange(liftKey, "weight", event.target.value)}
            placeholder="z. B. 100"
          />
        </label>

        <label className="form-field">
          <span>Reps</span>
          <input
            type="text"
            min="1"
            step="1"
            value={liftValues.reps}
            onChange={(event) => onLiftInputChange(liftKey, "reps", event.target.value)}
            placeholder="1"
          />
        </label>

        <label className="form-field">
          <span>RIR</span>
          <input
            type="text"
            min="0"
            step="1"
            value={liftValues.rir}
            onChange={(event) => onLiftInputChange(liftKey, "rir", event.target.value)}
            placeholder="0"
          />
        </label>
      </div>
    </fieldset>
  );
}

export function LiftCalculatorPanel({
  liftForm,
  liftStatus,
  liftError,
  storedLifts,
  onLiftInputChange,
  onLiftSubmit,
}) {
  return (
    <section className="panel page-stack" aria-labelledby="tools-lift-form-title">
      <div className="page-section-head">
        <p className="section-kicker">1RM Rechner</p>
        <h2 id="tools-lift-form-title">Lifts eintragen</h2>
      </div>

      <p className="page-copy">
        Trage Gewicht, Wiederholungen und RIR ein. Wenn nur das Gewicht gesetzt ist, rechnen wir
        automatisch mit 1 Wiederholung und 0 RIR.
      </p>

      <form className="tools-lift-form" onSubmit={onLiftSubmit}>
        {Object.entries(liftLabels).map(([liftKey, label]) => (
          <LiftInputCard
            key={liftKey}
            liftKey={liftKey}
            label={label}
            liftValues={liftForm[liftKey]}
            storedLift={storedLifts[liftKey]}
            onLiftInputChange={onLiftInputChange}
          />
        ))}

        <div className="action-row tools-lift-actions">
          <button type="submit" className="button button--primary" disabled={liftStatus === "loading"}>
            {liftStatus === "loading" ? "Berechne..." : "1RM Berechnen"}
          </button>

          {liftError ? <p className="form-feedback form-feedback--error">{liftError}</p> : null}
        </div>
      </form>
    </section>
  );
}
