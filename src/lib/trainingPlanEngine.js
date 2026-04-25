import {
  calculateTrainingWeight,
  estimateWeightFromRpe,
  formatWeight,
  getBackoffWeight,
  parseDecimalInput,
  roundToNearestIncrement,
} from "./strengthCalculations";

export const TRAINING_PLAN_STORAGE_KEY = "trexlifting.training-plan.v1";

export const PLAN_GOAL_OPTIONS = [
  "Kraftaufbau",
  "Muskelaufbau / Hypertrophie",
  "Technik verbessern",
  "Wettkampfvorbereitung",
];

export const PLAN_DURATION_OPTIONS = [4, 6, 8];
export const PLAN_TRAINING_DAYS_OPTIONS = [3, 4, 5];
export const PLAN_FOCUS_OPTIONS = ["Squat", "Bench", "Deadlift", "Gesamt"];
export const PLAN_EXPERIENCE_OPTIONS = ["Anfaenger", "Fortgeschritten", "Wettkaempfer"];

const DEMO_ONE_RMS = {
  squat: 160,
  bench: 110,
  deadlift: 190,
};

const DAY_TEMPLATES = [
  {
    id: "day-1",
    title: "Tag 1 - Squat Fokus",
    mainLift: "squat",
    variationLift: "bench",
    variationName: "Bench Variation",
    accessoryPrimary: "Posterior Chain Accessory",
    accessorySecondary: "Core",
  },
  {
    id: "day-2",
    title: "Tag 2 - Bench Fokus",
    mainLift: "bench",
    variationLift: "squat",
    variationName: "Squat Variation",
    accessoryPrimary: "Upper Back",
    accessorySecondary: "Triceps",
  },
  {
    id: "day-3",
    title: "Tag 3 - Deadlift Fokus",
    mainLift: "deadlift",
    variationLift: "bench",
    variationName: "Bench Volume",
    accessoryPrimary: "Hamstrings",
    accessorySecondary: "Core",
  },
  {
    id: "day-4",
    title: "Tag 4 - Volume / Secondary",
    mainLift: "squat",
    secondaryMainLift: "bench",
    variationName: "Secondary Squat oder Pause Squat",
    secondaryVariationName: "Secondary Bench oder Close Grip Bench",
    accessoryPrimary: "Row Variation",
    accessorySecondary: "Optional Accessory",
  },
];

function mapProfileGoal(goal) {
  if (goal === "Muskelaufbau") {
    return "Muskelaufbau / Hypertrophie";
  }

  return PLAN_GOAL_OPTIONS.includes(goal) ? goal : "Kraftaufbau";
}

function mapProfileExperience(experienceLevel) {
  if (experienceLevel === "Einsteiger") {
    return "Anfaenger";
  }

  if (experienceLevel === "Wettkampfathlet") {
    return "Wettkaempfer";
  }

  return PLAN_EXPERIENCE_OPTIONS.includes(experienceLevel) ? experienceLevel : "Fortgeschritten";
}

function resolveBuilderInput(builderInput = {}, profile = {}) {
  return {
    goal: PLAN_GOAL_OPTIONS.includes(builderInput.goal)
      ? builderInput.goal
      : mapProfileGoal(profile.goal),
    durationWeeks: PLAN_DURATION_OPTIONS.includes(Number(builderInput.durationWeeks))
      ? Number(builderInput.durationWeeks)
      : 4,
    trainingDaysPerWeek: PLAN_TRAINING_DAYS_OPTIONS.includes(Number(builderInput.trainingDaysPerWeek))
      ? Number(builderInput.trainingDaysPerWeek)
      : 4,
    focusLift: PLAN_FOCUS_OPTIONS.includes(builderInput.focusLift) ? builderInput.focusLift : "Gesamt",
    experienceLevel: PLAN_EXPERIENCE_OPTIONS.includes(builderInput.experienceLevel)
      ? builderInput.experienceLevel
      : mapProfileExperience(profile.experienceLevel),
  };
}

function parsePositiveInput(value) {
  const parsed = parseDecimalInput(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function resolveOneRepMaxes({ profile, manualOneRms = {}, useDemoValues = false }) {
  const profileOneRms = {
    squat: parsePositiveInput(profile?.lifts?.squat?.oneRepMax),
    bench: parsePositiveInput(profile?.lifts?.bench?.oneRepMax),
    deadlift: parsePositiveInput(profile?.lifts?.deadlift?.oneRepMax),
  };

  const manual = {
    squat: parsePositiveInput(manualOneRms.squat),
    bench: parsePositiveInput(manualOneRms.bench),
    deadlift: parsePositiveInput(manualOneRms.deadlift),
  };

  const oneRms = {
    squat: manual.squat ?? profileOneRms.squat,
    bench: manual.bench ?? profileOneRms.bench,
    deadlift: manual.deadlift ?? profileOneRms.deadlift,
  };

  const hasAnyOneRm = Object.values(oneRms).some(Boolean);
  const missingLifts = Object.entries(oneRms)
    .filter(([, value]) => !value)
    .map(([liftKey]) => liftKey);

  if (hasAnyOneRm && missingLifts.length > 0 && useDemoValues) {
    for (const liftKey of missingLifts) {
      oneRms[liftKey] = DEMO_ONE_RMS[liftKey];
    }
  }

  if (!hasAnyOneRm && useDemoValues) {
    return {
      oneRms: { ...DEMO_ONE_RMS },
      source: "demo",
      usedFallbacks: ["squat", "bench", "deadlift"],
    };
  }

  if (!Object.values(oneRms).every(Boolean)) {
    throw new Error(
      "Mindestens ein 1RM fehlt. Nutze Demo-Werte oder trage Squat, Bench und Deadlift manuell ein.",
    );
  }

  const usedFallbacks = Object.keys(oneRms).filter(
    (liftKey) => !profileOneRms[liftKey] && !manual[liftKey] && oneRms[liftKey],
  );

  const source = Object.values(manual).some(Boolean)
    ? "manual"
    : Object.values(profileOneRms).some(Boolean)
      ? "profile"
      : "demo";

  return { oneRms, source, usedFallbacks };
}

function getExperienceAdjustments(experienceLevel) {
  if (experienceLevel === "Anfaenger") {
    return { percentageShift: -0.03, rpeShift: -0.3, backoffShift: -0.02 };
  }

  if (experienceLevel === "Wettkaempfer") {
    return { percentageShift: 0.02, rpeShift: 0.25, backoffShift: 0.01 };
  }

  return { percentageShift: 0, rpeShift: 0, backoffShift: 0 };
}

function getWeekGoalTargets(goal, weekNumber, durationWeeks) {
  const progress = durationWeeks > 1 ? (weekNumber - 1) / (durationWeeks - 1) : 0;

  if (goal === "Wettkampfvorbereitung") {
    return {
      topSetReps: progress > 0.65 ? 1 : progress > 0.35 ? 2 : 3,
      topSetRpe: 8 + progress * 0.8,
      backoffSets: progress > 0.65 ? 2 : 3,
      backoffReps: progress > 0.65 ? 2 : 3,
      backoffReduction: 0.08,
      variationPercentage: 0.72 - progress * 0.05,
      variationRpe: 7.2,
      accessorySets: progress > 0.5 ? 2 : 3,
      rationale:
        "Wettkampfnahe Lifts und sinkende Wiederholungen steigern Spezifitaet, waehrend Volumen kontrolliert reduziert wird.",
    };
  }

  if (goal === "Muskelaufbau / Hypertrophie") {
    return {
      topSetReps: progress > 0.5 ? 6 : 7,
      topSetRpe: 7.2 + progress * 0.5,
      backoffSets: 4,
      backoffReps: progress > 0.5 ? 7 : 8,
      backoffReduction: 0.09,
      variationPercentage: 0.68 + progress * 0.04,
      variationRpe: 7,
      accessorySets: 4,
      rationale:
        "Mehr Gesamtvolumen und mittlere Intensitaeten setzen den Schwerpunkt auf Muskelaufbau und robuste Technik unter Ermuedung.",
    };
  }

  if (goal === "Technik verbessern") {
    return {
      topSetReps: 4,
      topSetRpe: 6.8 + progress * 0.4,
      backoffSets: 3,
      backoffReps: 5,
      backoffReduction: 0.1,
      variationPercentage: 0.64 + progress * 0.03,
      variationRpe: 6.8,
      accessorySets: 3,
      rationale:
        "Niedrigere RPE mit mehr Variantenarbeit priorisiert saubere Positionen und reproduzierbare Technik.",
    };
  }

  return {
    topSetReps: progress > 0.6 ? 3 : 4,
    topSetRpe: 7.8 + progress * 0.4,
    backoffSets: 3,
    backoffReps: progress > 0.6 ? 4 : 5,
    backoffReduction: 0.08,
    variationPercentage: 0.7 + progress * 0.04,
    variationRpe: 7.2,
    accessorySets: 3,
    rationale:
      "Top Sets bei moderater RPE plus Backoff-Volumen liefern progressive Kraftreize ohne unnoetige Ermuedung.",
  };
}

function getFocusAdjustment(focusLift, liftKey) {
  if (focusLift === "Gesamt") {
    return 0;
  }

  const normalizedFocus = focusLift.toLowerCase();
  return normalizedFocus === liftKey ? 0.02 : -0.01;
}

function formatKg(value) {
  return `${formatWeight(value)} kg`;
}

function createMainLiftEntries({
  liftKey,
  liftName,
  oneRm,
  goalTargets,
  experience,
  weekNumber,
  trainingDaysPerWeek,
}) {
  const topSetRpe = Number((goalTargets.topSetRpe + experience.rpeShift).toFixed(1));
  const topSetWeight = estimateWeightFromRpe(oneRm, goalTargets.topSetReps, topSetRpe);

  let backoffSets = goalTargets.backoffSets;

  if (trainingDaysPerWeek === 3) {
    backoffSets = Math.max(2, backoffSets - 1);
  }

  if (trainingDaysPerWeek === 5) {
    backoffSets += 1;
  }

  const backoffWeight = getBackoffWeight(
    topSetWeight,
    goalTargets.backoffReduction + experience.backoffShift,
  );

  const topNote =
    weekNumber === 1
      ? `Einstiegswoche: ${liftName} als Referenzsatz fuer den restlichen Block.`
      : `Progression in Woche ${weekNumber}: Last steigt kontrolliert bei gleicher Technik.`;

  return [
    {
      id: `${liftKey}-top`,
      name: `${liftName} Top Set`,
      sets: 1,
      reps: goalTargets.topSetReps,
      targetRpe: topSetRpe,
      estimatedWeight: topSetWeight,
      rationale: topNote,
    },
    {
      id: `${liftKey}-backoff`,
      name: `${liftName} Backoff Sets`,
      sets: backoffSets,
      reps: goalTargets.backoffReps,
      targetRpe: Number(Math.max(6.5, topSetRpe - 0.7).toFixed(1)),
      estimatedWeight: backoffWeight,
      rationale:
        "Backoff-Volumen konsolidiert das Top Set und haelt die Wiederholungsqualitaet bei submaximaler Last hoch.",
    },
  ];
}

function createVariationEntry({
  liftKey,
  name,
  oneRm,
  goalTargets,
  experience,
  focusLift,
  rationale,
}) {
  const percentage =
    goalTargets.variationPercentage + experience.percentageShift + getFocusAdjustment(focusLift, liftKey);

  const weight = calculateTrainingWeight(oneRm, Math.min(Math.max(percentage, 0.55), 0.88));

  return {
    id: `${liftKey}-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    sets: 3,
    reps: 6,
    targetRpe: Number((goalTargets.variationRpe + experience.rpeShift).toFixed(1)),
    estimatedWeight: weight,
    rationale,
  };
}

function createAccessoryEntry(name, sets, reps, rationale) {
  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    sets,
    reps,
    targetRpe: 7,
    estimatedWeight: null,
    rationale,
  };
}

function createWeekPlan({ settings, oneRms, weekNumber }) {
  const goalTargets = getWeekGoalTargets(settings.goal, weekNumber, settings.durationWeeks);
  const experience = getExperienceAdjustments(settings.experienceLevel);

  return DAY_TEMPLATES.map((dayTemplate) => {
    const dayExercises = [];

    if (dayTemplate.id === "day-4") {
      const squatVariation = createVariationEntry({
        liftKey: "squat",
        name: dayTemplate.variationName,
        oneRm: oneRms.squat,
        goalTargets,
        experience,
        focusLift: settings.focusLift,
        rationale: "Sekundaere Squat-Variante verbessert Positionierung und Kraft in Schwachstellen.",
      });

      const benchVariation = createVariationEntry({
        liftKey: "bench",
        name: dayTemplate.secondaryVariationName,
        oneRm: oneRms.bench,
        goalTargets,
        experience,
        focusLift: settings.focusLift,
        rationale: "Sekundaere Bench-Variation erhoeht Volumen ohne die Hauptbewegung zu ueberladen.",
      });

      dayExercises.push(
        squatVariation,
        benchVariation,
        createAccessoryEntry(
          dayTemplate.accessoryPrimary,
          goalTargets.accessorySets,
          10,
          "Row-Volumen stabilisiert den oberen Ruecken und verbessert die Wettkampfposition.",
        ),
        createAccessoryEntry(
          dayTemplate.accessorySecondary,
          2,
          12,
          "Optionales Zubehoer nur bei ausreichender Regeneration einplanen.",
        ),
      );
    } else {
      const mainLift = dayTemplate.mainLift;
      const liftName =
        mainLift === "squat"
          ? "Competition Squat"
          : mainLift === "bench"
            ? "Competition Bench"
            : "Competition Deadlift";

      dayExercises.push(
        ...createMainLiftEntries({
          liftKey: mainLift,
          liftName,
          oneRm: oneRms[mainLift],
          goalTargets,
          experience,
          weekNumber,
          trainingDaysPerWeek: settings.trainingDaysPerWeek,
        }),
      );

      dayExercises.push(
        createVariationEntry({
          liftKey: dayTemplate.variationLift,
          name: dayTemplate.variationName,
          oneRm: oneRms[dayTemplate.variationLift],
          goalTargets,
          experience,
          focusLift: settings.focusLift,
          rationale: "Variation verteilt den Stress und verbessert uebertragbare Teilbewegungen.",
        }),
        createAccessoryEntry(
          dayTemplate.accessoryPrimary,
          goalTargets.accessorySets,
          10,
          "Accessoire-Volumen stuetzt Muskelbalance und Belastungsvertraeglichkeit.",
        ),
        createAccessoryEntry(
          dayTemplate.accessorySecondary,
          3,
          12,
          "Ergaenzende Stabilitaetsarbeit fuer effiziente Kraftuebertragung.",
        ),
      );
    }

    return {
      id: dayTemplate.id,
      title: dayTemplate.title,
      focus: dayTemplate.mainLift,
      exercises: dayExercises,
      dayNote:
        settings.trainingDaysPerWeek === 3 && dayTemplate.id === "day-4"
          ? "Bei 3 Trainingstagen diesen Tag rotierend jede zweite Woche einbauen."
          : null,
    };
  });
}

function buildSystemNotes(settings, usedFallbacks) {
  const notes = [];

  notes.push(
    "Das System verbindet Strength Profil, Blockstruktur, Wochenplan und Tagesfeedback in einem Workflow.",
  );
  notes.push(
    "Top Sets und Backoff-Sets werden aus 1RM und Ziel-RPE abgeleitet, damit Lasten nachvollziehbar bleiben.",
  );

  if (settings.trainingDaysPerWeek === 3) {
    notes.push("Bei 3 Trainingstagen wird der Volume-Tag als rotierender Zusatztag geplant.");
  }

  if (settings.trainingDaysPerWeek === 5) {
    notes.push("Bei 5 Trainingstagen wird Zusatzvolumen ueber mehr Backoff-Sets verteilt.");
  }

  if (usedFallbacks.length > 0) {
    notes.push(
      `Fehlende 1RM-Werte wurden fuer ${usedFallbacks.join(", ")} mit Demo-Referenzen ersetzt. Profilwerte liefern praezisere Lasten.`,
    );
  }

  return notes;
}

export function createSmartStrengthBlock({
  builderInput,
  profile,
  manualOneRms,
  useDemoValues = false,
}) {
  const settings = resolveBuilderInput(builderInput, profile);
  const oneRmResolution = resolveOneRepMaxes({ profile, manualOneRms, useDemoValues });
  const { oneRms } = oneRmResolution;

  const weeks = Array.from({ length: settings.durationWeeks }, (_, index) => ({
    weekNumber: index + 1,
    days: createWeekPlan({ settings, oneRms, weekNumber: index + 1 }),
  }));

  const totalOneRm = oneRms.squat + oneRms.bench + oneRms.deadlift;

  return {
    id: `smart-plan-${Date.now()}`,
    name: "Smart Strength Plan",
    templateName: "4-Tage Powerlifting Strength Block",
    createdAt: new Date().toISOString(),
    currentWeek: 1,
    settings,
    profileSnapshot: {
      bodyweight: parsePositiveInput(profile?.bodyweight),
      oneRms,
      totalOneRm: roundToNearestIncrement(totalOneRm, 0.5),
      source: oneRmResolution.source,
    },
    weeks,
    whyThisPlan: [
      getWeekGoalTargets(settings.goal, 1, settings.durationWeeks).rationale,
      "Die Gewichte sind auf 2.5 kg gerundet, damit sie direkt im Gym nutzbar bleiben.",
      "Woechentliche Progression steuert Last und Volumen ohne abrupte Spruenge.",
    ],
    systemNotes: buildSystemNotes(settings, oneRmResolution.usedFallbacks),
  };
}

export function describeWeightReason(exercise) {
  if (!exercise?.estimatedWeight) {
    return "Last frei waehlen (RPE-zentriert)";
  }

  return `${formatKg(exercise.estimatedWeight)} basierend auf deinem 1RM und Ziel-RPE.`;
}

export function buildWorkoutRecommendation({
  plannedRpe,
  actualRpe,
  completedAllReps,
  techniqueStable,
}) {
  if (!techniqueStable) {
    return {
      tone: "hold",
      title: "Technik priorisieren",
      message: "Gewicht nicht erhoehen und die Technik zuerst stabilisieren.",
    };
  }

  const delta = actualRpe - plannedRpe;

  if (completedAllReps && delta <= -0.5) {
    return {
      tone: "up",
      title: "Naechste Woche leicht steigern",
      message: "Belastung war unter Ziel-RPE. Plane eine kleine Laststeigerung ein.",
    };
  }

  if (completedAllReps && Math.abs(delta) <= 0.5) {
    return {
      tone: "steady",
      title: "Plan normal fortsetzen",
      message: "RPE passt gut zum Plan. Behalte Last und Progression bei.",
    };
  }

  return {
    tone: "down",
    title: "Gewicht halten oder leicht reduzieren",
    message: "Belastung war zu hoch oder Reps wurden verfehlt. Last zunaechst stabilisieren.",
  };
}
