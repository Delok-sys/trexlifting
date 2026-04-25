import { Link } from "react-router-dom";

const products = [
  {
    category: "Coaching",
    name: "Powerlifting Start",
    price: "49 EUR",
    description:
      "Einstiegspaket fuer Athletinnen und Athleten, die strukturiert mit Squat, Bench und Deadlift starten wollen.",
    features: [
      "Startanalyse deines Trainingsstands",
      "4 Wochen Strukturbeispiel",
      "Technik-Hinweise fuer die Hauptlifts",
    ],
    badge: "Ideal fuer Einsteiger",
  },
  {
    category: "Analyse",
    name: "Technik-Check",
    price: "69 EUR",
    description: "Kompaktes Format fuer Lift-Feedback mit Setup- und Technikfokus.",
    features: [
      "Video-Review fuer Squat, Bench oder Deadlift",
      "Konkrete Korrekturpunkte",
      "Drills und Prioritaeten fuer die naechsten Einheiten",
    ],
    badge: "Beliebtes Format",
  },
  {
    category: "Wettkampf",
    name: "Meet Prep",
    price: "119 EUR",
    description: "Coaching fuer die letzte Phase vor dem Wettkampf inklusive Attempt-Strategie.",
    features: [
      "Ablauf fuer die letzten 6 Wochen",
      "Versuchsauswahl und Anpassung",
      "Checkliste fuer Warm-up und Wettkampftag",
    ],
    badge: "Fuer Fortgeschrittene",
  },
];

const testimonials = [
  "4. Platz beim ersten Bending Bars Wettkampf.",
  "2. Platz bei Bending Bars 2024.",
  "1. Platz beim Raw Meet VIII 2024.",
];

export function CoachingPage() {
  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--xl">
        <section className="page-stack page-stack--sm" aria-labelledby="coaching-products">
          <div className="page-section-head">
            <p className="section-kicker">Pakete</p>
            <h2 id="coaching-products">Leistungen im Ueberblick</h2>
          </div>

          <div className="card-grid">
            {products.map((product) => (
              <article key={product.name} className="panel panel--soft">
                <span className="status-pill">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="form-feedback">{product.price}</p>
                <p className="page-copy">{product.description}</p>
                <ul className="plain-list">
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <span className="status-pill">{product.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel panel--soft" aria-labelledby="coaching-results">
          <div className="page-section-head">
            <p className="section-kicker">Ergebnisse</p>
            <h2 id="coaching-results">Wettkampf- und Praxiserfahrung</h2>
          </div>

          <ul className="plain-list">
            {testimonials.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </section>

        <div className="action-row">
          <Link className="button button--primary" to="/kontakt">
            Coaching anfragen
          </Link>
          <Link className="button button--ghost" to="/dashboard">
            Zum Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
