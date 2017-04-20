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
import { parseVehicle } from '../utils/VehicleData'


export default class DeparturesComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { departures: [], stopName: '' }
  }

  goToLine(tripId, title) {
    this.props.navigator.push({ type: 'line', data: { tripId: tripId }, title })
  }

  async componentWillMount() {
    const departures = await getStopDepartures(this.props.stopId);
    this.setState(departures)
  }

  vehicleTypeToIcon({ low }) {
    switch (low) {
      case 0:
        return '';
      case 1:
        return '♿*';
      case 2:
        return '♿';
    }
  }

  renderDeparture(departure) {
    const vehicleType = parseVehicle(departure.vehicleId);


    return (
      <View style={styles.departureLine}>
        <Text style={styles.depLine}>{departure.patternText}</Text>
        <TouchableHighlight
          onPress={() => this.goToLine(departure.tripId, `${departure.patternText} > ${departure.direction}`)} style={styles.depDirection}>
          <Text>{departure.direction}</Text>
          </TouchableHighlight>
        <Text style={styles.depVehicle}>{this.vehicleTypeToIcon(vehicleType)}</Text>
        <Text style={styles.depTime}>{departure.mixedTime}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.departureHeader}>Odjazdy</Text>
        <FlatList
          style={styles.searchResult}
          data={this.state.departures}
          keyExtractor={(item, index) => Math.random() * 10000}
          renderItem={(item) => this.renderDeparture(item.item)} />
      </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  departureHeader: {
    fontSize: 16,
    padding: 4
  },
  departureLine: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 9
  },
  depLine: {
    width: '10%'
  },
  depDirection: {
    width: '60%'
  },
  depTime: {
    width: '20%'
  },
  depVehicle: {
    width: '10%'
  }
});