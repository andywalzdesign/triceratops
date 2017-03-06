import React, { Component, PropTypes  } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  NavigatorIOS,
  TouchableHighlight,
  TextInput,
  ActivityIndictorIOS
} from 'react-native';
import SearchView from './shoppers/SearchView';
import TopExperts from './TopExperts';
import AvailableExperts from './AvailableExperts';
import Tabs from 'react-native-tabs';
import { SearchBar } from 'react-native-elements';

let connection = require('../Utils/connection');

const usersToHelp = null;
const usersToCheck = null;

export default class HomeView extends Component {
  constructor(props){
    console.log('Home Props:', props);
    super(props);
    this.state = {
      page: 'Home',
      isActive: false,
      currentUser: null,
      index: 0
    };
  }

  activeSwitcher() {
    this.setState({isActive: !this.state.isActive});
    this.renderExpert();
  }

  getActive() {
    return this.state.isActive;
  }

  navigateTo(destination, propsToPass, chatPartner) {
    if(destination === 'Chat') {
      fetch(connection + '/api/userQueue/loadUser/' + chatPartner.id, {
        method: 'GET'
      }).done();
    }
    if (!propsToPass) {

      console.log('destination', this.props.navigator.state.routeStack[this.props.navigator.state.routeStack.length - 1]);

     if (destination !== this.props.navigator.state.routeStack[this.props.navigator.state.routeStack.length - 1].screen) {
      this.props.navigator.push({
          screen: destination
      });
     }

    } else {
      console.log('destination', destination);
      console.log('destination2', destination, this.props.navigator.state.routeStack[this.props.navigator.state.routeStack.length - 1].screen);

      console.log('props', propsToPass);

    if (destination !== this.props.navigator.state.routeStack[this.props.navigator.state.routeStack.length - 1].screen) {

      this.props.navigator.push({
          screen: destination,
          passProps: {
            user: propsToPass,
            chatPartner: chatPartner
          }
        });
      }
    }
  }

  showNext() {
    if(usersToCheck.length - 1 > this.state.index) {
      this.setState({currentUser: usersToHelp[usersToCheck[this.state.index+1]], index: this.state.index+1});
    } else {
      this.setState({currentUser: usersToHelp[usersToCheck[0]], index: 0});
    }
  }

  renderExpert() {
    fetch(connection + '/api/userQueue/loadUser', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
      console.log("RESPONSE", response);
    }).then((users) => {
      if(!users){
        console.log("TROUBLE");
      }
      console.log("USERS IN QUEUE", users);
      usersToHelp = users;
      usersToCheck = Object.keys(usersToHelp);
      this.setState({currentUser: usersToHelp[usersToCheck[0]]});
    }).done()
  }

  render() {
    let button = null;
    if (this.getActive()) {
      button = <TouchableHighlight
            onPress={() => this.activeSwitcher()}
            style={styles.button}>
            <Text style={styles.buttonText}>Go Offline</Text>
          </TouchableHighlight>
    } else {
      button = <TouchableHighlight
            onPress={() => this.activeSwitcher()}
            style={styles.button}>
            <Text style={styles.buttonText}>Go Online</Text>
          </TouchableHighlight>
    }
    return (
       <View style={styles.mainContainer}>
        <Tabs selected={this.state.page}
         style={{backgroundColor:'grey'}}
         selectedStyle={{color:'blue'}}
         onSelect={el=>this.setState({ page: el.props.name })}>

          <Text
            name="Home"
            user={this.props.user}
            onPress={this.navigateTo.bind(this, "Home")}>
              Home
          </Text>

          <Text
            name="ByCategory"
            user={this.props.user}
            onPress={this.navigateTo.bind(this, "ByCategory", this.props.user)}>
              By Category
          </Text>

          <Text
            name="TopExperts"
            user={this.props.user}
            onPress={this.navigateTo.bind(this, "TopExperts")}>
              Top Experts
          </Text>

          <Text
            name="Wishlist"
            user={this.props.user}
            onPress={this.navigateTo.bind(this, "Wishlist")}>
              Wishlist
          </Text>

        </Tabs>
         <SearchView style={styles.searchInput} navigator={this.props.user.navigator} user={this.props.user}/>
          {this.props.user.shopperExpert && button}
          {this.getActive() &&
          <View>
            {this.state.currentUser && <View><Text>{"USER: " + this.state.currentUser.username}</Text>
              <Text>{"CATEGORY: " + this.state.currentUser.category}</Text></View>
            }
            <TouchableHighlight
            style={styles.button}
            onPress={() => this.navigateTo('Chat', this.props.user, this.state.currentUser)}>
              <Text style={styles.buttonText}>b</Text>
            </TouchableHighlight>
            <TouchableHighlight
            style={styles.button}
            onPress={() => this.showNext()}>
              <Text style={styles.buttonText}>p</Text>
            </TouchableHighlight>
          </View>
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 30,
        marginTop: 65,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#48BBEC'
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
        fontSize: 14,
        color: '#111',
        alignSelf: 'center'
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});