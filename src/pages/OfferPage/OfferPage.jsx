import { Link } from "react-router-dom";
import "../../styles/OfferPage.css";

export function OfferPage({ kicker, title, description, products, highlights }) {
  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--xl">
        <p className="page-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="page-copy">{description}</p>

        <section className="offer-section" aria-labelledby="angebote-im-ueberblick">
          <div className="page-section-head">
            <p className="section-kicker">Produkte und Dienstleistungen</p>
            <h2 id="angebote-im-ueberblick">Erste Angebotsseite mit klaren Paketen</h2>
          </div>

          <div className="offer-grid">
            {products.map((product) => (
              <article key={product.name} className="offer-card">
                <div className="offer-card__head">
                  <p className="offer-card__eyebrow">{product.category}</p>
                  <div className="offer-card__price-block">
                    <h3>{product.name}</h3>
                    <p className="offer-card__price">{product.price}</p>
                  </div>
                </div>

                <p className="offer-card__description">{product.description}</p>

                <ul className="offer-card__feature-list">
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className="offer-card__footer">
                  <span className="status-pill">{product.badge}</span>
                  <Link className="page-link offer-card__link" to="/kontakt">
                    Anfrage senden
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="offer-section" aria-labelledby="warum-diese-angebote">
          <div className="page-section-head">
            <p className="section-kicker">Warum diese Angebote</p>
            <h2 id="warum-diese-angebote">Einfacher Einstieg, spaeter leicht erweiterbar</h2>
          </div>

          <div className="offer-highlight-grid">
            {highlights.map((highlight) => (
              <article key={highlight.title} className="offer-highlight-card">
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="offer-cta" aria-labelledby="angebot-cta">
          <div>
            <p className="section-kicker">Naechster Schritt</p>
            <h2 id="angebot-cta">Dummy-Angebote stehen und koennen jetzt mit echten Inhalten ersetzt werden</h2>
          </div>

          <p className="page-copy">
            Als Nächstes koennen wir Preise, Leistungsumfang, Testimonials oder Buchungsablaeufe
            ergaenzen und die Seite gezielt auf Coaching, Plaene oder Analysen zuschneiden.
          </p>

          <div className="action-row">
            <Link className="button button--primary" to="/kontakt">
              Kontakt aufnehmen
            </Link>
            <Link className="button button--ghost" to="/erfahrungen">
              Mehr zu meinen Erfahrungen
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
