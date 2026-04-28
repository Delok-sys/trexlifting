export function PlanRecommendation({ recommendation, settings, oneRmSource }) {
  if (!recommendation) {
    return null;
  }

  const sourceLabel = oneRmSource === "manual" ? "Manuelle Eingabe" : "Strength Profil";

  return (
    <section className="panel page-stack" aria-labelledby="plan-check-recommendation-head">
      <div className="page-section-head">
        <p className="section-kicker">1. Block-Empfehlung</p>
        <h2 id="plan-check-recommendation-head">Empfohlene Trainingsrichtung</h2>
      </div>

      <div className="card-grid">
        <article className="result-panel">
          <span>Ziel des Blocks</span>
          <strong>{recommendation.blockGoal}</strong>
        </article>

        <article className="result-panel">
          <span>Empfohlene Dauer</span>
          <strong>{recommendation.recommendedDurationWeeks} Wochen</strong>
        </article>

        <article className="result-panel">
          <span>Empfohlene Frequenz</span>
          <strong>{recommendation.recommendedTrainingDays} Tage/Woche</strong>
        </article>

        <article className="result-panel">
          <span>Fokus</span>
          <strong>{recommendation.focus}</strong>
        </article>
      </div>

      <p className="page-copy">{recommendation.explanation}</p>

      <ul className="plain-list">
        <li>
          Deine Auswahl: {settings.durationWeeks} Wochen, {settings.trainingDaysPerWeek} Tage/Woche,
          Fokus {settings.focusLift}.
        </li>
        <li>1RM-Basis fuer diese Empfehlung: {sourceLabel}.</li>
      </ul>
    </section>
  );
}
