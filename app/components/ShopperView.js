import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
import CategoryView from './shoppers/CategoryView';
import ChatHistoryView from './shoppers/ChatHistoryView';
import AccountView from './shoppers/AccountView';

export default class ShopperView extends Component {

  constructor(props) {
    console.log("PROPS", props);
    super(props);
    this.state = {
      isActive: false
    };
  }

  activeSwitcher() {
    this.setState({isActive: !this.state.isActive});
  }

  getActive() {
    return this.state.isActive;
  }

  render() {
    if (this.props.shopperExpert && this.getActive()) {
      return (
        <Swiper style={styles.wrapper} loop={false} showsButtons={true}>
          <View style={styles.slide2}>
            <ChatHistoryView navigator={this.props.navigator} user={this.props} getActive={this.getActive.bind(this)} />
          </View>
          <View style={styles.slide3}>
            <AccountView navigator={this.props.navigator} user={this.props} activeSwitcher={this.activeSwitcher.bind(this)} getActive={this.getActive.bind(this)} />
          </View>
        </Swiper>
      )
    } else {
      return (
        <Swiper style={styles.wrapper} loop={false} showsButtons={true}>
          <View style={styles.slide1}>
            <CategoryView navigator={this.props.navigator} user={this.props} />
          </View>
          <View style={styles.slide2}>
            <ChatHistoryView navigator={this.props.navigator} user={this.props} getActive={this.getActive.bind(this)} />
          </View>
          <View style={styles.slide3}>
            <AccountView navigator={this.props.navigator} user={this.props} activeSwitcher={this.activeSwitcher.bind(this)} getActive={this.getActive.bind(this)} />
          </View>
        </Swiper>
      )
    }
  }
}

var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});