import React, { Component } from 'react';
import {
StyleSheet,
View,
Image,
Text,
} from 'react-native';
import AccountView from './shoppers/AccountView';
const userImage = require('../assets/imgs/user-profile.png');
const ratingIcon = require('../assets/imgs/plain-heart.png');
const chatHistoryIcon = require('../assets/imgs/chat.png');

export default class ProfileView extends Component {
constructor(props) {

  super(props);

  this.state = {
    username: 'triceratops2@gmail.com',
    shopperExpert: true,
    averageRating: '4.5',
    favorites: '5',
    chatHistory: '10',
    isActive: false
  };

}

 renderStat(options) {
    return (
    <View style={styles.stat}>
     <Image
       source={options.icon}
       style={[styles.icon, options.selected ?
       styles.selected : null]}
     />
        <Text style={styles.counter}>{options.value}</Text>
      </View>
     );
  }

  activeSwitcher() {
    this.setState({isActive: !this.state.isActive});
  }

  getActive() {
    return this.state.isActive;
  }

render() {

return (

    <View style={styles.container}>

     <AccountView navigator={this.props.navigator} user={this.props} activeSwitcher={this.activeSwitcher.bind(this)} getActive={this.getActive.bind(this)} />

      <View style={styles.personal}>
        <Text style={styles.name}>
          {this.state.username.substring(0, this.state.username.indexOf('@'))}
        </Text>
        <Text style={styles.occupation}>
            {this.state.shopperExpert ? "Expert" : "User"}
        </Text>
      </View>

        <View style={styles.stats}>
            {this.renderStat({ icon: ratingIcon, value: this.state.averageRating })}
            {this.renderStat({ icon: chatHistoryIcon, value: this.state.chatHistory })}
            {this.renderStat({ icon: chatHistoryIcon, value: this.state.chatHistory })}
            {this.renderStat({ icon: chatHistoryIcon, value: this.state.chatHistory })}
            {this.renderStat({ icon: chatHistoryIcon, value: this.state.chatHistory })}
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#FFFFFF',
    ...StyleSheet.absoluteFillObject,
    top: null
 },
personal: {
 padding: 30,
 backgroundColor: 'rgba(0,0,0,0.5)',
 alignSelf: 'stretch',
},
name: {
 color: '#fff',
 fontFamily: 'Helvetica',
 fontSize: 30,
 fontWeight: 'bold',
},
occupation: {
 color: '#d6ec1b',
 marginTop: 5,
},
 selected: {
 tintColor: '#d6ec1b',
},
icon: {
 tintColor: '#504f9f',
 height: 30,
 width: 30,
},
counter: {
 color: '#fff',
 fontSize: 15,
 marginTop: 5,
},
stats: {
  flexDirection: 'row',
},
stat: {
  alignItems: 'center',
  backgroundColor: '#48BBEC',
  borderColor: '#6e6db1',
  borderLeftWidth: 1,
  flex: 1,
  padding: 10,
}
});