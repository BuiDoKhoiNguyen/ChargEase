import { configureStore } from "@reduxjs/toolkit";
import ChargingStationReducer from "./Slices/ChargingStationSlice";
import FavouriteSlice from "./Slices/FavouriteSlice"

export const store = configureStore({
  reducer: {
    ChargingStations: ChargingStationReducer,
    FavouriteStations: FavouriteSlice,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
