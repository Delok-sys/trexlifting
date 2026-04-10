import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../../components";

export function AppLayout() {
  const isLoggedIn = false;

  return (
    <div className="app-shell">
      <Navbar isLoggedIn={isLoggedIn} />
      <Outlet />
      <Footer />
    </div>
  );
}
