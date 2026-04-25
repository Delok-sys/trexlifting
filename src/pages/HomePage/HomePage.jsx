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
          <h1>Plane, analysiere und optimiere dein Powerlifting-Training datenbasiert.</h1>
          <p className="page-copy">
            trexlifting verbindet Strength Profil, Trainingsplanung, Analyse und Wettkampfvorbereitung
            in einem konsistenten Workflow statt isolierter Einzeltools.
          </p>
        </div>

        <div className="action-row">
          <Link className="button button--primary" to="/dashboard">
            Dashboard starten
          </Link>
          <Link className="button button--ghost" to="/dashboard">
            Zum Dashboard
          </Link>
        </div>

        {!hasAnyOneRepMax ? (
          <p className="form-feedback">
            Tipp: Lege zuerst dein Strength Profil im Dashboard an, damit alle Rechner direkt mit deinen Daten
            arbeiten.
          </p>
        ) : null}

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

        <section className="panel panel--soft">
          <div className="page-section-head">
            <p className="section-kicker">Backend Demo</p>
            <h2>Systemverbindung pruefen</h2>
          </div>

          <div className="action-row">
            <button
              className="button button--primary"
              type="button"
              onClick={handleDemoClick}
              disabled={requestState === "loading"}
            >
              {requestState === "loading" ? "Nachricht wird geladen..." : "Demo-Nachricht abrufen"}
            </button>

            {requestState === "success" ? <span className="status-pill">Verbunden</span> : null}
          </div>

          {demoMessage ? (
            <p className={`form-feedback${requestState === "error" ? " form-feedback--error" : ""}`}>
              {demoMessage}
            </p>
          ) : null}
        </section>
      </section>
    </main>
  );
}
