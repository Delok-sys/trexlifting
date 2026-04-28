import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import {
  AboutPage,
  ContactPage,
  DashboardPage,
  HomePage,
  ImprintPage,
  NotFoundPage,
  ProductsPage,
  PrivacyPage,
} from "../pages";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/produkte" element={<ProductsPage />} />
        <Route path="/ueber-mich" element={<AboutPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/impressum" element={<ImprintPage />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
