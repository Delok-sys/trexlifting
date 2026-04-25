import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createEmptyLiftMap,
  LIFT_KEYS,
  normalizeLiftInput,
  STRENGTH_PROFILE_STORAGE_KEY,
} from "../lib/strengthCalculations";

const defaultProfile = {
  bodyweight: "",
  experienceLevel: "",
  goal: "",
  nextCompetition: "",
  notes: "",
  lifts: createEmptyLiftMap(),
};

function loadInitialProfile() {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const saved = window.localStorage.getItem(STRENGTH_PROFILE_STORAGE_KEY);

    if (!saved) {
      return defaultProfile;
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultProfile,
      ...parsed,
      lifts: {
        ...createEmptyLiftMap(),
        ...(parsed?.lifts ?? {}),
      },
    };
  } catch {
    return defaultProfile;
  }
}

const StrengthProfileContext = createContext(null);

export function StrengthProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadInitialProfile);

  useEffect(() => {
    window.localStorage.setItem(STRENGTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const hasAnyOneRepMax = useMemo(
    () => LIFT_KEYS.some((liftKey) => Boolean(profile.lifts?.[liftKey]?.oneRepMax)),
    [profile.lifts],
  );

  const updateProfileFields = (nextFields) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      ...nextFields,
    }));
  };

  const updateLiftOneRepMax = (liftKey, oneRepMax) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      lifts: {
        ...currentProfile.lifts,
        [liftKey]: {
          ...currentProfile.lifts[liftKey],
          oneRepMax,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const saveOneRepMaxes = (liftInputs) => {
    const updatedLifts = {};

    for (const liftKey of LIFT_KEYS) {
      const normalizedLift = normalizeLiftInput(liftKey, liftInputs[liftKey] ?? {});

      if (normalizedLift) {
        updatedLifts[liftKey] = normalizedLift;
      }
    }

    if (Object.keys(updatedLifts).length === 0) {
      throw new Error("Trage mindestens fuer einen Lift ein Gewicht ein.");
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      lifts: {
        ...currentProfile.lifts,
        ...updatedLifts,
      },
    }));

    return updatedLifts;
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  const value = {
    profile,
    hasAnyOneRepMax,
    updateProfileFields,
    updateLiftOneRepMax,
    saveOneRepMaxes,
    resetProfile,
  };

  return <StrengthProfileContext.Provider value={value}>{children}</StrengthProfileContext.Provider>;
}

export function useStrengthProfile() {
  const context = useContext(StrengthProfileContext);

  if (!context) {
    throw new Error("useStrengthProfile muss innerhalb des StrengthProfileProvider verwendet werden.");
  }

  return context;
}
