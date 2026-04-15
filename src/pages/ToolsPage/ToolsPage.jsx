import "../../styles/ToolsPage.css";
import { ToolsToolbar } from "./placed-modules/ToolsToolbar";

export function ToolsPage({
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
    <main className="page-shell">
      <section className="page-card page-stack page-stack--lg">
        <div className="page-stack page-stack--sm">
          <p className="page-kicker">Tools</p>
          <h1>Dein Arbeitsbereich fuer Tools</h1>
        </div>

        <ToolsToolbar
          infoMessage={infoMessage}
          liftForm={liftForm}
          liftStatus={liftStatus}
          liftError={liftError}
          storedLifts={storedLifts}
          activeModuleId={activeModuleId}
          toolSections={toolSections}
          moduleInputs={moduleInputs}
          onLiftInputChange={onLiftInputChange}
          onLiftSubmit={onLiftSubmit}
          onModuleToggle={onModuleToggle}
          onPlaceholderAction={onPlaceholderAction}
          onModuleInputChange={onModuleInputChange}
          onModuleRowAdd={onModuleRowAdd}
          onModuleRowRemove={onModuleRowRemove}
        />
      </section>
    </main>
  );
}
