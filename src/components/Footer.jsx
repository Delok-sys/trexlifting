import { Link } from "react-router-dom";

const footerNavigation = [
  { label: "Home", path: "/" },
  { label: "Tools", path: "/tools" },
  { label: "Angebot", path: "/angebot" },
  { label: "Über mich", path: "/ueber-mich" },
];

const footerServiceLinks = [
  { label: "Kontakt", path: "/kontakt" },
  { label: "Impressum", path: "/impressum" },
  { label: "Datenschutz", path: "/datenschutz" },
];

const socialLinks = ["Instagram", "YouTube", "TikTok", "LinkedIn"];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section className="footer-column footer-brand-column" aria-label="TrexLifting">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              T
            </span>
            <span className="brand-text">TrexLifting</span>
          </Link>
          <p className="footer-copy">
            Krafttraining, Tools und Inhalte rund um deinen nachhaltigen Fortschritt im Gym.
          </p>
        </section>

        <section className="footer-column" aria-label="Navigation">
          <h2 className="footer-heading">Navigation</h2>
          <div className="footer-links">
            {footerNavigation.map((item) => (
              <Link key={item.path} className="footer-link" to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="footer-column" aria-label="Service">
          <h2 className="footer-heading">Service</h2>
          <div className="footer-links">
            {footerServiceLinks.map((item) => (
              <Link key={item.path} className="footer-link" to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="footer-column" aria-label="Social Media">
          <h2 className="footer-heading">Social Media</h2>
          <div className="footer-links footer-social-links">
            {socialLinks.map((label) => (
              <a
                key={label}
                className="footer-link footer-social-link is-placeholder"
                href="/"
                onClick={(event) => event.preventDefault()}
                aria-label={`${label} Platzhalter-Link`}
              >
                {label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <p className="footer-meta">© 2026 TrexLifting. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
}
