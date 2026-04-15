import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolsPage } from "./ToolsPage";
import { saveOneRepMaxes, selectOneRepMaxState } from "../../store/slices/oneRepMaxSlice";

const toolSections = [
  {
    id: "training-weight-range",
    title: "Trainingsgewicht Rechner",
    description:
      "Waehlt eine Uebungsvariation und gibt fuer Wiederholungen plus RIR eine konkrete Gewichtsrange auf Basis deines gespeicherten 1RM aus.",
    status: "Verfuegbar",
  },
  {
    id: "meet-attempt-planner",
    title: "Wettkampf Versuchswahl",
    description:
      "Berechnet fuer Kniebeuge, Bankdruecken und Kreuzheben Opener-, Zweit- und Drittversuch auf Basis deiner gespeicherten 1RMs.",
    status: "Verfuegbar",
  },
];

const initialLiftForm = {
  squat: { weight: "", reps: "", rir: "" },
  bench: { weight: "", reps: "", rir: "" },
  deadlift: { weight: "", reps: "", rir: "" },
};

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

export function ToolsPageContainer() {
  const dispatch = useDispatch();
  const { lifts, status, error } = useSelector(selectOneRepMaxState);
  const [infoMessage, setInfoMessage] = useState(
    "Waehle unter dem 1RM Rechner ein Modul aus, um es direkt zu oeffnen.",
  );
  const [liftForm, setLiftForm] = useState(initialLiftForm);
  const [activeModuleId, setActiveModuleId] = useState(toolSections[0].id);
  const [moduleInputs, setModuleInputs] = useState({
    "training-weight-range": createInitialModuleInput(),
  });

  useEffect(() => {
    if (status === "succeeded") {
      setInfoMessage("Die 1RM-Werte wurden aktualisiert.");
    }

    if (status === "failed" && error) {
      setInfoMessage(error);
    }
  }, [error, status]);

  const handlePlaceholderAction = (label) => {
    setInfoMessage(`${label} ist bald verfuegbar. Hier entsteht gerade noch etwas.`);
  };

  const handleLiftInputChange = (liftKey, fieldName, value) => {
    setLiftForm((currentForm) => ({
      ...currentForm,
      [liftKey]: {
        ...currentForm[liftKey],
        [fieldName]: value,
      },
    }));
  };

  const handleLiftSubmit = async (event) => {
    event.preventDefault();

    const resultAction = await dispatch(saveOneRepMaxes(liftForm));

    if (saveOneRepMaxes.fulfilled.match(resultAction)) {
      setLiftForm(initialLiftForm);
    }
  };

  const handleModuleToggle = (moduleId) => {
    const selectedModule = toolSections.find((module) => module.id === moduleId);

    if (!selectedModule) {
      return;
    }

    setActiveModuleId((currentModuleId) => (currentModuleId === moduleId ? currentModuleId : moduleId));
    setInfoMessage(`"${selectedModule.title}" ist jetzt geoeffnet.`);
  };

  const handleModuleInputChange = (moduleId, fieldName, value) => {
    setModuleInputs((currentInputs) => {
      const moduleInput = currentInputs[moduleId] ?? createInitialModuleInput();

      return {
        ...currentInputs,
        [moduleId]: {
          ...moduleInput,
          rows: moduleInput.rows.map((row) =>
            row.id === fieldName ? { ...row, [value.fieldName]: value.fieldValue } : row,
          ),
        },
      };
    });
  };

  const handleModuleRowAdd = (moduleId) => {
    setModuleInputs((currentInputs) => {
      const moduleInput = currentInputs[moduleId] ?? createInitialModuleInput();

      return {
        ...currentInputs,
        [moduleId]: {
          ...moduleInput,
          rows: [...moduleInput.rows, createTrainingWeightRow()],
        },
      };
    });
  };

  const handleModuleRowRemove = (moduleId, rowId) => {
    setModuleInputs((currentInputs) => {
      const moduleInput = currentInputs[moduleId] ?? createInitialModuleInput();
      const nextRows = moduleInput.rows.filter((row) => row.id !== rowId);

      return {
        ...currentInputs,
        [moduleId]: {
          ...moduleInput,
          rows: nextRows.length > 0 ? nextRows : [createTrainingWeightRow()],
        },
      };
    });
  };

  return (
    <ToolsPage
      infoMessage={infoMessage}
      liftForm={liftForm}
      liftStatus={status}
      liftError={error}
      storedLifts={lifts}
      activeModuleId={activeModuleId}
      toolSections={toolSections}
      moduleInputs={moduleInputs}
      onLiftInputChange={handleLiftInputChange}
      onLiftSubmit={handleLiftSubmit}
      onModuleToggle={handleModuleToggle}
      onPlaceholderAction={handlePlaceholderAction}
      onModuleInputChange={handleModuleInputChange}
      onModuleRowAdd={handleModuleRowAdd}
      onModuleRowRemove={handleModuleRowRemove}
    />
  );
}
