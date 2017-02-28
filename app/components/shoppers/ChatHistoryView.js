import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import Swiper from 'react-native-swiper';

export default class ChatHistoryView extends Component {

  constructor(props) {
    super(props);
    categoriesToHelpIn = [];
  }

  loadCategoryQueueLength(category) {
    //Fetch category queue length
    fetch('https://savvyshopper.herokuapp.com/api/userQueue/' + category, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if(response){
        //add category help button for expert to help first user in that queue
        this.categoriesToHelpIn.push(category);
      }
      return;
    }).done();
  }

  componentDidMount() {
    //need to load categories for the logged in expert
    var categories = ['HOME'];
    for(var i = 0; i < categories.length; i++){
      loadCategoryQueueLength(categories[i]);
    }
  }

  navigate(scene) {
    this.props.navigator.push({
      screen: scene,
      passProps: {
        user: this.props.user
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Chat History</Text>
        {this.props.getActive() && <TouchableHighlight
          style={styles.button}
          onPress={() => this.navigate('Chat')}>
          <Text style={styles.buttonText}>HALP</Text>
        </TouchableHighlight>}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: "stretch"
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  text: {
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 50,
    width: 250,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});