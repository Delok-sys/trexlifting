import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Produkte", path: "/produkte" },
  { label: "Ueber mich", path: "/ueber-mich" },
  { label: "Kontakt", path: "/kontakt" },
];

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Hauptnavigation">
        <NavLink className="brand" to="/" aria-label="trexlifting Startseite">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          <span className="brand-text">trexlifting</span>
        </NavLink>

        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
