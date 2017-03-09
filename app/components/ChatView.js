import React, { Component } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  AlertIOS,
  CameraRoll,
  Modal,
  Image,
} from 'react-native';
import io from 'socket.io-client';
import RatingView from './shoppers/RatingView';
import {
  Button,
  FormLabel,
  FormInput,
  SearchBar,
} from 'react-native-elements';
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import CustomActions from '../Utils/CustomActions';

let connection = require('../Utils/connection');

// GIFTED CHAT MESSAGE OBJECT FORMAT
// {
//   _id: 1,
//   text: 'My message',
//   createdAt: new Date(),
//   user: {
//     _id: 2,
//     name: 'React Native',
//     avatar: 'https://facebook.github.io/react/img/logo_og.png',
//   },
//   chatSessionID: 'asjdfjsgeragj',
// }

// FOR DEMO PURPOSES
// let texts = [
//       'Cool, I\'ve got the perfect pair!',
//       'The Bose QuietComfort 35 will change your life.',
//       'Your welcome, have a great afternoon!'];

export default class ChatView extends Component {
  constructor(props) {
    console.log('ChatView Props:', props);
    super(props);
    this.state = {
      messages: [],
      modalVisible: false,
      itemVisible: false,
      connectionStatus: null
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.navigate = this.navigate.bind(this);
    this.item = null; // Currently selected item in chat (recommendation)

    this.wish = {
      image: null,
      title: null,
      price: null,
      comment: null,
      expert: null
    };

    // MERGED FROM OLD CHAT CODE
    this.chatSession = {
      _id: null,
      socket: null,
      room: null,
      chatPartner: null,
      category: null,
      username: null,
      partnerPhoto: null
    };
  }

  setModalVisible() {
    this.setState({modalVisible: true});
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  componentWillMount() {
    let self = this;
    this._isMounted = true;


    // MERGED FROM OLD CHAT CODE
    this.chatSession.socket = io(connection, {jsonp: false});

    self.chatSession.socket.on('rate', () => {
      console.log("Rate view triggered");
      this.navigate(this.props.user);
      this.setModalVisible();
    });

    // IF USER IS NOT AN EXPERT
    if(!this.props.user.shopperExpert){
      self.setState((previousState) => {
        return {
          connectionStatus: 'Finding your expert...'
        };
      });

      self.chatSession.category = this.props.category;
      self.chatSession.username = this.props.user.username;
      self.chatSession.socket.on('id', (socketId) => {
        self.chatSession.socket.emit('createRoom', socketId, self.props.user.id, this.props.category, this.props.user.username, this.props.user.profileImage);
        self.chatSession._id = socketId; // Redundant - room is same as _id
        self.chatSession.room = socketId;
        console.log('*** NEW ROOM ***', socketId);
        console.log('chatSession:', self.chatSession);

        // SEND SESSION ID TO USER'S CLOSED CHAT SESSIONS ARRAY
        self.props.user.closedChatSessions.push(self.chatSession._id);
        console.log('New Chat Sessions:', self.props.user.closedChatSessions);

        // PUT REQUEST TO DATABASE WITH NEW closedChatSessions ARRAY
        fetch(connection + '/api/users/' + self.props.user.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            attributes: {
              closedChatSessions: self.props.user.closedChatSessions
            }
          })
        })
        .then((response) => {
          console.log(response);
        })
        .done();
      });

      self.chatSession.socket.on('expert', (expertId, expertUsername, expertImage) => {
        self.chatSession.chatPartner = expertId;
        self.chatSession.partnerPhoto = expertImage;
        console.log('ExpertId Recieved:', expertId, expertUsername, expertImage);
        self.setState((previousState) => {
          return {
            connectionStatus: 'Connected with Expert ' + expertUsername
          };
        });
      });

      self.chatSession.socket.on('message', (message) => {
        console.log('Incoming Message:', message);
        // CALL onRECIEVE METHOD
        self.onReceive(message); // message = MESSAGE OBJECT
      });
    }

    // IF USER IS AN EXPERT
    if(this.props.user.shopperExpert){
      console.log('UserId Recieved:', this.props.chatPartner);
      self.chatSession.chatPartner = this.props.chatPartner.id;
      self.chatSession.partnerPhoto = this.props.chatPartner.profileImage;
      self.chatSession.username = this.props.user.username;
      self.chatSession.category = this.props.category;
      console.log('*** JOINING ROOM ***', this.props.chatPartner.room);
      self.chatSession.socket.emit('joinRoom', this.props.chatPartner.room, self.props.user.id, this.props.user.username, this.props.user.profileImage);
      self.chatSession._id = this.props.chatPartner.room;
      self.chatSession.room = this.props.chatPartner.room;
      console.log('chatSession:', self.chatSession);

      // SEND SESSION ID TO USER'S CLOSED CHAT SESSIONS ARRAY
      self.props.user.closedChatSessions.push(self.chatSession._id);
      console.log('New Chat Sessions:', self.props.user.closedChatSessions);

      // PUT REQUEST TO DATABASE WITH NEW closedChatSessions ARRAY
      fetch(connection + '/api/users/' + self.props.user.id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attributes: {
            closedChatSessions: self.props.user.closedChatSessions
          }
        })
      })
      .then((response) => {
        console.log(response);
      })
      .done();

      self.chatSession.socket.on('message', (message) => {
        console.log('Incoming Message:', message);
        // CALL onRECIEVE METHOD
        self.onReceive(message); // message = MESSAGE OBJECT
      });
    }
  }

  onSend(messages = []) {
    let self = this;
    let message = messages[0];

    // Add chatSessionID to message
    message.chatSessionID = this.chatSession._id;
    console.log('onSend:', message);

    // EMIT MESSAGE TO CHAT PARTNER
    this.chatSession.socket.emit('message', message, self.chatSession.room);

    // POST MESSAGE TO DB
    // fetch(connection + '/api/chat/messages', {
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

    // EMIT A DISCONNECT EVENT TO TRIGGER A RATING VIEW ON EXPERT
    this.chatSession.socket.emit('showRate', this.chatSession.room);

    // REMOVE FIRST TWO ITEMS IN ARRAY (Connection Verification)
    let messages = this.state.messages;
    messages.shift();
    messages.shift();

    fetch(connection + '/api/chat/messages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({messages})
    })
    .then((response) => {
      console.log(response);
    })
    .done();

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, [messages]),
      };
    });

    // this.setState((previousState) => {
    //   return {
    //     messages: GiftedChat.append(previousState.messages, [message]),
    //   };
    // });

    // FOR DEMO PURPOSES
    // this.answerDemo(messages);
    console.log('All Messages:', this.state.messages);

    this.navigate(this.props.user);
  }

  navigate(props) {
    this.props.navigator.push({
      screen: 'Home',
      passProps: {
        user: this.props.user
      }
    });
    this.setModalVisible();
  }

  onReceive(message) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, message)
      };
    });
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Embed Image': (props) => {
        alert('option 1');
      },
      'Choose from Library': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
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
    if (this.state.connectionStatus) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.connectionStatus}
          </Text>
        </View>
      );
    }
    return null;
  }

  onPressImage(message) {
    // OPEN ITEM MODAL // ADD TO WISHLIST // PURCHASE // CANCEL
    this.item = message;
    console.log('Current Item:', this.item);
    this.wish.image = message.image;
    this.wish.title = message.previousMessage.text;
    this.wish.price = message.nextMessage.text;
    this.wish.expert = this.chatSession.chatPartner || 0; // 0 for testing
    console.log('Current Wish:', this.wish);
    this.setState({itemVisible: true});
  }

  addToWishlist(wish) {
    wish.comment = '';
    if (!wish.title || !wish.price) {
      AlertIOS.alert('Please add item title and price.');
      return;
    } else {
      wish.userId = this.props.user.id;
      console.log('Sending Wish:', wish);
      // ADD WISH TO DATABASE
      fetch(connection + '/api/wishlist', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: wish
        })
      })
      .then((response) => response.json())
      .then((wish) => {
        console.log('Item saved.');
      })
      .done();
      this.item = null;
      this.setState({itemVisible: false});
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}

          user={{
            _id: this.props.user.id, // sent messages should have same user._id
            name: this.props.user.username, // add optional avatar
          }}

          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderFooter={this.renderFooter}
          onPressImage={this.onPressImage.bind(this)}
        />
        {!this.props.user.shopperExpert &&
        <Button
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10 }}
          style={styles.button}
          onPress={() => this.disconnect()}
          raised title='Rate Expert' />
        }

        <View><RatingView user={this.props.user} userId={this.state.userId} expertId={this.state.expertId} modalVisible={this.state.modalVisible} closeModal={this.closeModal.bind(this)} partner={this.chatSession.partnerPhoto} /></View>

        {this.item &&
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.itemVisible}
            >
            <View style={styles.mainContainer}>
              <Image source={{uri: this.item.image}}
                style={{width: 250, height: 250, marginLeft: 30, marginTop: 10}} />

              <View style={{justifyContent: 'center', marginTop: 5}}>
                <Text style={{marginBottom: -10}}>Item</Text>
                <TextInput
                  style={styles.searchInput}
                  onChangeText={(text) => {this.wish.title = text}}
                  placeholder={this.wish.title || 'product name'}
                  placeholderTextColor={'black'}
                />
              </View>

              <View style={{justifyContent: 'center', marginTop: 5}}>
                <Text style={{marginBottom: -10}}>Price</Text>
                <TextInput
                  style={styles.searchInput}
                  onChangeText={(text) => {this.wish.price = text}}
                  placeholder={this.wish.price || 'product price'}
                  placeholderTextColor={'black'}
                />
              </View>

              <View style={{justifyContent: 'center', marginTop: 5}}>
                <Text style={{marginBottom: -10}}>Notes</Text>
                <TextInput
                  style={styles.searchInput}
                  onChangeText={(text) => {this.wish.comment = text}}
                  placeholder={this.wish.comment || 'note to self'}
                />
              </View>

              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10 }}
                style={styles.button}
                onPress={() => {this.addToWishlist(this.wish)}}
                raised title='Add to Wishlist' />
              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10 }}
                style={styles.button}
                onPress={() => {AlertIOS.alert('Item Purchased.');}}
                raised title='Purchase' />
              <Button
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10 }}
                style={styles.button}
                onPress={() => {
                  this.setState({itemVisible: false});
                  this.item = null;
                }}
                raised title='Back' />
            </View>
          </Modal>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center'
  },
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
  },
  name: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 28,
    textAlign: 'center',
    color: 'black'
  },
  price: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray'
  },
  bio: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
    marginTop: 10,
    marginBottom: 20
  },
  searchInput: {
    height: 40,
    padding: 10,
    fontSize: 18,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    marginBottom: 5,
    marginTop: 10
  },
});