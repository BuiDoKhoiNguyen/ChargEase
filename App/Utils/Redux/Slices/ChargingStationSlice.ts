import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import chargingStations from "../../dummyData";

interface ChargingStation {
    distance: number;
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    isFavourite: boolean;
  }  

const initialState: ChargingStation[] = chargingStations;

const ChargingStationSlice = createSlice({
  name: "ChargingStations",
  initialState,
  reducers: {
    addStation: (state, action: PayloadAction<ChargingStation>) => {
      state.push(action.payload);
    },
    removeStation: (state, action: PayloadAction<string>) => {
      return state.filter(station => station.id.toString() !== action.payload);
    },
  },
});

export const { addStation, removeStation } = ChargingStationSlice.actions;
export default ChargingStationSlice.reducer;
