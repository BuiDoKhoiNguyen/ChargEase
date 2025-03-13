import { View, StyleSheet, Image } from "react-native";
import React, { useContext } from "react";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MapViewStyle from "../../Utils/MapViewStyle.json";
import Markers from "./Markers";
import { UserLocationContext } from "../../Context/UserLocationContext";


interface Place {
  // Define the structure of a place object
  latitude: number;
  longitude: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface AppMapViewProps {
  placeList: Place[];
}

const AppMapView: React.FC<AppMapViewProps> = ({ placeList }) => {
  const userLocationContext = useContext(UserLocationContext);

  if (!userLocationContext || !userLocationContext.location?.latitude) {
    return null;
  }

  const { location } = userLocationContext;

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  };

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={MapViewStyle}
        region={region}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Image
              source={require("../../../assets/images/carmark.png")}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
        )}
        {placeList &&
          placeList.map((item, index) => (
            <Markers key={index} index={index} place={item} />
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default AppMapView;