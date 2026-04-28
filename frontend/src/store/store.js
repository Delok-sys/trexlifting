import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import oneRepMaxReducer from "./slices/oneRepMaxSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    oneRepMax: oneRepMaxReducer,
  },
});
