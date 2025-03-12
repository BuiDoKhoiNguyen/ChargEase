import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Searchbar } from "react-native-paper";
import Color from "../../Utils/Colors";
import { useSelector } from "react-redux";
import { RootState } from "../../Utils/Redux/Store";

interface ChargingStation {
  distance: number;
  id: number;
  title: string;
  latitude: number;
  longitude: number;
}

interface SearchListProps {
  onSelectStation: (station: ChargingStation) => void;
  setIsSearching: (isSearching: boolean) => void;
  isSearching: boolean
}

const SearchList: React.FC<SearchListProps> = ({
  onSelectStation,
  setIsSearching,
  isSearching
}) => {
  const chargingStations = useSelector((state: RootState) => state.ChargingStations);
  const [searchingResult, setSearchingResult] = useState<ChargingStation[]>(chargingStations);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  //   onSearch(query);
  // };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchingResult(chargingStations);
    } else {
      const results = chargingStations
        .filter((station) =>
          station.title.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.distance - b.distance);
  
      setSearchingResult(results);
    }

  };

  return (
    <View>
      {/* Search Input */}
      <Searchbar
        placeholder="Search Charging Stations"
        onChangeText={handleSearch}
        value={searchQuery}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
        style={styles.searchBar}
        inputStyle={styles.searchText}
        placeholderTextColor={Color.GRAY}
      />

      {/* Search Results Dropdown */}
      {isSearching && (
        <FlatList
          data={searchingResult}
          keyExtractor={(item) => item.id.toString()}
          style={styles.resultsContainer}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => onSelectStation(item)}>
              <View style={styles.resultItem}>
                <Text style={styles.resultText}>{item.title}</Text>
                <Text style={styles.resultDistance}>
                  Distance: {item.distance.toFixed(2)} km
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchText: {
    fontSize: 16,
    fontWeight: "500",
    color: Color.BLACK,
  },
  resultsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    elevation: 5,
    maxHeight: 250,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  resultItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultDistance: {
    textAlign: "right",
    fontSize: 14,
    color: Color.GRAY,
    marginTop: 4,
    fontStyle: "italic",
  },
  resultText: {
    fontSize: 16,
    color: "black",
  },
});

export default SearchList;
