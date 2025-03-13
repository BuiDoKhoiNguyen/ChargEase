import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface ChargingStation {
  distance: number;
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  isFavourite: boolean;
}

export type BottomTabParamList = {
  home: { selectedStation?: ChargingStation | null };
  favourite: undefined;
  profile: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  BottomTabParamList,
  "home"
>;
