import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../../components";

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
