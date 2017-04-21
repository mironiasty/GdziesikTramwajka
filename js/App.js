
import React, { Component } from 'react';
import {
  Image,
  Navigator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import SearchComponent from './components/Search'
import DeparturesComponent from './components/Departures'
import LineComponent from './components/Line'

export default class GdziesikTramwajka extends Component {
  constructor(props) {
    super(props)

    this.state = { stops: [] }
  }

  renderScene(route, navigator) {
    switch (route.type) {
      case 'search':
        return (<SearchComponent navigator={navigator} />)
      case 'departures':
        return (<DeparturesComponent navigator={navigator} stopId={route.data.stopId} />)
      case 'line':
        console.log('liiiine', route.data)
        return (<LineComponent navigator={navigator} tripId={route.data.tripId} />)
    }
  }


  render() {
    return (
      <View style={styles.appcontainer}>
        <Navigator
          styles={styles.navigator}
          initialRoute={{ type: 'search', title: 'Gdziesik Tramwajka' }}
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          sceneStyle={{ paddingTop: 64 }}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={{
                LeftButton: (route, navigator, index, navState) => {
                  if (route.type === 'search')
                  { 
                    return <Image style={styles.headerImage} source={require('../assets/images/tram.png')} /> 
                  }
                  else {
                    return (
                      <TouchableHighlight onPress={() => navigator.pop()} style={styles.backButton}>
                        <Image style={styles.headerImage} source={require('../assets/images/arrow_back.png')}/>
                      </TouchableHighlight>);
                  }
                },
                RightButton: (route, navigator, index, navState) => { return null; },
                Title: (route, navigator, index, navState) =>
                { return (<Text style={[styles.headerText, { width: '80%' }]} numberOfLines={1} ellipsizeMode={'tail'}>{route.title}</Text>); },
              }}
              style={styles.topBar} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appcontainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topBar: {
    padding: 10,
    paddingTop: 30,
    paddingBottom: 0,
    backgroundColor: '#0277bd',
    height: 60
  },
  headerText: {
    color: '#e1f5fe',
    fontFamily: 'roboto',
    marginTop: 10,
    fontSize: 25
  },
  headerImage: {
    marginTop: 5
  },
  backButton: {
    paddingLeft: 5
  }

});