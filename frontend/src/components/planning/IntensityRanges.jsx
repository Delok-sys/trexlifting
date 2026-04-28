export function IntensityRanges({ ranges }) {
  if (!ranges || ranges.length === 0) {
    return null;
  }

  return (
    <section className="panel page-stack" aria-labelledby="intensity-ranges-head">
      <div className="page-section-head">
        <p className="section-kicker">2. Intensitaetsbereiche</p>
        <h2 id="intensity-ranges-head">Pro Lift auf 1RM-Basis</h2>
      </div>

      <div className="card-grid">
        {ranges.map((range) => (
          <article key={range.liftKey} className="panel panel--soft page-stack page-stack--sm">
            <h3>{range.liftLabel}</h3>
            <div className="smart-plan-check-metrics">
              <span>Intensitaet: {range.percentRange}</span>
              <span>Ziel-RPE: {range.rpeRange}</span>
              <span>Gewichtsbereich: {range.weightRange}</span>
              <span>Typische Wiederholungen: {range.reps}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
