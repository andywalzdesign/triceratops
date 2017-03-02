import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { Button } from 'react-native-elements';
import StarRating from 'react-native-star-rating';

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
    fetch('http://localhost:2300/api/ratings/rate', {
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

         <View style={{marginTop: 22}}>
          <View>

            <Text>Rate your Expert!</Text>

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

          </View>
         </View>
        </Modal>
      </View>
    );
  }
}