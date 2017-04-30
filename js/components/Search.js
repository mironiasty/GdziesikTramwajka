import React, { Component } from "react";
import {
  FlatList,
  NetInfo,
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

    this.state = { stops: [], offline: false };
    this._navigate = this.props.navigation.navigate;
  }

  handleConnectivityChange(isConnected) {
    console.log("Then, is " + (isConnected ? "online" : "offline"));
    this.setState({ offline: !isConnected });
  }

  async searchMore(searchedText) {
    const stops = await searchForStops(searchedText);
    this.setState({ stops });
  }

  onStopPress(stopId, stopName) {
    this._navigate("Departures", { stopId, stopName });
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ offline: !isConnected });
      console.log("First, is " + (isConnected ? "online" : "offline"));
    });
    NetInfo.isConnected.addEventListener("change", () =>
      this.handleConnectivityChange()
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener("change", () =>
      this.handleConnectivityChange()
    );
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

  renderNoConnection() {
    if (this.state.offline) {
      return (
        <View style={styles.offline}>
          <Text style={styles.offlineText}>
            Sprawdź swoje połączenie z internetem
          </Text>
        </View>
      );
    }
    return null;
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
        {this.renderNoConnection()}

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
  },
  offline: {
    position: "absolute",
    width: "100%",
    height: 100,
    paddingTop: 30,
    backgroundColor: "#f00",
    alignItems: "center"
  },
  offlineText: {
    color: "#fff"
  }
});
