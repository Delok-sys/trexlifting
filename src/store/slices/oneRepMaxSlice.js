import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const LIFT_KEYS = ["squat", "bench", "deadlift"];

const createEmptyLiftState = () => ({
  weight: null,
  reps: null,
  rir: null,
  oneRepMax: null,
  updatedAt: null,
});

const initialState = {
  lifts: {
    squat: createEmptyLiftState(),
    bench: createEmptyLiftState(),
    deadlift: createEmptyLiftState(),
  },
  status: "idle",
  error: null,
};

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const roundToSingleDecimal = (value) => Math.round(value * 10) / 10;

const normalizeLiftInput = (liftName, liftInput) => {
  const rawWeight = liftInput.weight?.trim() ?? "";
  const rawReps = liftInput.reps?.trim() ?? "";
  const rawRir = liftInput.rir?.trim() ?? "";

  if (!rawWeight) {
    return null;
  }

  const weight = Number.parseFloat(rawWeight.replace(",", "."));
  const reps = rawReps ? Number.parseInt(rawReps, 10) : 1;
  const rir = rawRir ? Number.parseInt(rawRir, 10) : 0;

  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error(`${liftName} braucht ein gueltiges Gewicht groesser als 0.`);
  }

  if (!Number.isInteger(reps) || reps <= 0) {
    throw new Error(`${liftName} braucht eine gueltige Wiederholungszahl groesser als 0.`);
  }

  if (!Number.isInteger(rir) || rir < 0) {
    throw new Error(`${liftName} braucht einen gueltigen RIR ab 0.`);
  }

  const effectiveReps = reps + rir;
  const oneRepMax = roundToSingleDecimal(weight * (1 + (effectiveReps - 1) / 30));

  return {
    weight,
    reps,
    rir,
    oneRepMax,
    updatedAt: new Date().toISOString(),
  };
};

export const saveOneRepMaxes = createAsyncThunk(
  "oneRepMax/saveOneRepMaxes",
  async (liftInputs, { rejectWithValue }) => {
    try {
      const nextLifts = LIFT_KEYS.reduce((accumulator, liftKey) => {
        const normalizedLift = normalizeLiftInput(liftKey, liftInputs[liftKey] ?? {});

        if (normalizedLift) {
          accumulator[liftKey] = normalizedLift;
        }

        return accumulator;
      }, {});

      if (Object.keys(nextLifts).length === 0) {
        throw new Error("Trage mindestens fuer einen Lift ein Gewicht ein.");
      }

      await wait(350);

      return nextLifts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const oneRepMaxSlice = createSlice({
  name: "oneRepMax",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveOneRepMaxes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveOneRepMaxes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.lifts = {
          ...state.lifts,
          ...action.payload,
        };
      })
      .addCase(saveOneRepMaxes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Die 1RM-Werte konnten nicht gespeichert werden.";
      });
  },
});

export const selectOneRepMaxState = (state) => state.oneRepMax;
export const selectOneRepMaxLifts = (state) => state.oneRepMax.lifts;

export default oneRepMaxSlice.reducer;
