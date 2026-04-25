import { useState } from "react";
import { Link } from "react-router-dom";
import { useStrengthProfile } from "../../context/StrengthProfileContext";

const systemAreas = [
  {
    title: "Planung",
    description: "Trainingsarchitektur, Variationsrechner und Laststeuerung auf Basis deiner 1RM-Werte.",
    path: "/dashboard",
  },
  {
    title: "Analyse",
    description: "Technik-Review, e1RM-Auswertung und datenbasierte Entscheidungen pro Lift.",
    path: "/dashboard",
  },
  {
    title: "Wettkampf",
    description: "Attempt-Auswahl und Meet-Preparation fuer eine sichere Plattformstrategie.",
    path: "/dashboard",
  },
];

export function HomePage() {
  const { hasAnyOneRepMax } = useStrengthProfile();
  const [demoMessage, setDemoMessage] = useState("");
  const [requestState, setRequestState] = useState("idle");

  async function handleDemoClick() {
    try {
      setRequestState("loading");

      const response = await fetch("/api/demo-message");

      if (!response.ok) {
        throw new Error("Die Demo-Nachricht konnte nicht geladen werden.");
      }

      const data = await response.json();

      setDemoMessage(data.message);
      setRequestState("success");
    } catch (error) {
      setDemoMessage(error.message);
      setRequestState("error");
    }
  }

  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--xl">
        <div className="page-stack page-stack--sm">
          <p className="page-kicker">trexlifting Strength System</p>
        </div>

        <div className="action-row">
          <Link className="button button--ghost" to="/dashboard">
            Zum Dashboard
          </Link>
        </div>

        <section className="page-stack page-stack--sm" aria-labelledby="system-bereiche">
          <div className="page-section-head">
            <p className="section-kicker">Systemlogik</p>
            <h2 id="system-bereiche">Die drei Kernbereiche</h2>
          </div>

          <div className="card-grid">
            {systemAreas.map((area) => (
              <article key={area.title} className="panel panel--soft">
                <h3>{area.title}</h3>
                <p className="page-copy">{area.description}</p>
                <Link className="button button--secondary" to={area.path}>
                  Zu {area.title}
                </Link>
              </article>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
}
