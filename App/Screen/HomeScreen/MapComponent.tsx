import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  AppState,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import chargingStations from "../../Utils/dummyData";
import UtilBar from "./UtilBar";
import colors from "../../Utils/Colors";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";

interface ChargingStation {
  distance: number;
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

const GOOGLE_MAPS_APIKEY = "YOUR_GOOGLE_MAPS_API_KEY";

const MapComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>(
    []
  );
  const [searchResults, setSearchResults] = useState<ChargingStation[]>([]);
  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) setPermissionDenied(true);
          return;
        }

        setPermissionDenied(false);
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (isMounted) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();

    const handleAppStateChange = (nextAppState: any) => {
      if (nextAppState === "active") {
        fetchLocation();
      }
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      isMounted = false;
      appStateListener.remove();
    };
  }, []);

  setInterval(async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setUserLocation((prevLocation) => {
      if (
        !prevLocation ||
        prevLocation.latitude !== location.coords.latitude ||
        prevLocation.longitude !== location.coords.longitude
      ) {
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
      }
      return prevLocation;
    });

    const updatedStations = chargingStations.map((station) => ({
      ...station,
      distance: haversineDistance(
        location.coords.latitude,
        location.coords.longitude,
        station.latitude,
        station.longitude
      ),
    }));

    updatedStations.sort((a, b) => a.distance - b.distance);
    setFilteredStations(updatedStations);
  }, 15000);

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const r = 6371; // Radius of the Earth in km
    const p = Math.PI / 180;

    const a =
      0.5 -
      Math.cos((lat2 - lat1) * p) / 2 +
      (Math.cos(lat1 * p) *
        Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p))) /
        2;

    return 2 * r * Math.asin(Math.sqrt(a));
  };

  const focusOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults(filteredStations);
    }

    const results = filteredStations
      .filter((station) =>
        station.title.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a.distance - b.distance);

    setSearchResults(results);
  };

  const handleStationSelect = (station: ChargingStation) => {
    Keyboard.dismiss();
    setFilteredStations([]);
    setSelectedStation(station);
    mapRef.current?.animateToRegion(
      {
        latitude: station.latitude,
        longitude: station.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
    SheetManager.show("stationDetails");
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (permissionDenied) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Please enable location services in Settings to use this application.
        </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.settingsButtonText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    userLocation && (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation
            initialRegion={userLocation}
          >
            {chargingStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude,
                }}
                title={station.title}
                image={require("../../../assets/images/station-marker.png")}
                onPress={() => handleStationSelect(station)}
              />
            ))}

            {selectedStation && userLocation && (
              <MapViewDirections
                origin={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                destination={{
                  latitude: selectedStation.latitude,
                  longitude: selectedStation.longitude,
                }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={5}
                strokeColor={colors.PRIMARY}
                mode="DRIVING"
              />
            )}
          </MapView>
          <UtilBar
            focusOnUserLocation={focusOnUserLocation}
            onSearch={handleSearch}
            filteredStations={searchResults}
            onSelectStation={handleStationSelect}
          />

          {/* Action Sheet for Station Details */}
          <ActionSheet id="stationDetails">
            {selectedStation && (
              <View style={styles.actionSheetContent}>
                <Text style={styles.stationTitle}>{selectedStation.title}</Text>
                <Text style={styles.stationDistance}>
                  Distance:{" "}
                  {haversineDistance(
                    selectedStation.latitude,
                    selectedStation.longitude,
                    userLocation.latitude,
                    userLocation.longitude
                  ).toFixed(2)}{" "}
                  km
                </Text>
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedStation.latitude},${selectedStation.longitude}`
                    )
                  }
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
        </View>
      </TouchableWithoutFeedback>
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 16,
    color: colors.BLACK,
    textAlign: "center",
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  settingsButtonText: {
    fontSize: 16,
    color: colors.WHITE,
    fontWeight: "bold",
  },
  actionSheetContent: { padding: 20 },
  stationTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  stationDistance: {},
  directionButton: {
    backgroundColor: colors.PRIMARY,
    padding: 10,
    borderRadius: 10,
  },
  directionButtonText: { color: colors.WHITE, textAlign: "center" },
  closeButton: { marginTop: 10, padding: 10 },
  closeButtonText: { textAlign: "center", color: colors.BLACK },
});

export default MapComponent;
