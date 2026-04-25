import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LIFT_KEYS, createEmptyLiftMap, normalizeLiftInput } from "../../lib/strengthCalculations";

const initialState = {
  lifts: createEmptyLiftMap(),
  status: "idle",
  error: null,
};

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

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
