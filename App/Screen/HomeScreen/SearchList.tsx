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

interface ChargingStation {
  distance: number;
  id: number;
  title: string;
  latitude: number;
  longitude: number;
}

interface SearchListProps {
  onSearch: (query: string) => void;
  filteredStations: ChargingStation[];
  onSelectStation: (station: ChargingStation) => void;
  onFocus: () => void;
  onBlur: () => void;
  isSearching: boolean;
}

const SearchList: React.FC<SearchListProps> = ({
  onSearch,
  filteredStations,
  onSelectStation,
  onFocus,
  onBlur,
  isSearching,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <View>
      {/* Search Input */}
      <Searchbar
        placeholder="Search Charging Stations"
        onChangeText={handleSearch}
        value={searchQuery}
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.searchBar}
        inputStyle={styles.searchText}
        placeholderTextColor={Color.GRAY}
      />

      {/* Search Results Dropdown */}
      {isSearching && (
        <FlatList
          data={filteredStations}
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
