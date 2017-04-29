import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";

import { getStopDepartures } from "../utils/TtssFetch";
import { parseVehicle } from "../utils/VehicleData";

export default class DeparturesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { departures: [], stopName: "" };
  }

  goToLine(tripId, vehicleId, title) {
    this.props.navigator.push({
      type: "line",
      data: { tripId , vehicleId},
      title
    });
  }

  goToMap() {
    this.props.navigator.push({
      type: "map",
      data: { stopId: this.props.stopId },
      title: "Mapa odjazdów"
    });
  }

  async componentWillMount() {
    const departures = await getStopDepartures(this.props.stopId);
    this.setState(departures);
  }

  vehicleTypeToIcon({ low }) {
    switch (low) {
      case 0:
        return <Image source={require("../../assets/images/steps.png")} />;
      case 1:
        return (
          <Image
            source={require("../../assets/images/almost_accessible.png")}
          />
        );
      case 2:
        return <Image source={require("../../assets/images/accessible.png")} />;
      default:
        return <Text>?</Text>;
    }
  }

  renderDeparture(departure) {
    const vehicleType = parseVehicle(departure.vehicleId);
    return (
      <View style={styles.departureLine}>
        <Text style={styles.depLine}>{departure.patternText}</Text>
        <TouchableHighlight
          underlayColor={"#4fc3f7"}
          onPress={() =>
            this.goToLine(
              departure.tripId, departure.vehicleId,
              `${departure.patternText} > ${departure.direction}`
            )}
          style={styles.depDirection}
        >
          <Text>{departure.direction}</Text>
        </TouchableHighlight>
        <View style={styles.depVehicle}>
          {this.vehicleTypeToIcon(vehicleType)}
        </View>
        <Text style={styles.depTime}>{departure.mixedTime}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor={"#4fc3f7"}
          onPress={() => this.goToMap()}
        >
          <Text>Pokaż na mapie</Text>
        </TouchableHighlight>
        <Text style={styles.departureHeader}>Odjazdy</Text>
        <FlatList
          style={styles.searchResult}
          data={this.state.departures}
          keyExtractor={(item, index) => Math.random() * 10000}
          renderItem={item => this.renderDeparture(item.item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  departureHeader: {
    fontSize: 19,
    padding: 4,
    alignSelf: "center"
  },
  searchResult: {},
  departureLine: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 9
  },
  depLine: {
    width: "10%"
  },
  depDirection: {
    width: "60%"
  },
  depTime: {
    width: "20%"
  },
  depVehicle: {
    width: "10%",
    flexDirection: "row"
  }
});
