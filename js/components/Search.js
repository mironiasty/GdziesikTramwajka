
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import { searchForStops } from '../utils/TtssFetch'

export default class SearchComponent extends Component {
  constructor(props) {
    super(props)

    this.state = { stops: [] }
  }

  async searchMore(searchedText) {
    const stops = await searchForStops(searchedText)
    this.setState({ stops })
  }

  onStopPress(stopId) {
    this.props.navigator.push({ type: 'departures', data: { stopId } })
  }

  renderItem(item) {
    console.log(item)
    return (
      <TouchableHighlight onPress={() => this.onStopPress(item.id)}>
        <Text>{item.name} - {item.id}</Text>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchBox}
          placeholder="Szukaj przystanku"
          onChangeText={(text) => this.searchMore(text)} />
        <FlatList
          style={styles.searchResult}
          data={this.state.stops}
          keyExtractor={(item, index) => item.id}
          renderItem={(item) => this.renderItem(item.item)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  searchBox: {
    marginTop: 10,
    height: 30,
  },
  searchResult: {
    flex: 1
  }
});
