import { LiftCalculatorPanel } from "./LiftCalculatorPanel";
import { PlacedModulesSection } from "./PlacedModulesSection";

export function ToolsToolbar({
  infoMessage,
  liftForm,
  liftStatus,
  liftError,
  storedLifts,
  moduleInputs,
  isDropActive,
  placedModules,
  draggedPlacedModuleId,
  onLiftInputChange,
  onLiftSubmit,
  onPlaceholderAction,
  onPlacedDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onPlacedReorder,
  onRemoveModule,
  onModuleInputChange,
}) {
  return (
    <section className="tools-toolbar" aria-label="Tool-Aktionen">
      <div className="page-stack">
        <LiftCalculatorPanel
          liftForm={liftForm}
          liftStatus={liftStatus}
          liftError={liftError}
          storedLifts={storedLifts}
          onLiftInputChange={onLiftInputChange}
          onLiftSubmit={onLiftSubmit}
        />

        <PlacedModulesSection
          placedModules={placedModules}
          draggedPlacedModuleId={draggedPlacedModuleId}
          moduleInputs={moduleInputs}
          storedLifts={storedLifts}
          onPlacedDragStart={onPlacedDragStart}
          onDragEnd={onDragEnd}
          onPlacedReorder={onPlacedReorder}
          onRemoveModule={onRemoveModule}
          onModuleInputChange={onModuleInputChange}
        />

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
  );
}
