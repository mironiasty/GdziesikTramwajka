import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";

import { searchForStops } from "../utils/TtssFetch";

export default class SearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { stops: [] };
    this._navigate = this.props.navigation.navigate;
  }

  async searchMore(searchedText) {
    const stops = await searchForStops(searchedText);
    this.setState({ stops });
  }

  onStopPress(stopId, stopName) {
    this._navigate("Departures", { stopId, stopName });
  }

  renderItem(item) {
    return (
      <TouchableHighlight
        underlayColor={"#4fc3f7"}
        style={styles.singleStop}
        onPress={() => {
          this.refs.searchbox.blur();
          this.onStopPress(item.id, item.name);
        }}
      >
        <Text style={styles.stopName}>{item.name}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={"searchbox"}
          style={styles.searchBox}
          placeholder="Szukaj przystanku"
          autoCorrect={false}
          autoCapitalize={"none"}
          autoFocus={true}
          onChangeText={text => this.searchMore(text)}
        />
        <FlatList
          keyboardShouldPersistTaps="always"
          style={styles.searchResult}
          data={this.state.stops}
          keyExtractor={(item, index) => item.id}
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
  searchBox: {
    margin: 10,
    backgroundColor: "#e3f2fd"
  },
  searchResult: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  singleStop: {
    paddingTop: 5,
    paddingBottom: 5
  },
  stopName: {
    fontSize: 18
  }
});
