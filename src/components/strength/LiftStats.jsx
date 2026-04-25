import { LIFT_KEYS, LIFT_LABELS } from "../../lib/strengthCalculations";

export function LiftStats({ lifts }) {
  return (
    <section className="panel panel--soft dashboard-lift-stats" aria-label="Aktuelle 1RM Werte">
      {LIFT_KEYS.map((liftKey) => (
        <article key={liftKey} className="dashboard-lift-stat-row">
          <span className="dashboard-lift-stat-label">{LIFT_LABELS[liftKey]}</span>
          <strong className="dashboard-lift-stat-value">
            {lifts?.[liftKey]?.oneRepMax ? `${lifts[liftKey].oneRepMax} kg` : "-"}
          </strong>
        </article>
      ))}
    </section>
  );
}
