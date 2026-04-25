import { Link } from "react-router-dom";

export function CoachingCTA() {
  return (
    <section className="panel page-stack" aria-labelledby="coaching-cta-head">
      <div className="page-section-head">
        <p className="section-kicker">5. Naechster Schritt</p>
        <h2 id="coaching-cta-head">Von der Orientierung in die individuelle Umsetzung</h2>
      </div>

      <p className="page-copy">
        Fuer vollstaendige Trainingsplanung, laufende Betreuung und individuelle Anpassungen erfolgt die
        Umsetzung im trexlifting Coaching.
      </p>

      <div className="action-row">
        <Link className="button button--primary" to="/coaching">
          Individuellen Plan im Coaching erhalten
        </Link>
        <Link className="button button--ghost" to="/kontakt">
          Coaching anfragen
        </Link>
        <Link className="button button--secondary" to="/coaching">
          Mit trexlifting starten
        </Link>
      </div>
    </section>
  );
}
