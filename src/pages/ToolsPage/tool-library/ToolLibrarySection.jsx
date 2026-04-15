import { MeetAttemptPlannerContainer } from "../meet-attempt-planner/MeetAttemptPlannerContainer";
import { TrainingWeightModuleContainer } from "../training-weight-module/TrainingWeightModuleContainer";
import { ToolLibraryCard } from "./ToolLibraryCard";

function renderModuleContent(
  activeModuleId,
  moduleInputs,
  storedLifts,
  onModuleInputChange,
  onModuleRowAdd,
  onModuleRowRemove,
) {
  if (activeModuleId === "training-weight-range") {
    return (
      <TrainingWeightModuleContainer
        moduleInput={moduleInputs[activeModuleId]}
        storedLifts={storedLifts}
        onModuleInputChange={onModuleInputChange}
        onModuleRowAdd={onModuleRowAdd}
        onModuleRowRemove={onModuleRowRemove}
      />
    );
  }

  if (activeModuleId === "meet-attempt-planner") {
    return <MeetAttemptPlannerContainer storedLifts={storedLifts} />;
  }

  return null;
}

export function ToolLibrarySection({
  toolSections,
  activeModuleId,
  moduleInputs,
  storedLifts,
  onModuleToggle,
  onModuleInputChange,
  onModuleRowAdd,
  onModuleRowRemove,
}) {
  const activeModule = toolSections.find((section) => section.id === activeModuleId);

  return (
    <section className="tools-workspace" aria-labelledby="tools-feature-area">
      <div className="page-section-head">
        <p className="section-kicker">Module</p>
        <h2 id="tools-feature-area">Werkzeuge direkt oeffnen</h2>
      </div>

      <div className="tools-module-tabs">
        <div className="tools-module-picker" role="tablist" aria-label="Verfuegbare Module">
          {toolSections.map((section) => (
            <ToolLibraryCard
              key={section.id}
              section={section}
              isActive={section.id === activeModuleId}
              onOpen={() => onModuleToggle(section.id)}
            />
          ))}
        </div>

        {activeModule ? (
          <section
            className="tools-module-shell panel"
            id={`tools-module-panel-${activeModule.id}`}
            role="tabpanel"
            aria-labelledby={`tools-module-tab-${activeModule.id}`}
          >
            <div className="page-section-head">
              <h3>{activeModule.title}</h3>
            </div>

            {renderModuleContent(
              activeModuleId,
              moduleInputs,
              storedLifts,
              onModuleInputChange,
              onModuleRowAdd,
              onModuleRowRemove,
            )}
          </section>
        ) : null}
      </div>
    </section>
  );
}
