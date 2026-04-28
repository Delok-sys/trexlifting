export const LIFT_KEYS = ["squat", "bench", "deadlift"];

export const LIFT_LABELS = {
  squat: "Kniebeuge",
  bench: "Bankdruecken",
  deadlift: "Kreuzheben",
};

export const STRENGTH_PROFILE_STORAGE_KEY = "trexlifting.strength-profile.v1";

export function roundToSingleDecimal(value) {
  return Math.round(value * 10) / 10;
}

export function roundToNearestIncrement(value, increment = 2.5) {
  if (!Number.isFinite(value) || increment <= 0) {
    return 0;
  }

  return Math.round(value / increment) * increment;
}

export function formatWeight(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function parseDecimalInput(value) {
  const normalized = `${value ?? ""}`.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function parseIntegerInput(value) {
  const normalized = `${value ?? ""}`.trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);

  return Number.isInteger(parsed) ? parsed : null;
}

export function calculateEstimatedOneRepMax({ weight, reps = 1, rir = 0 }) {
  const effectiveReps = reps + rir;
  return roundToSingleDecimal(weight * (1 + (effectiveReps - 1) / 30));
}

export function calculatePercentBasedWeight(oneRepMax, percentage, increment = 2.5) {
  const exactWeight = oneRepMax * percentage;
  const roundedWeight = roundToNearestIncrement(exactWeight, increment);

  return {
    exactWeight: roundToSingleDecimal(exactWeight),
    roundedWeight,
  };
}

export function calculateTrainingWeight(oneRepMax, percentage, increment = 2.5) {
  if (!Number.isFinite(oneRepMax) || oneRepMax <= 0) {
    return 0;
  }

  return roundToNearestIncrement(oneRepMax * percentage, increment);
}

export function estimateWeightFromRpe(oneRepMax, reps, targetRpe, increment = 2.5) {
  if (!Number.isFinite(oneRepMax) || oneRepMax <= 0) {
    return 0;
  }

  const safeReps = Number.isFinite(reps) && reps > 0 ? reps : 1;
  const safeRpe = Number.isFinite(targetRpe) ? Math.min(Math.max(targetRpe, 6), 10) : 8;
  const estimatedRir = Math.max(0, 10 - safeRpe);
  const effectiveReps = safeReps + estimatedRir;
  const estimatedPercentage = 1 / (1 + (effectiveReps - 1) / 30);

  return calculateTrainingWeight(oneRepMax, estimatedPercentage, increment);
}

export function getBackoffWeight(topSetWeight, reductionPercent, increment = 2.5) {
  if (!Number.isFinite(topSetWeight) || topSetWeight <= 0) {
    return 0;
  }

  const safeReduction = Number.isFinite(reductionPercent)
    ? Math.min(Math.max(reductionPercent, 0), 0.3)
    : 0.08;

  return roundToNearestIncrement(topSetWeight * (1 - safeReduction), increment);
}

export function calculateVariationWeight({
  baseOneRepMax,
  variationFactor,
  percentage,
  increment = 2.5,
}) {
  const variationOneRepMax = baseOneRepMax * variationFactor;
  const load = calculatePercentBasedWeight(variationOneRepMax, percentage, increment);

  return {
    variationOneRepMax: roundToSingleDecimal(variationOneRepMax),
    ...load,
  };
}

function buildRange(oneRepMax, minPercentage, maxPercentage) {
  const minWeight = calculatePercentBasedWeight(oneRepMax, minPercentage).roundedWeight;
  const maxWeight = calculatePercentBasedWeight(oneRepMax, maxPercentage).roundedWeight;

  return {
    minWeight,
    maxWeight,
    formatted: `${formatWeight(minWeight)} - ${formatWeight(maxWeight)} kg`,
  };
}

function buildTarget(oneRepMax, percentage) {
  const { roundedWeight } = calculatePercentBasedWeight(oneRepMax, percentage);

  return {
    weight: roundedWeight,
    formatted: `${formatWeight(roundedWeight)} kg`,
  };
}

export function calculateAttemptRecommendations(storedLifts) {
  const lifts = LIFT_KEYS.map((liftKey) => {
    const oneRepMax = storedLifts?.[liftKey]?.oneRepMax;

    if (!oneRepMax) {
      return {
        key: liftKey,
        label: LIFT_LABELS[liftKey],
        status: "missing-1rm",
        message: `Speichere zuerst ein 1RM fuer ${LIFT_LABELS[liftKey]}.`,
      };
    }

    return {
      key: liftKey,
      label: LIFT_LABELS[liftKey],
      status: "ready",
      oneRepMax,
      openerRange: buildRange(oneRepMax, 0.89, 0.92),
      secondAttemptRecommendations: [
        {
          id: "normal",
          label: "normal",
          range: buildRange(oneRepMax, 0.96, 0.97),
        },
        {
          id: "harder-than-expected",
          label: "schwerer als erwartet",
          range: buildRange(oneRepMax, 0.95, 0.96),
        },
      ],
      thirdAttemptRecommendations: [
        {
          id: "second-normal",
          label: "normal",
          target: buildTarget(oneRepMax, 0.995),
        },
        {
          id: "second-harder-than-expected",
          label: "schwerer als erwartet",
          target: buildTarget(oneRepMax, 0.985),
        },
        {
          id: "second-lighter-than-expected",
          label: "leichter als erwartet",
          target: buildTarget(oneRepMax, 1.02),
        },
      ],
    };
  });

  return {
    status: lifts.every((lift) => lift.status === "ready") ? "ready" : "partial",
    lifts,
  };
}

export function createEmptyLiftState() {
  return {
    weight: null,
    reps: null,
    rir: null,
    oneRepMax: null,
    updatedAt: null,
  };
}

export function createEmptyLiftMap() {
  return {
    squat: createEmptyLiftState(),
    bench: createEmptyLiftState(),
    deadlift: createEmptyLiftState(),
  };
}

export function normalizeLiftInput(liftKey, liftInput) {
  const weight = parseDecimalInput(liftInput.weight);
  const reps = parseIntegerInput(liftInput.reps) ?? 1;
  const rir = parseIntegerInput(liftInput.rir) ?? 0;

  if (!weight) {
    return null;
  }

  if (weight <= 0) {
    throw new Error(`${LIFT_LABELS[liftKey]} braucht ein gueltiges Gewicht groesser als 0.`);
  }

  if (reps <= 0) {
    throw new Error(`${LIFT_LABELS[liftKey]} braucht eine gueltige Wiederholungszahl groesser als 0.`);
  }

  if (rir < 0) {
    throw new Error(`${LIFT_LABELS[liftKey]} braucht einen gueltigen RIR ab 0.`);
  }

  return {
    weight,
    reps,
    rir,
    oneRepMax: calculateEstimatedOneRepMax({ weight, reps, rir }),
    updatedAt: new Date().toISOString(),
  };
}
