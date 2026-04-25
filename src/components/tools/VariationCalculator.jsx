import { useState } from "react";
import "../../styles/ToolsPage.css";
import { useStrengthProfile } from "../../context/StrengthProfileContext";
import { TrainingWeightModuleContainer } from "../../pages/ToolsPage/training-weight-module/TrainingWeightModuleContainer";

let trainingWeightRowIdCounter = 0;

const createTrainingWeightRow = () => ({
  id: `training-weight-row-${trainingWeightRowIdCounter++}`,
  selectedLift: "",
  reps: "5",
  rir: "2",
});

const createInitialModuleInput = () => ({
  rows: [createTrainingWeightRow()],
});

export function VariationCalculator() {
  const { profile } = useStrengthProfile();
  const [moduleInput, setModuleInput] = useState(createInitialModuleInput);

  const handleModuleInputChange = (_moduleId, fieldName, value) => {
    setModuleInput((currentInput) => ({
      ...currentInput,
      rows: currentInput.rows.map((row) =>
        row.id === fieldName ? { ...row, [value.fieldName]: value.fieldValue } : row,
      ),
    }));
  };

  const handleModuleRowAdd = () => {
    setModuleInput((currentInput) => ({
      ...currentInput,
      rows: [...currentInput.rows, createTrainingWeightRow()],
    }));
  };

  const handleModuleRowRemove = (_moduleId, rowId) => {
    setModuleInput((currentInput) => {
      const nextRows = currentInput.rows.filter((row) => row.id !== rowId);

      return {
        ...currentInput,
        rows: nextRows.length > 0 ? nextRows : [createTrainingWeightRow()],
      };
    });
  };

  return (
    <TrainingWeightModuleContainer
      moduleInput={moduleInput}
      storedLifts={profile.lifts}
      onModuleInputChange={handleModuleInputChange}
      onModuleRowAdd={handleModuleRowAdd}
      onModuleRowRemove={handleModuleRowRemove}
    />
  );
}
