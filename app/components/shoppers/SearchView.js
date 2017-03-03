import React, { Component, PropTypes  } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  ActivityIndicator
} from 'react-native';
import AvailableExperts from '../AvailableExperts';
var api = require('../../Utils/api');
import {
  Button,
  FormLabel, FormInput, SearchBar
} from 'react-native-elements';

export default class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      isLoading: false,
      error: false
    };
  }

  handleChange(event) {
    this.setState({
      searchTerm: event.nativeEvent.text
    });
  }

  goToAvailableExperts(experts) {
    this.props.navigator.push({
        screen: "AvailableExperts",
        passProps: { experts: experts }
    });
  }

  handleSubmit(event) {

    // alert('tony');
    this.setState({
      isLoading: true
    });

    console.log('submit', this.state.searchTerm);

    api.getExperts(this.state.searchTerm).then((experts) => {

      console.log('experts response', experts);

      if (!experts.length) {

        this.setState({
          error: 'No Experts Found',
          isLoading: false
        });

      } else {

        //index.ios.js - pushing a new route onto the stack, able to do this due to index.ios.js component created that wraps SavvyShopper component

        console.log('this.props', this.props);
        console.log('experts', experts);

        this.goToAvailableExperts(experts).bind(this); //navigate to available experts

        this.setState({
          isLoading: false,
          error: false,
          searchTerm: ''
        });
      }

    });

  }

  render() {

    var displayErr = (
      this.state.error ? <Text>{this.state.error} </Text> : <View></View>
    );

    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Find Expert For</Text>
        <SearchBar
          lightTheme
          style={styles.searchInput}
          value={this.state.username}
          onChange={this.handleChange.bind(this)} />


          <Button
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10 }}
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          raised title='Chat Now!' />

          <ActivityIndicator
          animating={this.state.isLoading}
          color="#111"
          size="large">
          </ActivityIndicator>
          {displayErr}
      </View>
    );
  }

}


var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    title: {
        marginBottom: 20,
        fontSize: 25,
        textAlign: 'center',
        color: '#fff'
    },
    searchInput: {
        height: 50,
        padding: 4,
        marginRight: 5,
        fontSize: 23,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        color: 'white'
    },
    buttonText: {
        fontSize: 18,
        color: '#111',
        alignSelf: 'center'
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});