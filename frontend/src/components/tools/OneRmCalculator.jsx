import { useState } from "react";
import "../../styles/ToolsPage.css";
import { useStrengthProfile } from "../../context/StrengthProfileContext";
import { LiftCalculatorPanel } from "../../pages/ToolsPage/lift-calculator/LiftCalculatorPanel";

const initialLiftForm = {
  squat: { weight: "", reps: "", rir: "" },
  bench: { weight: "", reps: "", rir: "" },
  deadlift: { weight: "", reps: "", rir: "" },
};

export function OneRmCalculator() {
  const { profile, saveOneRepMaxes } = useStrengthProfile();
  const [liftForm, setLiftForm] = useState(initialLiftForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleLiftInputChange = (liftKey, fieldName, value) => {
    setLiftForm((currentForm) => ({
      ...currentForm,
      [liftKey]: {
        ...currentForm[liftKey],
        [fieldName]: value,
      },
    }));
  };

  const handleLiftSubmit = (event) => {
    event.preventDefault();
    setError("");
    setStatus("loading");

    try {
      saveOneRepMaxes(liftForm);
      setLiftForm(initialLiftForm);
      setStatus("succeeded");
    } catch (submissionError) {
      setStatus("failed");
      setError(submissionError.message);
    }
  };

  return (
    <LiftCalculatorPanel
      liftForm={liftForm}
      liftStatus={status === "loading" ? "loading" : "idle"}
      liftError={error}
      storedLifts={profile.lifts}
      onLiftInputChange={handleLiftInputChange}
      onLiftSubmit={handleLiftSubmit}
    />
  );
}
