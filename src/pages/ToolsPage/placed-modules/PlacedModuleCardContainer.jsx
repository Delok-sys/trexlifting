import { PlacedModuleCard } from "./PlacedModuleCard";
import { TrainingWeightModuleContainer } from "../training-weight-module/TrainingWeightModuleContainer";

function renderModuleContent(module, moduleInput, storedLifts, onModuleInputChange) {
  if (module.id === "training-weight-range") {
    return (
      <TrainingWeightModuleContainer
        instanceId={module.instanceId}
        moduleInput={moduleInput}
        storedLifts={storedLifts}
        onModuleInputChange={onModuleInputChange}
      />
    );
  }

  return (
    <div className="feature-placeholder" aria-hidden="true">
      <div className="placeholder-line" />
      <div className="placeholder-line placeholder-line--short" />
      <div className="placeholder-box" />
    </div>
  );
}

export function PlacedModuleCardContainer(props) {
  const { module, moduleInput, storedLifts, onModuleInputChange } = props;

  return (
    <PlacedModuleCard
      {...props}
      moduleContent={renderModuleContent(module, moduleInput, storedLifts, onModuleInputChange)}
    />
  );
}
