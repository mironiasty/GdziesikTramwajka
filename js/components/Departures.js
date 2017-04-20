import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import {getStopDepartures} from '../utils/TtssFetch'


export default class DeparturesComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {departures: []}
  }

  async componentWillMount(){
    const departures = await getStopDepartures(this.props.stopId);
    this.setState({departures})
  }

  renderDeparture(departure){
    return (
      <View>
        <Text>{departure.patternText}</Text>
        <Text>{departure.direction}</Text>
        <Text>{departure.mixedTime}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Odjazdy z przystanku</Text>
          <FlatList
            style={styles.searchResult}
            data={this.state.departures}
            keyExtractor={(item, index) => item.tripId}
            renderItem={(item) => this.renderDeparture(item.item)} />
      </View>)
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