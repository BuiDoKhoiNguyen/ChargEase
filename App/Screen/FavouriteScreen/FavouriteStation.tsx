import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import chargingStations from "../../Utils/dummyData";
import { Ionicons } from "@expo/vector-icons";
import SearchList from "../HomeScreen/SearchList";

interface ChargingStation {
  distance: number;
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  isFavourite: boolean;
}

interface FavouriteStationProps {
  station: ChargingStation;
  onSelectStation: (station: ChargingStation) => void;
}

const FavouriteStation: React.FC<FavouriteStationProps> = ({
  station,
  onSelectStation,
}) => {
  return (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => onSelectStation(station)}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.stationTitle}>{station.title}</Text>
        <Text style={styles.stationDistance}>
          Distance: {station.distance} km
        </Text>
      </View>
      <Ionicons name="navigate" size={24} color="green" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  stationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  stationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stationDistance: {
    fontSize: 14,
    color: "#666",
  },
});

export default FavouriteStation;
