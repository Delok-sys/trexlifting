import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const products = [
  {
    name: "Full Service Coaching",
    previewImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
    teaser:
      "All-in-one Plattform fuer Training, Ernaehrung, Metriken und direkte Betreuung.",
    details: [
      "All-in-one Plattform fuer Ernaehrungstracking auch mit KI, Trainingsplan, Direktkontakt und individuelle Metriken.",
      "Individueller Trainingsplan abgestimmt auf deine Zeit, Wuensche und Kapazitaeten mit regelmaessigen Feinanpassungen.",
      "Regelmaessige Kontrolle der Trainingsausfuehrung inklusive Bewegungsanalyse basierend auf deinen Proportionen.",
      "Ernaehrungsrahmen auf deinen Zielen basierend inklusive Supplementberatung.",
      "Lifestyleanpassung fuer deine Ziele.",
    ],
    externalUrl: "https://example.com/full-service-coaching",
  },
  {
    name: "Technikanalyse",
    previewImage:
      "https://images.unsplash.com/photo-1571019613914-85f342c1d4b6?auto=format&fit=crop&w=1000&q=80",
    teaser: "Technik-Analyse mit klaren Optimierungsvorschlaegen fuer deine Lifts.",
    details: [
      "Analyse der Technik mit Vorschlaegen zur Optimierung.",
      "Cues zur besseren Umsetzung.",
      "Uebungen zur Unterstuetzung.",
    ],
    externalUrl: "https://example.com/technikanalyse",
  },
  {
    name: "Personal Training (Raum Potsdam)",
    previewImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
    teaser: "1:1 Einheiten mit Fokus auf Technik, Struktur und direkte Umsetzung.",
    details: [
      "Dein Training oder Uebungen deiner Wahl (~60-90 min.).",
      "Technikueberpruefung.",
      "Tipps fuer dein Training und deinen Plan.",
    ],
    externalUrl: "https://example.com/personal-training",
  },
];

const servicePromise = [
  "Wenn du nicht zufrieden bist und keinen Mehrwert erhalten hast, zahlst du nicht.",
  "Du erhaeltst zusaetzlich eine weitere Einheit/Zeitraum des Produkts kostenfrei, in der ich deine Kritik und Anmerkungen umsetze.",
];

export function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    if (!activeProduct) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveProduct(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProduct]);

  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--xl">
        <section className="page-stack page-stack--sm" aria-labelledby="products-overview">
          <div className="page-section-head">
            <p className="section-kicker">Produkte</p>
            <h2 id="products-overview">Leistungen im Ueberblick</h2>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <button
                key={product.name}
                className="product-card"
                type="button"
                onClick={() => setActiveProduct(product)}
              >
                <div className="product-card-image-wrap">
                  <img className="product-card-image" src={product.previewImage} alt={product.name} />
                </div>
                <div className="product-card-content">
                  <h3>{product.name}</h3>
                  <p className="page-copy">{product.teaser}</p>
                  <span className="status-pill">Details ansehen</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel panel--soft" aria-labelledby="products-promise">
          <div className="page-section-head">
            <p className="section-kicker">Versprechen</p>
            <h2 id="products-promise">Fuer alle Angebote gilt</h2>
          </div>

          <ul className="plain-list">
            {servicePromise.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </section>

        <div className="action-row">
          <Link className="button button--primary" to="/kontakt">
            Anfrage stellen
          </Link>
          <Link className="button button--ghost" to="/dashboard">
            Zum Dashboard
          </Link>
        </div>
      </section>

      {activeProduct ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setActiveProduct(null)}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="button button--ghost modal-close"
              type="button"
              onClick={() => setActiveProduct(null)}
            >
              Schliessen
            </button>

            <img className="modal-image" src={activeProduct.previewImage} alt={activeProduct.name} />

            <div className="page-stack page-stack--sm">
              <h3 id="product-modal-title">{activeProduct.name}</h3>
              <ul className="plain-list">
                {activeProduct.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>

            <a
              className="button button--secondary"
              href={activeProduct.externalUrl}
              target="_blank"
              rel="noreferrer"
            >
              Zum externen Link
            </a>
          </section>
        </div>
      ) : null}
    </main>
  );
}
