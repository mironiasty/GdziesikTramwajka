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
import timer from "react-native-timer";

export default class DeparturesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departures: [],
      stopName: "",
      lastUpdateCounter: 0
    };

    this._stopId = this.props.navigation.state.params.stopId;
    this._navigate = this.props.navigation.navigate;
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.stopName
  });

  goToLine(tripId, vehicleId, title) {
    this._navigate("Line", { tripId, vehicleId, title });
  }

  goToMap() {
    this._navigate("Map", { stopId: this._stopId });
  }

  async refreshDepartures() {
    const departures = await getStopDepartures(this._stopId);
    this.setState({ departures: departures.departures, lastUpdateCounter: 0 }); //: departures, lastUpdateCounter: 0});
  }

  async componentWillMount() {
    await this.refreshDepartures();
    timer.setInterval(
      this,
      "refresh",
      async () => await this.refreshDepartures(),
      10 * 1000
    );
    timer.setInterval(
      this,
      "updateTimer",
      () =>
        this.setState({ lastUpdateCounter: this.state.lastUpdateCounter + 1 }),
      1000
    );
  }

  componentWillUnmount() {
    timer.clearInterval(this);
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
              departure.tripId,
              departure.vehicleId,
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
        <View style={styles.lastUpdateWrapper}>
          <Text style={styles.lastUpdate}>Aktualizacja</Text>
          <Text style={styles.lastUpdate}>
            {this.state.lastUpdateCounter}s temu
          </Text>

        </View>
        <Text style={styles.departureHeader}>Odjazdy</Text>
        <FlatList
          style={styles.searchResult}
          data={this.state.departures}
          keyExtractor={(item, index) => Math.random() * 10000}
          renderItem={item => this.renderDeparture(item.item)}
        />
        <TouchableHighlight
          style={styles.mapLink}
          underlayColor={"#4fc3f7"}
          onPress={() => this.goToMap()}
        >
          <Image
            style={styles.mapLinkIcon}
            source={require("../../assets/images/map.png")}
          />
        </TouchableHighlight>

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
  },
  mapLink: {
    position: "absolute",
    bottom: 10,
    right: 20
  },
  mapLinkIcon: {
    height: 50,
    width: 50,
    resizeMode: "cover"
  },
  lastUpdateWrapper: {
    position: "absolute",
    right: 5
  },
  lastUpdate: {
    fontSize: 10
  }
});
