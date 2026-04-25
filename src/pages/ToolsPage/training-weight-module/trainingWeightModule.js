import liftsRaw from "../../../../lifts.txt?raw";
import rirRaw from "../../../../rir.txt?raw";
import {
  calculateVariationWeight,
  formatWeight,
  LIFT_LABELS,
  LIFT_KEYS,
} from "../../../lib/strengthCalculations";

const BASE_LIFT_LABELS = {
  squat: LIFT_LABELS.squat,
  bench: LIFT_LABELS.bench,
  deadlift: LIFT_LABELS.deadlift,
};

const parseDecimal = (value) => Number.parseFloat(value.replace(",", "."));

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
    baseLiftKey: LIFT_KEYS[index],
    baseLiftLabel: BASE_LIFT_LABELS[LIFT_KEYS[index]],
    options: sectionLines.map((line, optionIndex) => {
      const [label, rawFactor] = line.split("\t");

      return {
        id: `${LIFT_KEYS[index]}-${optionIndex}`,
        value: `${LIFT_KEYS[index]}:${optionIndex}`,
        label,
        baseLiftKey: LIFT_KEYS[index],
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

  const calculation = calculateVariationWeight({
    baseOneRepMax,
    variationFactor: selectedOption.factor,
    percentage,
  });

  return {
    status: "ready",
    selectedLiftLabel: selectedOption.label,
    baseLiftLabel: BASE_LIFT_LABELS[selectedOption.baseLiftKey],
    variationOneRepMax: calculation.variationOneRepMax,
    exactWeight: calculation.exactWeight,
    roundedWeight: calculation.roundedWeight,
    minWeight: Math.max(0, calculation.roundedWeight - 2.5),
    maxWeight: calculation.roundedWeight + 2.5,
    formattedExactWeight: formatWeight(calculation.exactWeight),
    formattedRoundedWeight: formatWeight(calculation.roundedWeight),
    formattedMinWeight: formatWeight(Math.max(0, calculation.roundedWeight - 2.5)),
    formattedMaxWeight: formatWeight(calculation.roundedWeight + 2.5),
  };
};
