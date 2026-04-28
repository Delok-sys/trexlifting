import { useState } from "react";
import { useSelector } from "react-redux";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL ?? "http://localhost:3001/api/contact";

const INITIAL_FORM = {
  name: "",
  email: "",
  notes: "",
  includeDashboardData: false,
};

export function ContactPage({
  kicker,
  title,
  description,
}) {
  const reduxState = useSelector((state) => state);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (fieldName, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      notes: form.notes.trim(),
      includeDashboardData: form.includeDashboardData,
      dashboardData: form.includeDashboardData ? reduxState : null,
    };

    if (!payload.name || !payload.email || !payload.notes) {
      setStatus("error");
      setFeedback("Name, E-Mail und Notizen sind Pflichtfelder.");
      return;
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody.message ?? "Die Nachricht konnte nicht gesendet werden.");
      }

      setStatus("success");
      setFeedback("Nachricht wurde erfolgreich gesendet.");
      setForm(INITIAL_FORM);
    } catch (error) {
      setStatus("error");
      setFeedback(error.message ?? "Beim Senden ist ein Fehler aufgetreten.");
    }
  };

  return (
    <main className="page-shell">
      <section className="page-card page-stack">
        <p className="page-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="page-copy">{description}</p>

        <form className="page-stack" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="contact-name">
            <span>Name *</span>
            <input
              id="contact-name"
              type="text"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              required
            />
          </label>

          <label className="form-field" htmlFor="contact-email">
            <span>E-Mail *</span>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              required
            />
          </label>

          <label className="form-field" htmlFor="contact-notes">
            <span>Notizen *</span>
            <textarea
              id="contact-notes"
              className="contact-notes"
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              required
            />
          </label>

          <label className="contact-checkbox" htmlFor="contact-include-dashboard-data">
            <input
              id="contact-include-dashboard-data"
              type="checkbox"
              checked={form.includeDashboardData}
              onChange={(event) => handleChange("includeDashboardData", event.target.checked)}
            />
            <span>Daten aus Dashboard uebernehmen</span>
          </label>

          <div className="action-row">
            <button className="button button--primary" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Wird gesendet..." : "Nachricht senden"}
            </button>
            {status === "success" ? <span className="status-pill">Gesendet</span> : null}
          </div>

          {feedback ? (
            <p className={`form-feedback${status === "error" ? " form-feedback--error" : ""}`}>
              {feedback}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
