import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';


export default class DeparturesComponent extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.stopId}xxx</Text>
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