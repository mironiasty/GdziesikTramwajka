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

  async componentWillMount() {
    const stops = await getTripInfo(this.props.tripId);
    this.setState({ stops });
  }

  renderItem(item) {
    return (
      <View style={styles.stopLine}>
        <Text style={styles.depTime}>{item.actualTime}</Text>
        <Text style={styles.stop}>{item.stop.name}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
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
