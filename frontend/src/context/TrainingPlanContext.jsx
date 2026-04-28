import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildWorkoutRecommendation,
  createSmartStrengthBlock,
  TRAINING_PLAN_STORAGE_KEY,
} from "../lib/trainingPlanEngine";

const defaultState = {
  block: null,
  feedbackBySession: {},
};

function loadInitialState() {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(TRAINING_PLAN_STORAGE_KEY);

    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw);

    return {
      ...defaultState,
      ...parsed,
      feedbackBySession: {
        ...(parsed?.feedbackBySession ?? {}),
      },
    };
  } catch {
    return defaultState;
  }
}

const TrainingPlanContext = createContext(null);

function buildFeedbackKey(blockId, weekNumber, dayId) {
  return `${blockId}::week-${weekNumber}::${dayId}`;
}

export function TrainingPlanProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(TRAINING_PLAN_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createTrainingBlock = ({ builderInput, profile, manualOneRms, useDemoValues }) => {
    const block = createSmartStrengthBlock({ builderInput, profile, manualOneRms, useDemoValues });

    setState((currentState) => ({
      ...currentState,
      block,
      feedbackBySession: {},
    }));

    return block;
  };

  const setCurrentWeek = (weekNumber) => {
    setState((currentState) => {
      if (!currentState.block) {
        return currentState;
      }

      const boundedWeek = Math.min(
        Math.max(1, weekNumber),
        currentState.block.settings.durationWeeks,
      );

      return {
        ...currentState,
        block: {
          ...currentState.block,
          currentWeek: boundedWeek,
        },
      };
    });
  };

  const saveWorkoutFeedback = ({ weekNumber, dayId, feedback }) => {
    if (!state.block) {
      throw new Error("Kein aktiver Trainingsblock vorhanden.");
    }

    const recommendation = buildWorkoutRecommendation({
      plannedRpe: feedback.plannedRpe,
      actualRpe: feedback.actualRpe,
      completedAllReps: feedback.completedAllReps,
      techniqueStable: feedback.techniqueStable,
    });

    const key = buildFeedbackKey(state.block.id, weekNumber, dayId);

    setState((currentState) => ({
      ...currentState,
      feedbackBySession: {
        ...currentState.feedbackBySession,
        [key]: {
          ...feedback,
          recommendation,
          savedAt: new Date().toISOString(),
        },
      },
    }));

    return recommendation;
  };

  const clearTrainingBlock = () => {
    setState(defaultState);
  };

  const getWorkoutFeedback = (weekNumber, dayId) => {
    if (!state.block) {
      return null;
    }

    const key = buildFeedbackKey(state.block.id, weekNumber, dayId);
    return state.feedbackBySession[key] ?? null;
  };

  const value = useMemo(
    () => ({
      block: state.block,
      feedbackBySession: state.feedbackBySession,
      hasBlock: Boolean(state.block),
      createTrainingBlock,
      setCurrentWeek,
      saveWorkoutFeedback,
      getWorkoutFeedback,
      clearTrainingBlock,
    }),
    [state],
  );

  return <TrainingPlanContext.Provider value={value}>{children}</TrainingPlanContext.Provider>;
}

export function useTrainingPlan() {
  const context = useContext(TrainingPlanContext);

  if (!context) {
    throw new Error("useTrainingPlan muss innerhalb des TrainingPlanProvider verwendet werden.");
  }

  return context;
}
