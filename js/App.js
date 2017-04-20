
import React, { Component } from 'react';
import {
  Navigator
} from 'react-native';

import SearchComponent from './components/Search'
import DeparturesComponent from './components/Departures'

export default class GdziesikTramwajka extends Component {
  constructor(props){
    super(props)
    
    this.state = {stops:[]}
  }

  renderScene(route, navigator){
    console.log(route)
    switch(route.type){
      case 'search':
        return (<SearchComponent navigator={navigator} />)
      case 'departures':
        return (<DeparturesComponent navigator={navigator} stopId={route.data.stopId} />)
    }
  }


  render() {
    console.log('asdf', this.state.stops)
    return (
       <Navigator 
          initialRoute={{ type: 'search' }} 
          renderScene={(route, navigator) => this.renderScene(route, navigator)} 
         />
    );
  }
}
