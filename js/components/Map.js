"use strict";
/* eslint no-console: 0 */

import React, { Component } from "react";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import { StyleSheet, Text, StatusBar, View } from "react-native";

import {
  getTramsPosition,
  getStopLocation,
  getAllStops
} from "../utils/TtssFetch";

import { MapBoxAccessToken } from "../api/MapBoxApiKey";
Mapbox.setAccessToken(MapBoxAccessToken);

const selectedStopPosition = {
  latitude: 50.064665,
  longitude: 19.945006111111113
};

export default class MapExample extends Component {
  constructor(props) {
    super(props);
    this.state = { stopData: [], tramPositions: [] };
    this.intervalHandler = null;
  }

  async getStopsPosition() {
    const stopDataOrg = await getAllStops();
    const stopData = stopDataOrg.map(stop => ({
      id: stop.id,
      type: "point",
      title: stop.name,
      coordinates: [stop.latitude, stop.longitude],
      annotationImage: {
        source: {
          uri: "stop"
        },
        height: 16, // required. number. Image height
        width: 16 // required. number. Image width}
      }
    }));
    this.setState({ stopData });
  }
  async updateTramPositions() {
    const trams = await getTramsPosition();
    let tramPositions = trams.map(tram => ({
      coordinates: [tram.latitude, tram.longitude],
      type: "point",
      title: tram.name,
      id: tram.id,
      annotationImage: {
        source: {
          uri: "ridingtram"
        },
        height: 16, // required. number. Image height
        width: 16 // required. number. Image width}
      }
    }));
    this.setState({ tramPositions });
  }
  async componentWillMount() {
    await this.getStopsPosition();
    await this.updateTramPositions();
    this.intervalHandler = setInterval(
      async () => await this.updateTramPositions(),
      10 * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandler);
  }
  render() {
    // StatusBar.setHidden(true);
    const postitions = this.state.tramPositions
      ? this.state.tramPositions.concat(this.state.stopData)
      : this.state.stopData;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialCenterCoordinate={selectedStopPosition}
          initialZoomLevel={14}
          rotateEnabled={false}
          pitchEnabled={false}
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.light}
          annotations={postitions}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch"
  },
  map: {
    flex: 1
  }
});
