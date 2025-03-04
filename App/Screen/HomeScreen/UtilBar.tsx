import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchList from "./SearchList";

interface ChargingStation {
  distance: number;
  id: number;
  title: string;
  latitude: number;
  longitude: number;
}

interface UtilBarProps {
  focusOnUserLocation: () => void;
  onSearch: (query: string) => void;
  filteredStations: ChargingStation[];
  onSelectStation: (station: ChargingStation) => void;
}

const UtilBar: React.FC<UtilBarProps> = ({
  focusOnUserLocation,
  onSearch,
  filteredStations,
  onSelectStation,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleFocus = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* Search Component */}
        <View style={styles.searchBarWrapper}>
          <SearchList
            onSearch={onSearch}
            filteredStations={filteredStations}
            onSelectStation={onSelectStation}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isSearching={isSearching}
          />
        </View>

        {/* Focus Button (Hidden when searching) */}
        {!isSearching && (
          <TouchableOpacity
            style={styles.focusButton}
            onPress={focusOnUserLocation}
          >
            <Ionicons name="locate-sharp" size={20}></Ionicons>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
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
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 17,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginLeft: 10,
  },
});

export default UtilBar;
