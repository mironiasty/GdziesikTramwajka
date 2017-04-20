import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import { getStopDepartures } from '../utils/TtssFetch'


export default class DeparturesComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { departures: [] }
  }

  async componentWillMount() {
    const departures = await getStopDepartures(this.props.stopId);
    this.setState({ departures })
  }

  backToSearch(){
    this.props.navigator.popToTop()
  }

  renderDeparture(departure) {
    return (
      <View style={styles.departureLine}>
        <Text style={styles.depLine}>{departure.patternText}</Text>
        <Text style={styles.depDirection}>{departure.direction}</Text>
        <Text style={styles.depTime}>{departure.mixedTime}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => this.backToSearch()}
          style={styles.backButton}>
          <Text>&lt; Powrót do wyszukiwania</Text>
        </TouchableHighlight>
        <Text style={styles.departureHeader}>Odjazdy z przystanku</Text>
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
  },
  backButton: {
    margin: 5,
  },
  departureHeader:{
    fontSize: 16,
    padding: 4
  },
  departureLine: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 5
  },
  depLine:{
    width: '10%'
  },
  depDirection: {
    width: '70%'
  },
  depTime:{
    width: '20%'
  }
});