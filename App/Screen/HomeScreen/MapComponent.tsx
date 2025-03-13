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
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import chargingStations from "../../Utils/dummyData";
import UtilBar from "./UtilBar";
import colors from "../../Utils/Colors";
import { SheetManager } from "react-native-actions-sheet";
import Colors from "../../Utils/Colors";
import InformationSheet from "./InformationSheet";
import { useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../Navigations/types";

interface ChargingStation {
  distance: number;
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  isFavourite: boolean;
}

const OPENROUTESERVICE_API_KEY =
  "5b3ce3597851110001cf6248ac34d8a92f584c05939953f73989bb8a";

const MapComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [isTraveling, setIsTraveling] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );

  const route = useRoute<HomeScreenProps["route"]>();
  const favouriteSelectedStation = route.params?.selectedStation;

  useEffect(() => {
    if (favouriteSelectedStation) {
      fetchDirections(favouriteSelectedStation);
    }
  }, [favouriteSelectedStation]);

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        startTracking();
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
      stopTracking();
    };
  }, []);

  const startTracking = async () => {
    stopTracking(); // Ensure no duplicate tracking
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        setUserLocation((prevLocation) => {
          if (
            !prevLocation ||
            prevLocation.latitude !== location.coords.latitude ||
            prevLocation.longitude !== location.coords.longitude
          ) {
            return {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
          }
          return prevLocation;
        });
      }
    );
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const focusOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const fetchDirections = async (destination: ChargingStation) => {
    if (!userLocation) return;

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTESERVICE_API_KEY}&start=${userLocation.longitude},${userLocation.latitude}&end=${destination.longitude},${destination.latitude}`;

    try {
      const response = await axios.get(url);
      const coords = response.data.features[0].geometry.coordinates.map(
        ([longitude, latitude]: [number, number]) => ({ latitude, longitude })
      );
      setRouteCoords(coords);

      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      SheetManager.hide("stationDetails");
      setIsTraveling(true);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const handleStationSelect = (station: ChargingStation) => {
    Keyboard.dismiss();
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
            followsUserLocation
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
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeWidth={10}
                strokeColor={Colors.PRIMARY}
              />
            )}
          </MapView>
          <UtilBar
            focusOnUserLocation={focusOnUserLocation}
            onSelectStation={handleStationSelect}
          />
          <InformationSheet
            selectedStation={selectedStation}
            fetchDirections={fetchDirections}
          />

          {isTraveling && (
            <TouchableOpacity
              onPress={() => {
                setIsTraveling(false);
                setRouteCoords([]);
                setSelectedStation(null);
              }}
              style={styles.exitButton}
            >
              <Text style={styles.exitButtonText}>Exit pathing</Text>
            </TouchableOpacity>
          )}
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
  exitButton: {
    position: "absolute",
    marginVertical: "auto",
    bottom: 10, // Adjust based on placement
    left: 10,
    right: 10,
    backgroundColor: "white",
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  exitButtonText: {
    color: "#FF4D4D",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MapComponent;
