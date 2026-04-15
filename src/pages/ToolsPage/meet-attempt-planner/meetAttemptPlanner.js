const LIFT_SEQUENCE = [
  { key: "squat", label: "Kniebeuge" },
  { key: "bench", label: "Bankdruecken" },
  { key: "deadlift", label: "Kreuzheben" },
];

const roundToNearestTwoPointFive = (value) => Math.round(value / 2.5) * 2.5;

const formatWeight = (value) => {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
};

const buildRoundedRange = (oneRepMax, minPercentage, maxPercentage) => {
  const minWeight = roundToNearestTwoPointFive(oneRepMax * minPercentage);
  const maxWeight = roundToNearestTwoPointFive(oneRepMax * maxPercentage);

  return {
    minWeight,
    maxWeight,
    formatted: `${formatWeight(minWeight)} - ${formatWeight(maxWeight)} kg`,
  };
};

const buildRoundedWeight = (oneRepMax, percentage) => {
  const weight = roundToNearestTwoPointFive(oneRepMax * percentage);

  return {
    weight,
    formatted: `${formatWeight(weight)} kg`,
  };
};

export const calculateMeetAttemptPlan = (storedLifts) => {
  const lifts = LIFT_SEQUENCE.map((lift) => {
    const oneRepMax = storedLifts?.[lift.key]?.oneRepMax;

    if (!oneRepMax) {
      return {
        ...lift,
        status: "missing-1rm",
        message: `Speichere zuerst ein 1RM fuer ${lift.label}.`,
      };
    }

    return {
      ...lift,
      status: "ready",
      oneRepMax,
      openerRange: buildRoundedRange(oneRepMax, 0.89, 0.92),
      secondAttemptRange: buildRoundedRange(oneRepMax, 0.95, 0.97),
      secondAttemptRecommendations: [
        {
          id: "normal",
          label: "normal",
          percentageLabel: "96 - 97%",
          range: buildRoundedRange(oneRepMax, 0.96, 0.97),
        },
        {
          id: "harder-than-expected",
          label: "schwerer als erwartet",
          percentageLabel: "95 - 96%",
          range: buildRoundedRange(oneRepMax, 0.95, 0.96),
        },
      ],
      thirdAttemptRange: buildRoundedRange(oneRepMax, 0.98, 1.02),
      thirdAttemptRecommendations: [
        {
          id: "second-normal",
          label: "normal",
          percentageLabel: "ca. 99,5%",
          target: buildRoundedWeight(oneRepMax, 0.995),
        },
        {
          id: "second-harder-than-expected",
          label: "schwerer als erwartet",
          percentageLabel: "ca. 98,5%",
          target: buildRoundedWeight(oneRepMax, 0.985),
        },
        {
          id: "second-lighter-than-expected",
          label: "leichter als erwartet",
          percentageLabel: "ca. 102%",
          target: buildRoundedWeight(oneRepMax, 1.02),
        },
      ],
    };
  });

  const missingLiftCount = lifts.filter((lift) => lift.status !== "ready").length;

  return {
    status: missingLiftCount === 0 ? "ready" : "partial",
    lifts,
  };
};
