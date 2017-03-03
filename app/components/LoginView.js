import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  AlertIOS,
} from 'react-native';

import { FormLabel, FormInput, Button } from 'react-native-elements';

var STORAGE_KEY = 'id_token';

const heroku = 'https://savvyshopper.herokuapp.com';
const herokuTest = 'https://murmuring-sierra-59020.herokuapp.com';
const local = 'http://localhost:2300';

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasAccount: true,
      username: '',
      password: ''
    };
  }

  async onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  navigate(scene, id, username, averageRating, shopperExpert, active, closedChatSessions, userPreferences) {
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
    })
  }

  userLogin() {
    var username = this.state.username;
    var password = this.state.password;
    if (!this.state.username || !this.state.password) {
      AlertIOS.alert(
        'Missing Username or Password.'
      )
    } else {
      fetch(herokuTest+"/api/users/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData) {
          AlertIOS.alert(
            'Incorrect Username or Password.'
          )
        } else {
          //this.onValueChange(STORAGE_KEY, responseData.id_token);
          this.navigate('Home', responseData.id, responseData.username, responseData.averageRating, responseData.shopperExpert, responseData.active, responseData.closedChatSessions, responseData.userPreferences);
        }
      })
      .done();
    }
  }

  userSignup() {
    var username = this.state.username;
    var password = this.state.password;
    if (!this.state.username || !this.state.password) {
      AlertIOS.alert(
        'Missing Username or Password.'
      )
    } else {
      fetch(herokuTest+"/api/users", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData) {
          AlertIOS.alert(
            'User already exists!'
          )
        } else {
          // this.onValueChange(STORAGE_KEY, responseData.id_token)
          this.navigate('Home', responseData.id, responseData.username, responseData.averageRating, responseData.shopperExpert, responseData.active, responseData.closedChatSessions, responseData.userPreferences);
        }
      })
      .done();
    }
  }


  render() {
    if (this.state.hasAccount) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            Sign In
          </Text>
          <View>
            <FormInput
              placeholder="username"
              onChangeText={(text) => this.setState({username: text})}
              style={styles.formInput}
            />
            <FormInput
              placeholder="password"
              secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              style={styles.formInput}
            />
            <Button
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10}}
              backgroundColor='#48BBEC'
              onPress={(this.userLogin.bind(this))}
              raised
              title='Login'
            />
          </View>
          <View>
            <Button
              onPress={(this.userLogin.bind(this))}
              onPress={() => this.setState({hasAccount: false})}
              raised
              title='Join!'
              backgroundColor='#48BBEC'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10}}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            Become a Savvy Shopper!
          </Text>
          <View>
            <FormInput
              placeholder="username"
              onChangeText={(text) => this.setState({username: text})}
              style={styles.formInput}
            />
            <FormInput
              placeholder="password"
              secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              style={styles.formInput}
            />
            <Button
              onPress={(this.userSignup.bind(this))}
              style={styles.button}
              raised
              backgroundColor='#48BBEC'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10 }}
              title='Create Account'
            />
          </View>
          <View>
            <Button
              onPress={() => this.setState({hasAccount: true})}
              raised
              backgroundColor='#48BBEC'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10}}
              title='Login!'
            />
          </View>
        </View>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch",
    marginBottom: 5
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  text: {
    alignSelf: 'center'
  },
  formInput: {
    height: 36,
    padding: 10,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});