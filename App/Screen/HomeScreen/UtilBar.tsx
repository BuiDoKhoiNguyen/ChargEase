import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchList from "./SearchList";
import Colors from "../../Utils/Colors";

interface ChargingStation {
  distance: number;
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  isFavourite: boolean;
}

interface UtilBarProps {
  focusOnUserLocation: () => void;
  onSelectStation: (station: ChargingStation) => void;
}

const UtilBar: React.FC<UtilBarProps> = ({
  focusOnUserLocation,
  onSelectStation,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* Search Component */}
        <View style={styles.searchBarWrapper}>
          <SearchList
            onSelectStation={onSelectStation}
            setIsSearching={setIsSearching}
            isSearching={isSearching}
          />
        </View>

        {/* Focus Button (Hidden when searching) */}
        {!isSearching && (
          <TouchableOpacity
            style={styles.focusButton}
            onPress={focusOnUserLocation}
          >
            <Ionicons
              name="locate-sharp"
              size={27}
              color={Colors.PRIMARY}
            ></Ionicons>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 71,
    left: 10,
    right: 10,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBarWrapper: {
    flex: 1,
  },
  focusButton: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginLeft: 10,
  },
});

export default UtilBar;
