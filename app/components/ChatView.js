import React, { Component } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import io from 'socket.io-client';
import RatingView from './shoppers/RatingView';

let room = null;
let socket = null;
let chatSession = {
  user: null,
  expertId: null
};

const heroku = 'https://savvyshopper.herokuapp.com';
const local = 'http://localhost:2300';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';

// GIFTED CHAT MESSAGE OBJECT FORMAT

// {
//   _id: 1,
//   text: 'My message',
//   createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
//   user: {
//     _id: 2,
//     name: 'React Native',
//     avatar: 'https://facebook.github.io/react/img/logo_og.png',
//   },
//   image: 'https://facebook.github.io/react/img/logo_og.png',
//   // additional custom parameters
//   chatSession: 'asjdfjsgeragj',
// }

export default class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      modalVisible: false,
      userId: 3,
      expertId: 4
    };
  }

  setModalVisible() {
    this.setState({modalVisible: true});
  }

  closeModal() {
    this.setState({modalVisible: false});
  }


  // automatically runs when component loads
  componentDidMount() {
    socket = io(heroku);
    if(!this.props.user.shopperExpert, {jsonp: false}){
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: require('./data/messages.js'),
      };
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
      socket.on('id', (socketId) => {
        socket.emit('createRoom', socketId, chatSession.user.id);
        room = socketId;
         this.setState({
          userId: 3 //this 3 is hardcoded but would become the chatSession.user.id
        });
        console.log('*** NEW ROOM ***', socketId);
      });

      socket.on('expert', (expertId) => {
        chatSession.expertId = expertId;
        this.setState({
          expertId: 4 //this 4 is hardcoded but would become the expertId
        });
        console.log('ExpertId Recieved:', expertId);
      });
  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
    console.log('Messages Array:', this.state.messages);
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    // for demo purpose
    this.answerDemo(messages);
    console.log('Message Array:', this.state.messages);
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('You better shut your mouth!!');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 2000);
  }

  navigate() {
    this.props.navigator.push({
      screen: 'Home'
  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
    this.setModalVisible();
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}

          user={{
            _id: 1, // sent messages should have same user._id
          }}

          renderBubble={this.renderBubble}
          renderFooter={this.renderFooter}
        />
        {!this.props.user.shopperExpert &&
            <TouchableHighlight
              onPress={(this.disconnect.bind(this))}
              style={styles.button}>
              <Text style={styles.buttonText}>Question Answered</Text>
            </TouchableHighlight>
          }
          <View><RatingView user={this.props} userId={this.state.userId} expertId={this.state.expertId} modalVisible={this.state.modalVisible} closeModal={this.closeModal.bind(this)} /></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////// FUNCTIONING CHAT WITH SOCKETS ///////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

// export default class ChatView extends Component {

//   constructor(props) {
//     console.log("CHAT VIEW PROPS", props);
//     super(props);
//     this.state = {
//       message: '',
//       messages: []
//     }
//   }

//   // automatically runs when component loads
//   componentDidMount() {
//     socket = io(heroku);
//     if(!this.props.user.shopperExpert){

//       //store information on chatSession
//       chatSession.user = this.props.user;

//       socket.on('id', (socketId) => {
//         socket.emit('createRoom', socketId, chatSession.user.id);
//         room = socketId;
//         console.log('*** NEW ROOM ***', socketId);
//       });

//       socket.on('expert', (expertId) => {
//         chatSession.expertId = expertId;
//         console.log('ExpertId Recieved:', expertId);
//       });

//       socket.on('message', (message) => {
//         console.log('Incoming Message:', message);
//         this.setState({
//           messages: this.state.messages.concat([message])
//         });
//       });
//     }
//     if(this.props.user.shopperExpert){
//       fetch(heroku + '/api/userQueue/getUser', {
//         method: 'GET',
//         jsonp: false,
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         }
//       })
//       .then((response) => response.json())
//       .then((user) => {
//         if (!user) {
//           AlertIOS.alert(
//             'Incorrect Username or Password.'
//           )
//         } else {
//           console.log('UserId Recieved:', user.id);
//           chatSession.user = {id: user.id};
//           chatSession.expertId = this.props.user.id;
//           console.log('*** JOINING ROOM ***', user.room);
//           socket.emit('joinRoom', user.room, chatSession.expertId);
//           room = user.room;
//           socket.on('message', (message) => {
//             console.log('Incoming Message:', message);
//             this.setState({
//               messages: this.state.messages.concat([message])
//             });
//           });
//         }
//       })
//       .done();
//     }

//   }

//   navigate() {
//     this.props.navigator.push({
//       screen: 'Shopper'
//     });
//   }

//   //Disconnect only applies to client
//   disconnect() {
//     // post all messages in this.state.messages to DB

//     // Send array of messages in this format:
//     // {
//     //   "chatSessionID": "abcdefgh",
//     //   "senderID": 1,
//     //   "receiverID": 3,
//     //   "message": "Get dem beatz",
//     //   "date": "2017-02-23T23:31:05.177Z"
//     // }

//     // REMOVE FIRST TWO ITEMS IN ARRAY (Connection Verification)
//     let messages = this.state.messages;
//     messages.shift();
//     messages.shift();

//     fetch(heroku + '/api/chat/messages', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         messages: messages
//       })
//     })
//     .then((responseData) => {
//       console.log(responseData);
//       this.navigate();
//     })
//     .done();


//     // reroute to ShopperView
//   }

//   sendMessage() {
//     //Need to flip sender/reciever based on user/expert
//     console.log('Sending Message.');
//     let message = {
//       chatSessionID: room,
//       message: this.state.message,
//       date: new Date()
//     };
//     if(this.props.user.shopperExpert){
//       message.senderID = chatSession.expertId;
//       message.receiverID = chatSession.user.id;
//     } else {
//       message.senderID = chatSession.user.id;
//       message.receiverID = chatSession.expertId;
//     };
//     socket.emit('message', message, room);
//     this.setState({message: ''});
//     return false;
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Chat Session</Text>
//         <View>
//           {this.state.messages.map(function(msg) {
//             return (
//               <View key={msg.message}>
//                 <Text style={styles.text}>{msg.message}</Text>
//               </View>
//             )
//           })}
//         </View>
//         <View>
//           <TextInput
//             placeholder="type message here"
//             onChangeText={(text) => this.setState({message: text})}
//             style={styles.formInput}
//           />
//           <TouchableHighlight
//             onPress={(this.sendMessage.bind(this))}
//             style={styles.button}>
//             <Text style={styles.buttonText}>Send Message</Text>
//           </TouchableHighlight>
//           {!this.props.user.shopperExpert &&
//             <TouchableHighlight
//               onPress={(this.disconnect.bind(this))}
//               style={styles.button}>
//               <Text style={styles.buttonText}>Question Answered</Text>
//             </TouchableHighlight>
//           }
//         </View>
//       </View>
//     )
//   }
// }

// var styles = StyleSheet.create({
//     container: {
//     padding: 30,
//     marginTop: 65,
//     alignItems: "stretch"
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 10
//   },
//   text: {
//     alignSelf: 'center'
//   },
//   formInput: {
//     height: 36,
//     padding: 10,
//     marginRight: 5,
//     marginBottom: 5,
//     marginTop: 5,
//     fontSize: 18,
//     borderWidth: 1,
//     borderColor: "#555555",
//     borderRadius: 8,
//     color: "#555555"
//   },
//   buttonText: {
//     fontSize: 18,
//     color: 'white',
//     alignSelf: 'center'
//   },
//   button: {
//     height: 36,
//     backgroundColor: '#48BBEC',
//     borderColor: '#48BBEC',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 5,
//     marginBottom: 10,
//     alignSelf: 'stretch',
//     justifyContent: 'center'
//   },
// });