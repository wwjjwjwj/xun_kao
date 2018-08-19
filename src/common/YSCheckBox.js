/*
 * @flow
 * @providesModule YSCheckBox
 */

import React, { Component } from 'react';
import { View, Colors, Image, Spacings } from 'react-native-ui-lib';
import { ListView, StyleSheet, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';

//var Icon=require('react-native-vector-icons/FontAwesome');
import Icon from 'react-native-vector-icons/FontAwesome';

export default class YSCheckBox extends React.Component{
   static defaultProps = {
      checked: false
   };
  /*static propTypes={
     checked: React.PropTypes.bool,
     onChange: React.PropTypes.func
  };*/
  constructor(props){
     super(props);
     this.state = {
        checked: props.checked,
     };
  }
  componentWillReceiveProps(nextProps) {
      this.setState({
        checked: nextProps.checked
      });
  }
  onChange() {
     this.setState({checked:!this.state.checked});
  }
  toggle(){
    var is_checked = !this.state.checked;
     this.setState({checked: is_checked});
     this.props.onChange(is_checked);
  }
  render() {
    var source = "square-o";
    if(this.state.checked){
      source = "check-square-o";
    }
    var container = (
      <View style={styles.container}>
        <Icon name={source} size={30} style={styles.checkbox} color="#00B4F7" ></Icon>
      </View>
    );
    return (
      <TouchableHighlight ref="checkbox" onPress={this.toggle.bind(this)} underlayColor='white'>
        {container}
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    checkbox: {

    }

});
