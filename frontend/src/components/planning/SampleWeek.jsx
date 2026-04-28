export function SampleWeek({ days }) {
  if (!days || days.length === 0) {
    return null;
  }

  return (
    <section className="panel page-stack" aria-labelledby="sample-week-head">
      <div className="page-section-head">
        <p className="section-kicker">3. Beispielwoche</p>
        <h2 id="sample-week-head">Orientierung statt voller Kalenderplanung</h2>
      </div>

      <div className="smart-plan-check-day-list">
        {days.map((day) => (
          <article key={day.id} className="panel panel--soft page-stack page-stack--sm">
            <h3>{day.title}</h3>
            <p className="form-feedback">Hauptfokus: {day.mainFocus}</p>
            <ul className="plain-list">
              <li>Beispiel-Hauptuebung: {day.exerciseExample}</li>
              <li>Satz-/Wiederholungsbereich: {day.setRepRange}</li>
              <li>RPE-Ziel: {day.rpeTarget}</li>
              <li>Grobe Last: {day.loadTarget}</li>
              <li>Begruendung: {day.rationale}</li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
