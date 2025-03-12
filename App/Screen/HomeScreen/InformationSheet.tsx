import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";

interface ChargingStation {
  distance: number;
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

interface InformationSheetProps {
  selectedStation: ChargingStation | null,
  fetchDirections: (destination: ChargingStation) => void
}

const InformationSheet: React.FC<InformationSheetProps> = ({
  selectedStation,
  fetchDirections
}) => {
    return (
        <ActionSheet id="stationDetails">
            {selectedStation && (
              <View style={styles.actionSheet}>
                <View style={styles.header}>
                  <Text style={styles.stationTitle}>
                    {selectedStation.title}
                  </Text>
                  <TouchableOpacity style={styles.favouriteButton}>
                    <Ionicons name="heart" size={20} color={Colors.WHITE}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.actionSheetContent}>
                  <Text style={styles.stationDistance}>
                    Distance:{" "}
                    {selectedStation.distance.toFixed(2)}{" "}
                    km
                  </Text>
                </View>
                <View style={styles.actionSheetButtons}></View>
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() => fetchDirections(selectedStation)}
                >
                  <Text style={styles.directionButtonText}>Get Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => SheetManager.hide("stationDetails")}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </ActionSheet>
    )
}

const styles = StyleSheet.create({
  actionSheet: {
      padding: 20,
      paddingBottom: 30,
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      gap: 10,
    },
    stationTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
      flexWrap: "wrap",
    },
    favouriteButton: {
      backgroundColor: Colors.PRIMARY,
      padding: 8,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    actionSheetContent: {
      paddingVertical: 10,
    },
    stationDistance: {
      fontSize: 16,
      color: "#666",
      marginBottom: 15,
    },
    actionSheetButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    directionButton: {
      backgroundColor: Colors.PRIMARY,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    directionButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    closeButton: {
      marginTop: 15,
      backgroundColor: "#ddd",
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    closeButtonText: {
      color: "#333",
      fontSize: 16,
    },
})

export default InformationSheet;