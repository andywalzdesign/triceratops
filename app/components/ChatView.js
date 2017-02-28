import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import io from 'socket.io-client';

let socket = null;
let chatSession = {
  user: null,
  expertId: null,
  room: null,
  category: null
};

const heroku = 'https://savvyshopper.herokuapp.com';
const local = 'http://localhost:2300';

export default class ChatView extends Component {

  constructor(props) {
    // console.log("CHAT VIEW PROPS", props);
    super(props);
    this.state = {
      message: '',
      messages: []
    }
  }

  // automatically runs when component loads
  componentDidMount() {
    socket = io(heroku);

    if(!this.props.user.shopperExpert){

      //store information on chatSession
      chatSession.user = this.props.user;
      chatSession.category = this.props.category;

      console.log("USER IN CHAT", chatSession.user);

      socket.on('id', (socketId) => {
        chatSession.room = socketId;
        // socket.emit('createRoom', chatSession.room, chatSession.user, chatSession.category);
        socket.emit('createRoom', chatSession.room, chatSession.user.id, chatSession.user.username, chatSession.category);
        // console.log('*** NEW ROOM ***', socketId);
      });

      socket.on('expert', (expertId) => {
        chatSession.expertId = expertId;
        // console.log('ExpertId Recieved:', expertId);
      });

      socket.on('message', (message) => {
        // console.log('Incoming Message:', message);
        this.setState({
          messages: this.state.messages.concat([message])
        });
      });
    }
    if(this.props.user.shopperExpert){
      //needs to be fetched from the account prefs to see what categories this user is an expert in
      var categories = ['HOME'];
      var index = 0;
      fetch('http://localhost:2300/api/userQueue/getUser/' + categories[index], {
        method: 'GET',
        jsonp: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((user) => {
        if (!user) {
          AlertIOS.alert(
            'Incorrect Username or Password.'
          )
        } else {
          console.log('UserId Recieved:', user.id);
          chatSession.user = {id: user.id};
          chatSession.expertId = this.props.user.id;
          console.log('*** JOINING ROOM ***', user.room);
          socket.emit('joinRoom', user.room, chatSession.expertId);
          room = user.room;
          socket.on('message', (message) => {
            console.log('Incoming Message:', message);
            this.setState({
              messages: this.state.messages.concat([message])
            });
          });
        }
        if(index < categories.length){
          index++;
        } else {
          index = 0;
        }
      })
      .done();
    }

  }

  navigate() {
    this.props.navigator.push({
      screen: 'Shopper'
    });
  }

  //Disconnect only applies to client
  disconnect() {
    // post all messages in this.state.messages to DB

    // Send array of messages in this format:
    // {
    //   "chatSessionID": "abcdefgh",
    //   "senderID": 1,
    //   "receiverID": 3,
    //   "message": "Get dem beatz",
    //   "date": "2017-02-23T23:31:05.177Z"
    // }

    // REMOVE FIRST TWO ITEMS IN ARRAY (Connection Verification)
    let messages = this.state.messages;
    messages.shift();
    messages.shift();

    fetch(heroku + '/api/chat/messages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages
      })
    })
    .then((responseData) => {
      console.log(responseData);
      this.navigate();
    })
    .done();


    // reroute to ShopperView
  }

  sendMessage() {
    //Need to flip sender/reciever based on user/expert
    console.log('Sending Message.');
    let message = {
      chatSessionID: room,
      message: this.state.message,
      date: new Date()
    };
    if(this.props.user.shopperExpert){
      message.senderID = chatSession.expertId;
      message.receiverID = chatSession.user.id;
    } else {
      message.senderID = chatSession.user.id;
      message.receiverID = chatSession.expertId;
    };
    socket.emit('message', message, room);
    this.setState({message: ''});
    return false;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chat Session</Text>
        <View>
          {this.state.messages.map(function(msg) {
            return (
              <View key={msg.message}>
                <Text style={styles.text}>{msg.message}</Text>
              </View>
            )
          })}
        </View>
        <View>
          <TextInput
            placeholder="type message here"
            onChangeText={(text) => this.setState({message: text})}
            style={styles.formInput}
          />
          <TouchableHighlight
            onPress={(this.sendMessage.bind(this))}
            style={styles.button}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableHighlight>
          {!this.props.user.shopperExpert &&
            <TouchableHighlight
              onPress={(this.disconnect.bind(this))}
              style={styles.button}>
              <Text style={styles.buttonText}>Question Answered</Text>
            </TouchableHighlight>
          }
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
    container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch"
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