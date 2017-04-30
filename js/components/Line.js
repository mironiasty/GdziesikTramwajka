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

import { getTripInfo } from "../utils/TtssFetch";
import timer from "react-native-timer";

export default class LIneComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: [],
      lastUpdateCounter: 0
    };
    this._vehicleId = this.props.navigation.state.params.vehicleId;
    this._tripId = this.props.navigation.state.params.tripId;
    this._navigate = this.props.navigation.navigate;
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title
  });

  goToMap() {
    this._navigate("Map", { tramId: this._vehicleId });
  }

  async refreshLines() {
    const stops = await getTripInfo(this._tripId);
    this.setState({ stops, lastUpdateCounter: 0 });
  }
  async componentWillMount() {
    await this.refreshLines();
    timer.setInterval(
      this,
      "refresh",
      async () => await this.refreshLines(),
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

  renderItem(item) {
    return (
      <View style={styles.stopLine}>
        <Text style={styles.depTime}>
          {item.actualTime ? item.actualTime : item.plannedTime}
        </Text>
        <Text style={styles.stop}>{item.stop.name}</Text>
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
        <Text style={styles.departureHeader}>Trasa linii</Text>

        <FlatList
          style={styles.searchResult}
          data={this.state.stops}
          keyExtractor={(item, index) => Math.random() * 10000}
          renderItem={item => this.renderItem(item.item)}
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
  stopLine: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 9
  },
  depTime: {
    width: "30%"
  },
  stop: {
    width: "70%"
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
