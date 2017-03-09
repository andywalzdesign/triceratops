import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import StarRating from 'react-native-star-rating';

let connection = require('../../Utils/connection');

export default class RatingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  sendRating(rating, userId, expertId) {
    console.log('userId', userId, 'expertId', expertId, 'rating', rating);
    fetch(connection + '/api/ratings/rate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userRating: rating,
        senderId: userId,
        receiverId: expertId
      })
    })
    .then((response) => {
      console.log(response);
    })
    .done();
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.props.modalVisible}
          >
            {!this.props.user.shopperExpert && <Text style={styles.title}>Rate your Expert!</Text>}
            {this.props.user.shopperExpert && <Text style={styles.title}>Rate the User!</Text>}
            <Image style={{width: 50, height: 100}} source={{uri: this.props.partner}}/>
            {console.log('user props', this.props)}

            <StarRating
              disabled={false}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
            />

            <Button
            raised
            backgroundColor='#48BBEC'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10, marginTop: 10}}
            title="Submit Rating"
            onPress={() => {
              this.props.closeModal()
              this.sendRating(this.state.starCount, this.props.userId, this.props.expertId)
            }}>
            </Button>
        </Modal>
      </View>
    );
  }
}

styles = StyleSheet.create({
  title: {
    fontSize: 23,
    paddingLeft: 10,
    paddingTop: 5,
    margin: 20,
    textAlign: 'center'
  },
  container: {
  flex: 1,
   height: null,
   width: null,
 }
})