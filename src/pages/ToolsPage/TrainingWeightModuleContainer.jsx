import { TrainingWeightModulePanel } from "./TrainingWeightModulePanel";
import { calculateTrainingWeightRange, trainingWeightModuleConfig } from "./trainingWeightModule";

export function TrainingWeightModuleContainer({
  instanceId,
  moduleInput,
  storedLifts,
  onModuleInputChange,
}) {
  const calculation = calculateTrainingWeightRange({
    selectedLift: moduleInput?.selectedLift ?? "",
    reps: moduleInput?.reps ?? "",
    rir: moduleInput?.rir ?? "",
    storedLifts,
  });

  return (
    <TrainingWeightModulePanel
      instanceId={instanceId}
      moduleInput={moduleInput}
      calculation={calculation}
      liftOptionGroups={trainingWeightModuleConfig.liftOptionGroups}
      repOptions={trainingWeightModuleConfig.repOptions}
      rirOptions={trainingWeightModuleConfig.rirOptions}
      onModuleInputChange={onModuleInputChange}
    />
  );
}
