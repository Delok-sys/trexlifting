import { useState } from "react";

export function HomePage({
  kicker,
  title,
  description,
}) {
  const [demoMessage, setDemoMessage] = useState("");
  const [requestState, setRequestState] = useState("idle");

  async function handleDemoClick() {
    try {
      setRequestState("loading");

      const response = await fetch("/api/demo-message");

      if (!response.ok) {
        throw new Error("Die Demo-Nachricht konnte nicht geladen werden.");
      }

      const data = await response.json();

      setDemoMessage(data.message);
      setRequestState("success");
    } catch (error) {
      setDemoMessage(error.message);
      setRequestState("error");
    }
  }

  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--lg">
        <div>
        <p className="page-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="page-copy">{description}</p>
        </div>

        <section className="panel panel--soft">
          <div className="page-section-head">
            <p className="section-kicker">Backend Demo</p>
            <h2>Button klickt, Server antwortet</h2>
          </div>

          <p className="page-copy">
            Mit diesem Button holst du eine Testnachricht direkt aus dem
            neuen Backend.
          </p>

          <div className="action-row">
            <button
              className="button button--primary"
              type="button"
              onClick={handleDemoClick}
              disabled={requestState === "loading"}
            >
              {requestState === "loading"
                ? "Nachricht wird geladen..."
                : "Demo-Nachricht abrufen"}
            </button>

            {requestState === "success" ? (
              <span className="status-pill">Verbunden</span>
            ) : null}
          </div>

          {demoMessage ? (
            <p
              className={`form-feedback${
                requestState === "error" ? " form-feedback--error" : ""
              }`}
            >
              {demoMessage}
            </p>
          ) : null}
        </section>
      </section>
    </main>
  );
}
