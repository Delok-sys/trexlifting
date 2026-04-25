export function TrainingBlockOverview({ block }) {
  if (!block) {
    return null;
  }

  return (
    <section className="panel page-stack" aria-labelledby="current-block-overview">
      <div className="page-section-head">
        <p className="section-kicker">Aktueller Block</p>
        <h2 id="current-block-overview">{block.templateName}</h2>
      </div>

      <div className="card-grid">
        <article className="result-panel">
          <span>Ziel</span>
          <strong>{block.settings.goal}</strong>
        </article>

        <article className="result-panel">
          <span>Dauer</span>
          <strong>{block.settings.durationWeeks} Wochen</strong>
        </article>

        <article className="result-panel">
          <span>Trainingstage</span>
          <strong>{block.settings.trainingDaysPerWeek} pro Woche</strong>
        </article>

        <article className="result-panel">
          <span>Fokuslift</span>
          <strong>{block.settings.focusLift}</strong>
        </article>

        <article className="result-panel">
          <span>Aktuelle Woche</span>
          <strong>Woche {block.currentWeek}</strong>
        </article>

        <article className="result-panel">
          <span>1RM-Quelle</span>
          <strong>
            {block.profileSnapshot.source === "profile"
              ? "Strength Profil"
              : block.profileSnapshot.source === "manual"
                ? "Manuelle Eingabe"
                : "Demo-Werte"}
          </strong>
        </article>
      </div>
    </section>
  );
}
