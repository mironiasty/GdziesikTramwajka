
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default class GdziesikTramwajka extends Component {
  constructor(props){
    super(props)
    
    this.state = {stops:[]}
  }

  async searchMore(searchedText){
    const response = await fetch('http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/json?query=' + searchedText)
    const stops = await response.json()
    console.log(stops)
    stops.shift()
    this.setState({stops})
  }

  renderItem(item){
    console.log(item)
    return (<Text>{item.name} - {item.id}</Text>)
  }
  render() {
    console.log('asdf', this.state.stops)
    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.searchBox}
          placeholder="Szukaj przystanku"
          onChangeText={(text) => this.searchMore(text)}/>
        <FlatList
          style={styles.searchResult}
          data={this.state.stops}
          keyExtractor={(item, index) => item.id}
          renderItem={(item) => this.renderItem(item.item)}/>
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
