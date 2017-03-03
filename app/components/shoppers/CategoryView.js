import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight,
  AlertIOS,
  Image,
  Navigator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import ChatView from '../ChatView';
import {
  Tile
} from 'react-native-elements'

//eventually, replace with a call to API for categories?
var categories = ['HOME', 'FOOD', 'TECH', 'WOMEN\'S FASHION', 'MEN\'S FASHION', 'ENTERTAINMENT'];

//current work around for dynamically loading assets
let loadCategoryImage = function(category){
  switch(category){
    case 'home':
      return require('./../../assets/imgs/home.jpg');
    case 'men\'s\ fashion':
      return require('./../../assets/imgs/mens-fashion.jpg');
    case 'women\'s\ fashion':
      return require('./../../assets/imgs/womens-fashion.jpg');
    case 'tech':
      return require('./../../assets/imgs/tech.jpg');
    case 'food':
      return require('./../../assets/imgs/food.jpg');
    case 'entertainment':
      return require('./../../assets/imgs/entertainment.jpg');
  }
}

export default class CategoryView extends Component {

  constructor(props) {
    console.log("CATEGORY PROPS", props);
    super(props);
  }

  openChat(category) {
    console.log("CATEGORY USER PROPS TONY", this.props)
    this.props.navigator.push({
      screen: 'Chat',
      passProps: {
        user: this.props.user,
        category: category
      }
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.wrapper}>
        {categories.map(function(category) {
          return (
            // Need to replace AlertIOS with function to call API and connect to chat with expert in category
            // Need to set current category on the state
              <View style={styles.category}>
                  <Tile
                  user={this.props}
                  onPress={() => this.openChat(category)}
                  key={category}
                  imageSrc={loadCategoryImage(category.toLowerCase())}
                  title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolore exercitationem"
                  featured caption={category}
                  />
              </View>
          )
        }, this)}
        </ScrollView>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  buttonText: {
    flex: 1,
    padding: 4,
    fontSize: 22,
    color: 'white',
    borderColor: '#FFFFFF',
    alignSelf: 'stretch',
    backgroundColor: '#48BBEC',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    width: 150,
    height: 150,
  },
  category: {
    marginBottom: 1,
  },
  wrapper: {
    marginTop: 1,
  },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  navigationBar: {
      backgroundColor: 'blue',
   },
   leftButton: {
      color: 'white',
      margin: 10,
      fontSize: 14,
   },
   title: {
      paddingVertical: 10,
      color: '#ffffff',
      justifyContent: 'center',
      fontSize: 20
   },
   rightButton: {
      color: '#ffffff',
      margin: 10,
      fontSize: 14
   },
});