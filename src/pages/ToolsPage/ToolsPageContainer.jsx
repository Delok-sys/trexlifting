import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolsPage } from "./ToolsPage";
import { saveOneRepMaxes, selectOneRepMaxState } from "../../store/slices/oneRepMaxSlice";

const toolSections = [
  {
    id: "dummy-feature",
    title: "Dummy Feature",
    description:
      "Dieser erste Bereich dient als Platzhalter fuer ein spaeteres Tool. Du kannst hier kuenftig Eingaben, Berechnungen oder kleine Trainings-Utilities unterbringen.",
    status: "In Vorbereitung",
  },
];

const initialLiftForm = {
  squat: { weight: "", reps: "", rir: "" },
  bench: { weight: "", reps: "", rir: "" },
  deadlift: { weight: "", reps: "", rir: "" },
};

export function ToolsPageContainer() {
  const dispatch = useDispatch();
  const { lifts, status, error } = useSelector(selectOneRepMaxState);
  const [infoMessage, setInfoMessage] = useState(
    "Ziehe ein Modul in den Ablagebereich oder waehle eine Aktion aus.",
  );
  const [liftForm, setLiftForm] = useState(initialLiftForm);
  const [placedModules, setPlacedModules] = useState([]);
  const [isDropActive, setIsDropActive] = useState(false);
  const [draggedPlacedModuleId, setDraggedPlacedModuleId] = useState(null);

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

  const handleLibraryDragStart = (event, module) => {
    event.dataTransfer.setData("text/tool-drag-source", "library");
    event.dataTransfer.setData("text/tool-module-id", module.id);
    event.dataTransfer.effectAllowed = "copy";
    setInfoMessage(`"${module.title}" kann jetzt im Ablagebereich abgelegt werden.`);
  };

  const handlePlacedDragStart = (event, module) => {
    event.dataTransfer.setData("text/tool-drag-source", "placed");
    event.dataTransfer.setData("text/tool-instance-id", module.instanceId);
    event.dataTransfer.effectAllowed = "move";
    setDraggedPlacedModuleId(module.instanceId);
    setInfoMessage(`"${module.title}" kann jetzt im oberen Bereich neu angeordnet werden.`);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDropActive(true);
  };

  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDropActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const dragSource = event.dataTransfer.getData("text/tool-drag-source");
    const moduleId = event.dataTransfer.getData("text/tool-module-id");
    const module = toolSections.find((item) => item.id === moduleId);

    setIsDropActive(false);
    setDraggedPlacedModuleId(null);

    if (dragSource !== "library") {
      return;
    }

    if (!module) {
      setInfoMessage("Das Modul konnte nicht abgelegt werden. Bitte versuche es erneut.");
      return;
    }

    setPlacedModules((currentModules) => [
      ...currentModules,
      {
        ...module,
        instanceId: `${module.id}-${currentModules.length + 1}`,
        instanceLabel: `Kopie ${currentModules.length + 1}`,
      },
    ]);
    setInfoMessage(`"${module.title}" wurde als neue Modul-Kopie abgelegt.`);
  };

  const handleDragEnd = () => {
    setIsDropActive(false);
    setDraggedPlacedModuleId(null);
  };

  const handlePlacedReorder = (event, targetInstanceId) => {
    event.preventDefault();
    const dragSource = event.dataTransfer.getData("text/tool-drag-source");
    const sourceInstanceId = event.dataTransfer.getData("text/tool-instance-id");

    if (dragSource !== "placed" || !sourceInstanceId || sourceInstanceId === targetInstanceId) {
      return;
    }

    setPlacedModules((currentModules) => {
      const sourceIndex = currentModules.findIndex((module) => module.instanceId === sourceInstanceId);
      const targetIndex = currentModules.findIndex((module) => module.instanceId === targetInstanceId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return currentModules;
      }

      const nextModules = [...currentModules];
      const [movedModule] = nextModules.splice(sourceIndex, 1);
      nextModules.splice(targetIndex, 0, movedModule);
      return nextModules;
    });

    setDraggedPlacedModuleId(null);
    setInfoMessage("Das Modul wurde im oberen Bereich neu angeordnet.");
  };

  const handleRemoveModule = (instanceId) => {
    setPlacedModules((currentModules) =>
      currentModules.filter((module) => module.instanceId !== instanceId),
    );
    setInfoMessage("Das Modul wurde aus dem oberen Bereich entfernt.");
  };

  return (
    <ToolsPage
      infoMessage={infoMessage}
      liftForm={liftForm}
      liftStatus={status}
      liftError={error}
      storedLifts={lifts}
      isDropActive={isDropActive}
      placedModules={placedModules}
      draggedPlacedModuleId={draggedPlacedModuleId}
      toolSections={toolSections}
      onLiftInputChange={handleLiftInputChange}
      onLiftSubmit={handleLiftSubmit}
      onPlaceholderAction={handlePlaceholderAction}
      onLibraryDragStart={handleLibraryDragStart}
      onPlacedDragStart={handlePlacedDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onPlacedReorder={handlePlacedReorder}
      onRemoveModule={handleRemoveModule}
    />
  );
}
