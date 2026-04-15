import { LiftCalculatorPanel } from "../lift-calculator/LiftCalculatorPanel";
import { ToolLibrarySection } from "../tool-library/ToolLibrarySection";

export function ToolsToolbar({
  infoMessage,
  liftForm,
  liftStatus,
  liftError,
  storedLifts,
  activeModuleId,
  toolSections,
  moduleInputs,
  onLiftInputChange,
  onLiftSubmit,
  onModuleToggle,
  onPlaceholderAction,
  onModuleInputChange,
  onModuleRowAdd,
  onModuleRowRemove,
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

        <ToolLibrarySection
          toolSections={toolSections}
          activeModuleId={activeModuleId}
          moduleInputs={moduleInputs}
          storedLifts={storedLifts}
          onModuleToggle={onModuleToggle}
          onModuleInputChange={onModuleInputChange}
          onModuleRowAdd={onModuleRowAdd}
          onModuleRowRemove={onModuleRowRemove}
        />
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
