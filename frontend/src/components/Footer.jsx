import { Link } from "react-router-dom";

const footerNavigation = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Produkte", path: "/produkte" },
  { label: "Ueber mich", path: "/ueber-mich" },
  { label: "Kontakt", path: "/kontakt" },
];

const footerServiceLinks = [
  { label: "Home", path: "/" },
  { label: "Kontakt", path: "/kontakt" },
  { label: "Impressum", path: "/impressum" },
  { label: "Datenschutz", path: "/datenschutz" },
];

const socialLinks = ["Instagram", "YouTube", "TikTok", "LinkedIn"];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section className="footer-column footer-brand-column" aria-label="trexlifting">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              T
            </span>
            <span className="brand-text">trexlifting</span>
          </Link>
          <p className="footer-copy">
            Das datenbasierte Strength System fuer Planung, Analyse und Wettkampfvorbereitung.
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
        <p className="footer-meta">(c) 2026 trexlifting. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
}
