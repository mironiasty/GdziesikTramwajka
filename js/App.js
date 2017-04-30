import React, { Component } from "react";
import {
  BackAndroid,
  Image,
  Navigator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

import { StackNavigator } from "react-navigation";

import MapComponent from "./components/Map";
import SearchComponent from "./components/Search";
import DeparturesComponent from "./components/Departures";
import LineComponent from "./components/Line";

export const GdziesikTramwajka = StackNavigator(
  {
    Search: {
      screen: SearchComponent,
      navigationOptions: {
        headerLeft: <Image source={require("../assets/images/tram.png")} />
      }
    },
    Departures: { screen: DeparturesComponent },
    Line: { screen: LineComponent },
    Map: { screen: MapComponent, navigationOptions: {title: "Mapa odjazdów"} }
  },
  {
    navigationOptions: {
      title: "Gdzieśże Tramwaju",
      headerTintColor: "#e1f5fe",
      headerStyle: {
        backgroundColor: "#0277bd"
      }
    }
  }
);

