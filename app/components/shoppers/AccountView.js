import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  AlertIOS,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Button, CheckBox } from 'react-native-elements'

const heroku = 'https://savvyshopper.herokuapp.com';
const herokuTest = 'https://murmuring-sierra-59020.herokuapp.com';
const local = 'http://localhost:2300';

export default class AccountView extends Component {

  constructor(props) {
    console.log("ACCOUNT PROPS", props);
    super(props);

    this.state = {
      homeChecked: false,
      techChecked: false,
      foodChecked: false,
      womensChecked: false,
      mensChecked: false,
      entertainmentChecked: false
    };
  }

  makeExpert() {
    fetch(herokuTest+'/api/users/' + this.props.user.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        attributes: {
          shopperExpert: true
        }
      })
    })
    .then((response) => {
      if (response.status === 201) {
        this.navigate('Shopper', this.props.user.id, this.props.user.username, this.props.user.averageRating, true, this.props.user.active, this.props.user.closedChatSessions, this.props.user.userPreferences);
      } else {
        AlertIOS.alert(
          'Account could not be updated.'
        )
      }
    })
    .done();
  }

  navigate(scene, id, username, averageRating, shopperExpert, active, closedChatSessions, userPreferences) {
    if (id) {
      this.props.navigator.push({
        screen: scene,
        passProps: {
          id: id,
          username: username,
          averageRating: averageRating,
          shopperExpert: shopperExpert,
          active: active,
          closedChatSessions: closedChatSessions,
          userPreferences: userPreferences
        }
      });
    } else {
      this.props.navigator.push({
        screen: scene
      });
    }
  }

  render() {
    let button = null;
    if(this.props.getActive()){
      button = <TouchableHighlight
            onPress={() => this.props.activeSwitcher()}
            style={styles.button}>
            <Text style={styles.buttonText}>Go Offline</Text>
          </TouchableHighlight>
    } else {
      button = <TouchableHighlight
            onPress={() => this.props.activeSwitcher()}
            style={styles.button}>
            <Text style={styles.buttonText}>Go Online</Text>
          </TouchableHighlight>
    }
    return (
      <View>
        <Text style={styles.title}>PREFERENCES</Text>

        <CheckBox
          center
          title='Home'
          checked={this.state.homeChecked}
        />

        <CheckBox
          center
          title='Food'
          checked={this.state.foodChecked}
        />

        <CheckBox
          center
          title='Tech'
          checked={this.state.techChecked}
        />

        <CheckBox
          center
          title="Womens Fashion"
          checked={this.state.womensChecked}
        />

        <CheckBox
          center
          title="Mens Fashion"
          checked={this.state.mensChecked}
        />

        <CheckBox
          center
          title="Entertainment"
          checked={this.state.entertainmentChecked}
        />

        {
        !this.props.user.shopperExpert &&
          <Button
          raised
          icon={{name: 'cached'}}
          title='Become an Expert'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 1}}
          onPress={() => this.makeExpert()}
           />
        }
        {this.props.user.shopperExpert &&
          button
        }
        {
         //  <Button
         //  raised
         //  icon={{name: 'cached'}}
         //  title='Log Out'
         //  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 1}}
         //  onPress={() => this.navigate('Login')}
         // />
       }
      </View>
    )
  }
}
var styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    color: 'grey',
    top: 10,
    marginBottom: 10
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'center'
  }
});