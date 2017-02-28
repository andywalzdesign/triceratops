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
    this.categoriesToHelpIn = [];
  }

  loadCategoryQueueLength(category) {
    //Fetch category queue length
    fetch('http://localhost:2300/api/userQueue/queue/' + category, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then((queueLength) => {
      console.log("QUEUELENGTH", queueLength);
      if(queueLength){
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
      this.loadCategoryQueueLength(categories[i]);
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
    console.log("CATS TO HELP IN", this.categoriesToHelpIn);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Chat History</Text>
        {this.props.getActive() && this.categoriesToHelpIn.map((category) => {
          <TouchableHighlight
          style={styles.button}
          onPress={() => this.navigate('Chat')}>
          <Text style={styles.buttonText}>HALP IN {category}</Text>
        </TouchableHighlight>
        })
      }
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