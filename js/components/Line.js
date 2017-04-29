import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";

import { getTripInfo } from "../utils/TtssFetch";

export default class LIneComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { stops: [] };
  }

    goToMap() {
    this.props.navigator.push({
      type: "map",
      data: { tramId: this.props.vehicleId },
      title: "Mapa odjazdów"
    });
  }

  async componentWillMount() {
    const stops = await getTripInfo(this.props.tripId);
    this.setState({ stops });
  }

  renderItem(item) {
    return (
      <View style={styles.stopLine}>
        <Text style={styles.depTime}>{item.actualTime ? item.actualTime : item.plannedTime}</Text>
        <Text style={styles.stop}>{item.stop.name}</Text>
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
        <FlatList
          style={styles.searchResult}
          data={this.state.stops}
          keyExtractor={(item, index) => Math.random() * 10000}
          renderItem={item => this.renderItem(item.item)}
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
  }
});
