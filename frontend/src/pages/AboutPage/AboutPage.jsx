import "../../styles/AboutPage.css";

export function AboutPage({
  experienceTimeline,
  injuryCards,
}) {
  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--xl">
        <p className="page-kicker">Ueber mich</p>
        <h1>Erfahrung aus Training, Wettkampf und Praxis</h1>
        <p className="page-copy about-intro">
          Mein sportlicher Weg ist gepraegt von Kraftsport, Powerlifting, Wettkampferfahrung,
          Athletenbetreuung und dem direkten Umgang mit Belastung, Ueberlastung und Anpassung im
          Training.
        </p>

        <section className="about-section" aria-labelledby="sportliche-erfahrungen">
          <div className="page-section-head">
            <h2 id="sportliche-erfahrungen">Sportliche Erfahrungen</h2>
          </div>

          <div className="timeline">
            {experienceTimeline.map((item) => (
              <article key={`${item.period}-${item.title}`} className="timeline-item">
                <div className="timeline-marker" aria-hidden="true" />
                <div className="timeline-content">
                  <p className="timeline-period">{item.period}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" aria-labelledby="verletzungen-im-sport">
          <div className="page-section-head">
            <h2 id="verletzungen-im-sport">Verletzungen waehrend des Sports</h2>
          </div>

          <p className="page-copy section-copy">
            Die folgenden Punkte zeigen typische Ueberlastungen und Problemzonen aus der Praxis.
            Gerade diese Erfahrungen helfen heute dabei, Training genauer einzuordnen und Risiken
            fruehzeitig zu erkennen.
          </p>

          <div className="injury-grid">
            {injuryCards.map((item) => (
              <article
                key={`${item.area}-${item.issue}`}
                className={`injury-card injury-card--${item.tone}`}
              >
                <p className="injury-area">{item.area}</p>
                <h3>{item.issue}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
