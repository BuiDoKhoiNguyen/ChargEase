import { configureStore } from "@reduxjs/toolkit";
import ChargingStationReducer from "./Slices/ChargingStationSlice";

export const store = configureStore({
  reducer: {
    ChargingStations: ChargingStationReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
