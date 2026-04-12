import liftsRaw from "../../../../lifts.txt?raw";
import rirRaw from "../../../../rir.txt?raw";

const BASE_LIFT_KEYS = ["squat", "bench", "deadlift"];

const BASE_LIFT_LABELS = {
  squat: "Kniebeuge",
  bench: "Bankdruecken",
  deadlift: "Kreuzheben",
};

const parseDecimal = (value) => Number.parseFloat(value.replace(",", "."));

const roundToSingleDecimal = (value) => Math.round(value * 10) / 10;

const roundToNearestTwoPointFive = (value) => Math.round(value / 2.5) * 2.5;

const formatWeight = (value) => {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
};

const buildLiftOptions = () => {
  const sections = liftsRaw
    .trim()
    .split(/\r?\n\r?\n+/)
    .map((section) =>
      section
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    );

  return sections.map((sectionLines, index) => ({
    baseLiftKey: BASE_LIFT_KEYS[index],
    baseLiftLabel: BASE_LIFT_LABELS[BASE_LIFT_KEYS[index]],
    options: sectionLines.map((line, optionIndex) => {
      const [label, rawFactor] = line.split("\t");

      return {
        id: `${BASE_LIFT_KEYS[index]}-${optionIndex}`,
        value: `${BASE_LIFT_KEYS[index]}:${optionIndex}`,
        label,
        baseLiftKey: BASE_LIFT_KEYS[index],
        factor: parseDecimal(rawFactor),
      };
    }),
  }));
};

const buildRirTable = () => {
  const [headerLine, ...rowLines] = rirRaw.trim().split(/\r?\n/);
  const [, ...repHeaders] = headerLine.split("\t");
  const reps = repHeaders.map((value) => Number.parseInt(value, 10));

  const rows = rowLines.map((line) => {
    const [rawRir, ...percentages] = line.split("\t");

    return {
      value: rawRir,
      percentageByRep: reps.reduce((accumulator, rep, index) => {
        accumulator[rep] = parseDecimal(percentages[index].replace("%", "")) / 100;
        return accumulator;
      }, {}),
    };
  });

  return {
    reps,
    rows,
  };
};

const liftOptionGroups = buildLiftOptions();
const rirTable = buildRirTable();

export const trainingWeightModuleConfig = {
  repOptions: rirTable.reps,
  rirOptions: rirTable.rows.map((row) => row.value),
  liftOptionGroups,
};

const findLiftOption = (selectedLift) =>
  liftOptionGroups.flatMap((group) => group.options).find((option) => option.value === selectedLift);

const findRirRow = (rirValue) => rirTable.rows.find((row) => row.value === rirValue);

export const calculateTrainingWeightRange = ({ selectedLift, reps, rir, storedLifts }) => {
  if (!selectedLift || !reps || !rir) {
    return null;
  }

  const selectedOption = findLiftOption(selectedLift);

  if (!selectedOption) {
    return {
      status: "invalid-selection",
      message: "Die ausgewaehlte Uebung konnte nicht gefunden werden.",
    };
  }

  const baseLift = storedLifts[selectedOption.baseLiftKey];
  const baseOneRepMax = baseLift?.oneRepMax;

  if (!baseOneRepMax) {
    return {
      status: "missing-1rm",
      message: `Speichere zuerst ein 1RM fuer ${BASE_LIFT_LABELS[selectedOption.baseLiftKey]}.`,
    };
  }

  const rirRow = findRirRow(rir);
  const repCount = Number.parseInt(reps, 10);
  const percentage = rirRow?.percentageByRep[repCount];

  if (!percentage) {
    return {
      status: "invalid-table-value",
      message: "Fuer diese Kombination aus Wiederholungen und RIR gibt es keinen Tabellenwert.",
    };
  }

  const variationOneRepMax = baseOneRepMax * selectedOption.factor;
  const exactWeight = variationOneRepMax * percentage;
  const roundedWeight = roundToNearestTwoPointFive(exactWeight);

  return {
    status: "ready",
    selectedLiftLabel: selectedOption.label,
    baseLiftLabel: BASE_LIFT_LABELS[selectedOption.baseLiftKey],
    variationOneRepMax: roundToSingleDecimal(variationOneRepMax),
    exactWeight: roundToSingleDecimal(exactWeight),
    roundedWeight,
    minWeight: Math.max(0, roundedWeight - 2.5),
    maxWeight: roundedWeight + 2.5,
    formattedExactWeight: formatWeight(roundToSingleDecimal(exactWeight)),
    formattedRoundedWeight: formatWeight(roundedWeight),
    formattedMinWeight: formatWeight(Math.max(0, roundedWeight - 2.5)),
    formattedMaxWeight: formatWeight(roundedWeight + 2.5),
  };
};
