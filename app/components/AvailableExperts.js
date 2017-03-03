import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  NavigatorIOS,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS
} from 'react-native';


export default class AvailableExperts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('expert props', this.props);
    return (
      <View style={styles.container}>
        <Text>Available Experts</Text>
        <Text>{JSON.stringify(this.props.experts)}</Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1
  },
  image: {
    height: 350,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center'
  }
});


