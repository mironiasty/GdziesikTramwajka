
import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  TouchableHighlight,
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
    switch (route.type) {
      case 'search':
        return (<SearchComponent navigator={navigator} />)
      case 'departures':
        return (<DeparturesComponent navigator={navigator} stopId={route.data.stopId} />)
    }
  }


  render() {
    return (
      <View style={styles.appcontainer}>
        <Navigator
          styles={styles.navigator}
          initialRoute={{ type: 'search', title: 'Gdziesik Tramajka' }}
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          sceneStyle={{ paddingTop: 64 }}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={{
                LeftButton: (route, navigator, index, navState) => {
                  if (route.type === 'search')
                  { return null; }
                  else {
                    console.log(route)
                    return ( <TouchableHighlight onPress={() => navigator.pop()} style={styles.backButton}>
                      <Text style={styles.headerText}>◀</Text></TouchableHighlight>);
                  }
                },
                RightButton: (route, navigator, index, navState) => { return null; },
                Title: (route, navigator, index, navState) =>
                { return (<Text style={[styles.headerText, {width: '80%'}]} numberOfLines={1} ellipsizeMode={'tail'}>{route.title}</Text>); },
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
    backgroundColor: '#89b6ff'
  },
  topBar: {
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#1558c4',
    height: 60
  },
  headerText: {
    color: '#ffdb4c',
    fontSize: 25
  },
  backButton:{
paddingLeft: 5
  }

});