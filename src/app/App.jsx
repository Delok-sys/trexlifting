import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import {
  AboutPage,
  CoachingPage,
  ContactPage,
  DashboardPage,
  HomePage,
  ImprintPage,
  NotFoundPage,
  PrivacyPage,
} from "../pages";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/strength-profil" element={<Navigate to="/dashboard" replace />} />
        <Route path="/planung" element={<Navigate to="/dashboard" replace />} />
        <Route path="/analyse" element={<Navigate to="/dashboard" replace />} />
        <Route path="/wettkampf" element={<Navigate to="/dashboard" replace />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/ueber-mich" element={<AboutPage />} />

        <Route path="/tools" element={<Navigate to="/dashboard" replace />} />
        <Route path="/angebot" element={<Navigate to="/coaching" replace />} />
        <Route path="/smart-strength-plan" element={<Navigate to="/dashboard" replace />} />
        <Route path="/technik-analyse" element={<Navigate to="/dashboard" replace />} />
        <Route path="/erfahrungen" element={<Navigate to="/coaching" replace />} />
        <Route path="/account" element={<Navigate to="/dashboard" replace />} />

        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/impressum" element={<ImprintPage />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
