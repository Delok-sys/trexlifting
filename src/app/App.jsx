import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import {
  AboutPage,
  AccountPage,
  ContactPage,
  ExperiencesPage,
  HomePage,
  ImprintPage,
  NotFoundPage,
  OfferPage,
  PrivacyPage,
  ToolsPage,
} from "../pages";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/angebot" element={<OfferPage />} />
        <Route path="/erfahrungen" element={<ExperiencesPage />} />
        <Route path="/ueber-mich" element={<AboutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/impressum" element={<ImprintPage />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
