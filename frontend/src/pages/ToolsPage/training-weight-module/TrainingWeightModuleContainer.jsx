import { TrainingWeightModulePanel } from "./TrainingWeightModulePanel";
import { calculateTrainingWeightRange, trainingWeightModuleConfig } from "./trainingWeightModule";

const createFallbackRow = () => ({
  id: "training-weight-row-fallback",
  selectedLift: "",
  reps: "5",
  rir: "2",
});

export function TrainingWeightModuleContainer({
  moduleInput,
  storedLifts,
  onModuleInputChange,
  onModuleRowAdd,
  onModuleRowRemove,
}) {
  const rows = moduleInput?.rows?.length ? moduleInput.rows : [createFallbackRow()];
  const calculations = rows.map((row) => ({
    ...row,
    calculation: calculateTrainingWeightRange({
      selectedLift: row.selectedLift ?? "",
      reps: row.reps ?? "",
      rir: row.rir ?? "",
      storedLifts,
    }),
  }));

  return (
    <TrainingWeightModulePanel
      rows={calculations}
      liftOptionGroups={trainingWeightModuleConfig.liftOptionGroups}
      repOptions={trainingWeightModuleConfig.repOptions}
      rirOptions={trainingWeightModuleConfig.rirOptions}
      onModuleInputChange={onModuleInputChange}
      onModuleRowAdd={onModuleRowAdd}
      onModuleRowRemove={onModuleRowRemove}
    />
  );
}
