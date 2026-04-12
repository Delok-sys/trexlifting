import { PlacedModuleCardContainer } from "./PlacedModuleCardContainer";

export function PlacedModulesSection({
  placedModules,
  draggedPlacedModuleId,
  moduleInputs,
  storedLifts,
  onPlacedDragStart,
  onDragEnd,
  onPlacedReorder,
  onRemoveModule,
  onModuleInputChange,
}) {
  if (placedModules.length === 0) {
    return (
      <p className="tools-empty-state">
        Noch kein Modul abgelegt. Ziehe unten ein Feature in den Ablagebereich.
      </p>
    );
  }

  return (
    <div className="card-grid" aria-label="Abgelegte Module">
      {placedModules.map((module) => (
        <PlacedModuleCardContainer
          key={module.instanceId}
          module={module}
          isDragging={draggedPlacedModuleId === module.instanceId}
          moduleInput={moduleInputs[module.instanceId]}
          storedLifts={storedLifts}
          onPlacedDragStart={onPlacedDragStart}
          onDragEnd={onDragEnd}
          onPlacedReorder={onPlacedReorder}
          onRemoveModule={onRemoveModule}
          onModuleInputChange={onModuleInputChange}
        />
      ))}
    </div>
  );
}
