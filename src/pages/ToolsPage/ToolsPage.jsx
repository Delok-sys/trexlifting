import "../../styles/ToolsPage.css";

export function ToolsPage({
  infoMessage,
  liftForm,
  liftStatus,
  liftError,
  storedLifts,
  isDropActive,
  placedModules,
  draggedPlacedModuleId,
  toolSections,
  onLiftInputChange,
  onLiftSubmit,
  onPlaceholderAction,
  onLibraryDragStart,
  onPlacedDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onPlacedReorder,
  onRemoveModule,
}) {
  const liftLabels = {
    squat: "Kniebeuge",
    bench: "Bankdruecken",
    deadlift: "Kreuzheben",
  };

  return (
    <main className="page-shell">
      <section className="page-card page-stack page-stack--lg">
        <div className="page-stack page-stack--sm">
          <p className="page-kicker">Tools</p>
          <h1>Dein Arbeitsbereich fuer Tools</h1>
          <p className="page-copy">
            Hier entsteht ein nutzbarer Bereich fuer kleine Helfer, Rechner und Trainings-Features.
            Module koennen bereits per Drag-and-Drop in den oberen Ablagebereich gezogen werden.
          </p>
        </div>

        <section className="tools-toolbar" aria-label="Tool-Aktionen">
          <div className="page-stack">
            <section className="panel page-stack" aria-labelledby="tools-lift-form-title">
              <div className="page-section-head">
                <p className="section-kicker">1RM Rechner</p>
                <h2 id="tools-lift-form-title">Lifts eintragen</h2>
              </div>

              <p className="page-copy">
                Trage Gewicht, Wiederholungen und RIR ein. Wenn nur das Gewicht gesetzt ist, rechnen
                wir automatisch mit 1 Wiederholung und 0 RIR.
              </p>

              <form className="page-stack" onSubmit={onLiftSubmit}>
                {Object.entries(liftLabels).map(([liftKey, label]) => (
                  <fieldset key={liftKey} className="tools-lift-fieldset panel panel--soft">
                    <legend>{label}</legend>

                    <label className="form-field">
                      <span>Gewicht</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={liftForm[liftKey].weight}
                        onChange={(event) => onLiftInputChange(liftKey, "weight", event.target.value)}
                        placeholder="z. B. 100"
                      />
                    </label>

                    <label className="form-field">
                      <span>Wiederholungen</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={liftForm[liftKey].reps}
                        onChange={(event) => onLiftInputChange(liftKey, "reps", event.target.value)}
                        placeholder="1"
                      />
                    </label>

                    <label className="form-field">
                      <span>RIR</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={liftForm[liftKey].rir}
                        onChange={(event) => onLiftInputChange(liftKey, "rir", event.target.value)}
                        placeholder="0"
                      />
                    </label>

                    <div className="result-panel">
                      <span>Gespeichertes 1RM</span>
                      <strong>
                        {storedLifts[liftKey].oneRepMax ? `${storedLifts[liftKey].oneRepMax} kg` : "-"}
                      </strong>
                    </div>
                  </fieldset>
                ))}

                <div className="action-row">
                  <button type="submit" className="button button--primary" disabled={liftStatus === "loading"}>
                    {liftStatus === "loading" ? "Berechne..." : "1RM speichern"}
                  </button>

                  {liftError ? <p className="form-feedback form-feedback--error">{liftError}</p> : null}
                </div>
              </form>
            </section>

            {placedModules.length > 0 ? (
              <div className="card-grid" aria-label="Abgelegte Module">
                {placedModules.map((module) => (
                  <article
                    key={module.instanceId}
                    className={
                      draggedPlacedModuleId === module.instanceId
                        ? "feature-card feature-card--placed is-dragging"
                        : "feature-card feature-card--placed"
                    }
                    draggable
                    onDragStart={(event) => onPlacedDragStart(event, module)}
                    onDragEnd={onDragEnd}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => onPlacedReorder(event, module.instanceId)}
                  >
                    <div className="feature-card-meta">
                      <span className="status-pill">{module.instanceLabel}</span>
                      <button
                        type="button"
                        className="button button--ghost button--small"
                        onClick={() => onRemoveModule(module.instanceId)}
                      >
                        Entfernen
                      </button>
                    </div>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                    <div className="feature-placeholder" aria-hidden="true">
                      <div className="placeholder-line" />
                      <div className="placeholder-line placeholder-line--short" />
                      <div className="placeholder-box" />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="tools-empty-state">
                Noch kein Modul abgelegt. Ziehe unten ein Feature in den Ablagebereich.
              </p>
            )}

            <div
              className={isDropActive ? "tools-dropzone is-active" : "tools-dropzone"}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <p className="tools-dropzone-label">Modul hier ablegen</p>
              <p className="tools-dropzone-copy">
                Ziehe ein Modul aus dem Bereich "Erste Module" hier hinein. Es wird als Kopie oberhalb
                dieses Feldes eingefuegt.
              </p>
            </div>
          </div>

          <div className="action-row">
            <button type="button" className="button button--primary" onClick={() => onPlaceholderAction("Herunterladen")}>
              Herunterladen
            </button>
            <button type="button" className="button button--secondary" onClick={() => onPlaceholderAction("Speichern")}>
              Speichern
            </button>
          </div>

          <p className="tools-info-banner" aria-live="polite">
            {infoMessage}
          </p>
        </section>

        <section className="tools-workspace" aria-labelledby="tools-feature-area">
          <div className="page-section-head">
            <p className="section-kicker">Feature Bereich</p>
            <h2 id="tools-feature-area">Erste Module</h2>
          </div>

          <div className="card-grid">
            {toolSections.map((section) => (
              <article
                key={section.id}
                className="feature-card feature-card--draggable"
                draggable
                onDragStart={(event) => onLibraryDragStart(event, section)}
                onDragEnd={onDragEnd}
              >
                <div className="feature-card-meta">
                  <span className="status-pill">{section.status}</span>
                </div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <div className="feature-placeholder" aria-hidden="true">
                  <div className="placeholder-line" />
                  <div className="placeholder-line placeholder-line--short" />
                  <div className="placeholder-box" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
