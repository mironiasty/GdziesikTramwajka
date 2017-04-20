
import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';

import SearchComponent from './components/Search'
import DeparturesComponent from './components/Departures'

export default class GdziesikTramwajka extends Component {
  constructor(props) {
    super(props)

    this.state = { stops: [] }
  }

  renderScene(route, navigator) {
    console.log(route)
    switch (route.type) {
      case 'search':
        return (<SearchComponent navigator={navigator} />)
      case 'departures':
        return (<DeparturesComponent navigator={navigator} stopId={route.data.stopId} />)
    }
  }


  render() {
    console.log('asdf', this.state.stops)
    return (
      <View style={styles.appcontainer}>
        <View style={styles.topBar}>
          <Text style={styles.appName}>Gdziesik Tramwajka?</Text>
        </View>
        <Navigator
          styles={styles.navigator}
          initialRoute={{ type: 'search' }}
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appcontainer: {
    flex: 1,
    backgroundColor: '#89b6ff'
  },
  topBar: {
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#1558c4'
  },
  appName: {
    color: '#ffdb4c',
    fontSize: 25
  },
  navigator: {
    backgroundColor: 'transparent',
  }
});