import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Tools", path: "/tools" },
  { label: "Angebot", path: "/angebot" },
  { label: "Erfahrungen", path: "/erfahrungen" },
  { label: "Über mich", path: "/ueber-mich" },
];

export function Navbar({ isLoggedIn }) {
  const accountLabel = isLoggedIn ? "Mein Account" : "Account";

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Hauptnavigation">
        <NavLink className="brand" to="/" aria-label="TrexLifting Startseite">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          <span className="brand-text">TrexLifting</span>
        </NavLink>

        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
              to={item.path}
              end={item.path === "/"}
            >
              {item.label}
            </NavLink>
          ))}

          <NavLink
            className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            to="/account"
          >
            {accountLabel}
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
