import { calculateTrainingWeight, formatWeight, parseDecimalInput } from "./strengthCalculations";

export const PLAN_CHECK_STORAGE_KEY = "trexlifting.plan-check-input.v1";

export const PLAN_CHECK_GOAL_OPTIONS = [
  "Kraftaufbau",
  "Muskelaufbau / Hypertrophie",
  "Technik verbessern",
  "Wettkampfvorbereitung",
];

export const PLAN_CHECK_DURATION_OPTIONS = [4, 6, 8];
export const PLAN_CHECK_TRAINING_DAY_OPTIONS = [3, 4, 5];
export const PLAN_CHECK_FOCUS_OPTIONS = ["Squat", "Bench", "Deadlift", "Gesamt"];
export const PLAN_CHECK_EXPERIENCE_OPTIONS = ["Anfaenger", "Fortgeschritten", "Wettkaempfer"];

const LIFT_ORDER = ["squat", "bench", "deadlift"];

const LIFT_LABELS = {
  squat: "Squat",
  bench: "Bench",
  deadlift: "Deadlift",
};

const GOAL_MODELS = {
  Kraftaufbau: {
    blockGoal: "Leistungsfaehigkeit in den Competition Lifts steigern",
    minPercent: 0.75,
    maxPercent: 0.88,
    rpeRange: [7, 9],
    reps: "3-6 Wdh",
    defaultDuration: 6,
    defaultTrainingDays: 4,
    explanation:
      "Moderate bis hohe Intensitaet mit kontrolliertem Volumen passt fuer solide Kraftprogression ohne unnoetige Erschoepfung.",
    sampleTemplate: {
      mainSetsReps: "4-5 Saetze x 3-5 Wdh",
      volumeSetsReps: "3-4 Saetze x 5-7 Wdh",
      techSetsReps: "3-4 Saetze x 3-4 Wdh",
    },
  },
  "Muskelaufbau / Hypertrophie": {
    blockGoal: "Muskelmasse und Belastungsvertraeglichkeit ausbauen",
    minPercent: 0.6,
    maxPercent: 0.78,
    rpeRange: [6, 8],
    reps: "6-12 Wdh",
    defaultDuration: 6,
    defaultTrainingDays: 4,
    explanation:
      "Mehr Volumen in mittleren Lastbereichen liefert den besten Mix aus Hypertrophiereiz und Technikstabilitaet.",
    sampleTemplate: {
      mainSetsReps: "4-5 Saetze x 6-8 Wdh",
      volumeSetsReps: "3-5 Saetze x 8-12 Wdh",
      techSetsReps: "3-4 Saetze x 5-6 Wdh",
    },
  },
  "Technik verbessern": {
    blockGoal: "Bewegungsqualitaet, Positionierung und Wiederholbarkeit verbessern",
    minPercent: 0.55,
    maxPercent: 0.75,
    rpeRange: [5, 7],
    reps: "3-6 Wdh",
    defaultDuration: 4,
    defaultTrainingDays: 3,
    explanation:
      "Niedrigere Intensitaeten und sauber ausgefuehrte Wiederholungen ermoeglichen stabile Technikarbeit.",
    sampleTemplate: {
      mainSetsReps: "4-6 Saetze x 3-4 Wdh",
      volumeSetsReps: "3-4 Saetze x 4-6 Wdh",
      techSetsReps: "4-5 Saetze x 2-4 Wdh (Pause/Tempo)",
    },
  },
  Wettkampfvorbereitung: {
    blockGoal: "Wettkampfspezifische Leistung und Versuchssicherheit aufbauen",
    minPercent: 0.8,
    maxPercent: 0.92,
    rpeRange: [7, 9],
    reps: "1-4 Wdh",
    defaultDuration: 8,
    defaultTrainingDays: 4,
    explanation:
      "Hohe Spezifitaet und intensitaetsnahe Arbeit bereiten auf Wettkampfanforderungen vor, bei reduzierter Variationsbreite.",
    sampleTemplate: {
      mainSetsReps: "3-5 Saetze x 1-3 Wdh",
      volumeSetsReps: "3-4 Saetze x 3-5 Wdh",
      techSetsReps: "3-4 Saetze x 2-3 Wdh",
    },
  },
};

const EXPERIENCE_ADJUSTMENTS = {
  Anfaenger: { percentShift: -0.02, rpeShift: -0.4, durationShift: 0, trainingDayShift: -1 },
  Fortgeschritten: { percentShift: 0, rpeShift: 0, durationShift: 0, trainingDayShift: 0 },
  Wettkaempfer: { percentShift: 0.02, rpeShift: 0.3, durationShift: 0, trainingDayShift: 0 },
};

function mapProfileGoal(goal) {
  if (goal === "Muskelaufbau") {
    return "Muskelaufbau / Hypertrophie";
  }

  return PLAN_CHECK_GOAL_OPTIONS.includes(goal) ? goal : "Kraftaufbau";
}

function mapProfileExperience(level) {
  if (level === "Einsteiger") {
    return "Anfaenger";
  }

  if (level === "Wettkampfathlet") {
    return "Wettkaempfer";
  }

  return PLAN_CHECK_EXPERIENCE_OPTIONS.includes(level) ? level : "Fortgeschritten";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatRange(min, max) {
  return `${Math.round(min * 100)}-${Math.round(max * 100)}%`;
}

function formatRpeRange(minRpe, maxRpe) {
  return `${minRpe.toFixed(1)}-${maxRpe.toFixed(1)}`;
}

function getNearestOption(options, value) {
  return options.reduce((best, current) =>
    Math.abs(current - value) < Math.abs(best - value) ? current : best,
  );
}

function parsePositiveValue(value) {
  const parsed = parseDecimalInput(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function getFocusPercentShift(focusLift, liftKey) {
  if (focusLift === "Gesamt") {
    return 0;
  }

  return focusLift.toLowerCase() === liftKey ? 0.02 : -0.01;
}

function buildWeightRange(oneRm, minPercent, maxPercent) {
  if (!Number.isFinite(oneRm) || oneRm <= 0) {
    return "-";
  }

  const minWeight = calculateTrainingWeight(oneRm, minPercent);
  const maxWeight = calculateTrainingWeight(oneRm, maxPercent);

  return `${formatWeight(minWeight)}-${formatWeight(maxWeight)} kg`;
}

function normalizeBuilderInput(builderInput = {}, profile = {}) {
  return {
    goal: PLAN_CHECK_GOAL_OPTIONS.includes(builderInput.goal)
      ? builderInput.goal
      : mapProfileGoal(profile.goal),
    durationWeeks: PLAN_CHECK_DURATION_OPTIONS.includes(Number(builderInput.durationWeeks))
      ? Number(builderInput.durationWeeks)
      : 6,
    trainingDaysPerWeek: PLAN_CHECK_TRAINING_DAY_OPTIONS.includes(Number(builderInput.trainingDaysPerWeek))
      ? Number(builderInput.trainingDaysPerWeek)
      : 4,
    focusLift: PLAN_CHECK_FOCUS_OPTIONS.includes(builderInput.focusLift) ? builderInput.focusLift : "Gesamt",
    experienceLevel: PLAN_CHECK_EXPERIENCE_OPTIONS.includes(builderInput.experienceLevel)
      ? builderInput.experienceLevel
      : mapProfileExperience(profile.experienceLevel),
  };
}

function resolveOneRms({ profile, manualOneRms = {} }) {
  const profileValues = {
    squat: parsePositiveValue(profile?.lifts?.squat?.oneRepMax),
    bench: parsePositiveValue(profile?.lifts?.bench?.oneRepMax),
    deadlift: parsePositiveValue(profile?.lifts?.deadlift?.oneRepMax),
  };

  const manualValues = {
    squat: parsePositiveValue(manualOneRms.squat),
    bench: parsePositiveValue(manualOneRms.bench),
    deadlift: parsePositiveValue(manualOneRms.deadlift),
  };

  const oneRms = {
    squat: manualValues.squat ?? profileValues.squat,
    bench: manualValues.bench ?? profileValues.bench,
    deadlift: manualValues.deadlift ?? profileValues.deadlift,
  };

  const missing = LIFT_ORDER.filter((liftKey) => !oneRms[liftKey]);

  if (missing.length > 0) {
    throw new Error("Bitte gib gueltige 1RM-Werte fuer Squat, Bench und Deadlift ein.");
  }

  const source = Object.values(manualValues).some(Boolean) ? "manual" : "profile";

  return { oneRms, source };
}

function getIntensityModel({ goal, experienceLevel, focusLift }) {
  const goalModel = GOAL_MODELS[goal];
  const adjustment = EXPERIENCE_ADJUSTMENTS[experienceLevel];

  return LIFT_ORDER.map((liftKey) => {
    const minPercent = clamp(
      goalModel.minPercent + adjustment.percentShift + getFocusPercentShift(focusLift, liftKey),
      0.5,
      0.95,
    );
    const maxPercent = clamp(
      goalModel.maxPercent + adjustment.percentShift + getFocusPercentShift(focusLift, liftKey),
      0.58,
      0.97,
    );

    const rpeMin = clamp(goalModel.rpeRange[0] + adjustment.rpeShift, 5, 9.5);
    const rpeMax = clamp(goalModel.rpeRange[1] + adjustment.rpeShift, 6, 9.5);

    return {
      liftKey,
      liftLabel: LIFT_LABELS[liftKey],
      minPercent,
      maxPercent,
      percentRange: formatRange(minPercent, maxPercent),
      rpeRange: formatRpeRange(rpeMin, rpeMax),
      reps: goalModel.reps,
    };
  });
}

function prioritizeLifts(focusLift) {
  if (focusLift === "Gesamt") {
    return [...LIFT_ORDER];
  }

  const normalizedFocus = focusLift.toLowerCase();
  return [normalizedFocus, ...LIFT_ORDER.filter((lift) => lift !== normalizedFocus)];
}

function getExerciseName(liftKey) {
  if (liftKey === "squat") {
    return "Competition Squat";
  }

  if (liftKey === "bench") {
    return "Competition Bench";
  }

  return "Competition Deadlift";
}

function buildLoadLabel(oneRm, minPercent, maxPercent) {
  const safeMin = clamp(minPercent, 0.45, 0.95);
  const safeMax = clamp(Math.max(maxPercent, safeMin + 0.02), 0.47, 0.97);

  return `${formatRange(safeMin, safeMax)} (${buildWeightRange(oneRm, safeMin, safeMax)})`;
}

function getIntensityByLift(intensityRanges) {
  return intensityRanges.reduce((accumulator, item) => {
    accumulator[item.liftKey] = item;
    return accumulator;
  }, {});
}

function createSampleWeek({ settings, oneRms, intensityByLift }) {
  const goalModel = GOAL_MODELS[settings.goal];
  const orderedLifts = prioritizeLifts(settings.focusLift);
  const days = [];

  const createMainDay = (dayNumber, liftKey) => {
    const intensity = intensityByLift[liftKey];

    return {
      id: `day-${dayNumber}`,
      title: `Tag ${dayNumber}: ${LIFT_LABELS[liftKey]} Fokus`,
      mainFocus: `${LIFT_LABELS[liftKey]} priorisieren`,
      exerciseExample: getExerciseName(liftKey),
      setRepRange: goalModel.sampleTemplate.mainSetsReps,
      rpeTarget: intensity.rpeRange,
      loadTarget: buildLoadLabel(oneRms[liftKey], intensity.minPercent, intensity.maxPercent),
      rationale: `Hauptlift wird in deinem Zielkorridor trainiert, um ${settings.goal.toLowerCase()} konsistent zu unterstuetzen.`,
    };
  };

  days.push(createMainDay(1, orderedLifts[0]));
  days.push(createMainDay(2, orderedLifts[1]));
  days.push(createMainDay(3, orderedLifts[2]));

  if (settings.trainingDaysPerWeek >= 4) {
    const primaryLift = orderedLifts[0];
    const volumeIntensity = intensityByLift[primaryLift];

    days.push({
      id: "day-4",
      title: "Tag 4: Volume / Secondary",
      mainFocus: `${LIFT_LABELS[primaryLift]} Volumen + Assistenzarbeit`,
      exerciseExample: `${getExerciseName(primaryLift)} Variation (Pause/Tempo)`,
      setRepRange: goalModel.sampleTemplate.volumeSetsReps,
      rpeTarget: `${Math.max(5, Number.parseFloat(volumeIntensity.rpeRange.split("-")[0]) - 0.5).toFixed(1)}-${Math.max(6, Number.parseFloat(volumeIntensity.rpeRange.split("-")[1]) - 0.4).toFixed(1)}`,
      loadTarget: buildLoadLabel(oneRms[primaryLift], volumeIntensity.minPercent - 0.05, volumeIntensity.maxPercent - 0.07),
      rationale: "Zusatzvolumen baut Work Capacity auf und festigt technische Muster ohne maximalen Stress.",
    });
  }

  if (settings.trainingDaysPerWeek === 5) {
    const focusLift = orderedLifts[0];
    const focusIntensity = intensityByLift[focusLift];

    days.push({
      id: "day-5",
      title: "Tag 5: Technik / Speed",
      mainFocus: `${LIFT_LABELS[focusLift]} Technikqualitaet`,
      exerciseExample: `${getExerciseName(focusLift)} mit Pause oder Tempo`,
      setRepRange: goalModel.sampleTemplate.techSetsReps,
      rpeTarget: `${Math.max(5, Number.parseFloat(focusIntensity.rpeRange.split("-")[0]) - 1).toFixed(1)}-${Math.max(6, Number.parseFloat(focusIntensity.rpeRange.split("-")[1]) - 0.8).toFixed(1)}`,
      loadTarget: buildLoadLabel(oneRms[focusLift], focusIntensity.minPercent - 0.09, focusIntensity.maxPercent - 0.12),
      rationale: "Leichtere, technisch praezise Arbeit verbessert Timing, Position und Wiederholbarkeit fuer schwere Einheiten.",
    });
  }

  return days;
}

function buildBlockRecommendation(settings) {
  const goalModel = GOAL_MODELS[settings.goal];
  const adjustment = EXPERIENCE_ADJUSTMENTS[settings.experienceLevel];

  const suggestedDuration = getNearestOption(
    PLAN_CHECK_DURATION_OPTIONS,
    goalModel.defaultDuration + adjustment.durationShift,
  );
  const suggestedTrainingDays = getNearestOption(
    PLAN_CHECK_TRAINING_DAY_OPTIONS,
    goalModel.defaultTrainingDays + adjustment.trainingDayShift,
  );

  const focusText =
    settings.focusLift === "Gesamt"
      ? "Balanced Fokus auf Squat, Bench und Deadlift"
      : `${settings.focusLift} als Schwerpunkt mit erhaltender Arbeit fuer die anderen Lifts`;

  return {
    blockGoal: goalModel.blockGoal,
    recommendedDurationWeeks: suggestedDuration,
    recommendedTrainingDays: suggestedTrainingDays,
    focus: focusText,
    explanation: goalModel.explanation,
    selectedDurationWeeks: settings.durationWeeks,
    selectedTrainingDays: settings.trainingDaysPerWeek,
  };
}

function buildHints(settings) {
  return [
    "Diese Empfehlung ist eine datenbasierte Orientierung und ersetzt keine individuelle Betreuung.",
    "Passe Lasten sofort an, wenn Technik einbricht, Erholung sinkt oder Schmerzen auftreten.",
    "Bei Wettkampfvorbereitung, Plateaus oder Beschwerden ist ein individueller Coaching-Plan sinnvoll.",
    `Dein Ziel \"${settings.goal}\" profitiert am meisten von konsequenter Umsetzung ueber den gesamten ${settings.durationWeeks}-Wochen-Block.`,
  ];
}

export function getPlanCheckInitialInput(profile = {}, savedInput = null) {
  const profileOneRms = {
    squat: `${profile?.lifts?.squat?.oneRepMax ?? ""}`,
    bench: `${profile?.lifts?.bench?.oneRepMax ?? ""}`,
    deadlift: `${profile?.lifts?.deadlift?.oneRepMax ?? ""}`,
  };

  const fromStorage = savedInput ?? {};

  return {
    goal: PLAN_CHECK_GOAL_OPTIONS.includes(fromStorage.goal)
      ? fromStorage.goal
      : mapProfileGoal(profile.goal),
    durationWeeks: PLAN_CHECK_DURATION_OPTIONS.includes(Number(fromStorage.durationWeeks))
      ? Number(fromStorage.durationWeeks)
      : 6,
    trainingDaysPerWeek: PLAN_CHECK_TRAINING_DAY_OPTIONS.includes(Number(fromStorage.trainingDaysPerWeek))
      ? Number(fromStorage.trainingDaysPerWeek)
      : 4,
    focusLift: PLAN_CHECK_FOCUS_OPTIONS.includes(fromStorage.focusLift) ? fromStorage.focusLift : "Gesamt",
    experienceLevel: PLAN_CHECK_EXPERIENCE_OPTIONS.includes(fromStorage.experienceLevel)
      ? fromStorage.experienceLevel
      : mapProfileExperience(profile.experienceLevel),
    oneRms: {
      squat: `${fromStorage?.oneRms?.squat ?? profileOneRms.squat ?? ""}`,
      bench: `${fromStorage?.oneRms?.bench ?? profileOneRms.bench ?? ""}`,
      deadlift: `${fromStorage?.oneRms?.deadlift ?? profileOneRms.deadlift ?? ""}`,
    },
  };
}

export function createTrainingPlanCheck({ builderInput, profile, manualOneRms }) {
  const settings = normalizeBuilderInput(builderInput, profile);
  const oneRmResolution = resolveOneRms({ profile, manualOneRms });
  const intensityRanges = getIntensityModel({
    goal: settings.goal,
    experienceLevel: settings.experienceLevel,
    focusLift: settings.focusLift,
  }).map((range) => ({
    ...range,
    weightRange: buildWeightRange(oneRmResolution.oneRms[range.liftKey], range.minPercent, range.maxPercent),
  }));

  const intensityByLift = getIntensityByLift(intensityRanges);

  return {
    id: `plan-check-${Date.now()}`,
    name: "Smart Strength Plan Check",
    createdAt: new Date().toISOString(),
    settings,
    oneRms: oneRmResolution.oneRms,
    oneRmSource: oneRmResolution.source,
    recommendation: buildBlockRecommendation(settings),
    intensityRanges,
    sampleWeek: createSampleWeek({
      settings,
      oneRms: oneRmResolution.oneRms,
      intensityByLift,
    }),
    hints: buildHints(settings),
  };
}
