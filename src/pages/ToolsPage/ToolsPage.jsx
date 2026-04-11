import "../../styles/ToolsPage.css";
import { ToolLibrarySection } from "./ToolLibrarySection";
import { ToolsToolbar } from "./ToolsToolbar";

export function ToolsPage({
  infoMessage,
  liftForm,
  liftStatus,
  liftError,
  storedLifts,
  moduleInputs,
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
  onModuleInputChange,
}) {
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

        <ToolsToolbar
          infoMessage={infoMessage}
          liftForm={liftForm}
          liftStatus={liftStatus}
          liftError={liftError}
          storedLifts={storedLifts}
          moduleInputs={moduleInputs}
          isDropActive={isDropActive}
          placedModules={placedModules}
          draggedPlacedModuleId={draggedPlacedModuleId}
          onLiftInputChange={onLiftInputChange}
          onLiftSubmit={onLiftSubmit}
          onPlaceholderAction={onPlaceholderAction}
          onPlacedDragStart={onPlacedDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          onPlacedReorder={onPlacedReorder}
          onRemoveModule={onRemoveModule}
          onModuleInputChange={onModuleInputChange}
        />

        <ToolLibrarySection
          toolSections={toolSections}
          onLibraryDragStart={onLibraryDragStart}
          onDragEnd={onDragEnd}
        />
      </section>
    </main>
  );
}
