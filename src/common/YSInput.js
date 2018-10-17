/*
@flow
@providesModule YSInput
通用文本框
*/

'use strict';

import {
  View,
  //Text,
  Image,
  TextInput,
  //StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import React from 'react';
import { Assets, Text } from 'react-native-ui-lib';

import YSWHs from './YSWHs';
import YSColors from 'YSColors';
import YSFontSizes from 'YSFontSizes';
const StyleSheet = require('../common/YSStyleSheet');

export type Props = {
  icon?: number;
  placeholder: string;
  style?: any;
  borderStyle?: any;
  ispassword: Boolean;
  //autoFocus: Boolean;
  value?: string;
  enableClear: Boolean;
  enableEye: Boolean;
  onChangeText: () => mixed;
}

class YSInput extends React.Component {
  props: Props;
  state = {
    text: String,
    ispassword: Boolean,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      text: '',
      ispassword: true,
      isHasBorder: props.isHasBorder == null ? true : props.isHasBorder,
    };
    (this: any).onFocus = this.onFocus.bind(this);
    (this: any).onBlur = this.onBlur.bind(this);
    (this: any).onClear = this.onClear.bind(this);
  };
  shouldComponentUpdate(nextProps){
    //此方法为了解决，输入框不能输入中文的问题
    return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
           (nextProps.defaultValue == undefined || nextProps.defaultValue == '' )) ||
           (this.props.defaultValue === nextProps.defaultValue &&  (nextProps.value == undefined || nextProps.value == '' ));
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      if(nextProps.value){

      }
    }else if('enableClear' in nextProps){

    }
  }
  onFocus(){
    if(this.props.onFocus){
      this.props.onFocus();
    }
  }
  onBlur() {
    this.refs.text.blur();
    if(this.props.onBlur){
      this.props.onBlur();
    }
  }
  onClear() {
    if(this.refs.text){
      this.refs.text.clear();
    }
    if(this.props.onClear){
      this.props.onClear();
    }
  }
  toggleEye() {
    this.setState({ ispassword: !this.state.ispassword })
  }
  render() {
    let icon = null;
    let input;
    if (!!this.props.icon) {
      icon = <Image source={this.props.icon} style={[styles.icon, this.props.iconstyle]} resizeMode='contain' />
    }
    if (!!this.props.ispassword) {
      input = <View style={styles.block_wrap}>
        <TextInput
          ref="text"
          selectionColor={this.props.selectionColor || ''}
          style={[styles.text, this.props.style]}
          underlineColorAndroid='transparent'
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : '#999'}
          onChangeText={(text) => this.props.onChangeText(text)}
          value={this.props.value}
          secureTextEntry={this.state.ispassword}
          ispassword={this.state.ispassword}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {!!this.props.enableEye && <TouchableOpacity style={styles.block_touch_wrap} activeOpacity={1} onPress={() => this.toggleEye()}>
          <Image style={styles.img_eye} source={this.state.ispassword ? Assets.login.icon_eye_disable : Assets.login.icon_eye_enable} />
        </TouchableOpacity>}
      </View>

    } else {
      input = <View style={styles.block_wrap}>
        <TextInput
          ref="text"
          selectionColor={this.props.selectionColor || '#000000'}
          style={[styles.text, this.props.style]}
          underlineColorAndroid='transparent'
          placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : '#999999'}
          placeholder={this.props.placeholder}
          onChangeText={(text) => this.props.onChangeText(text)}
          value={this.props.value}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {!!this.props.enableClear &&
          <TouchableOpacity style={[styles.block_touch_wrap, this.props.clearStyle]} activeOpacity={1} onPress={() => this.onClear()}>
            <Image source={Assets.login.icon_del} />
          </TouchableOpacity>}
        {!!this.props.button &&
          <TouchableOpacity style={styles.btn} onPress={this.props.button.onPress}>
            <Text center font_14_20 gray2>{this.props.button.title}</Text>
          </TouchableOpacity>
        }
      </View>
    }
    return (
        <View centerV style={[styles.container, this.props.containerStyle ]}>
          {icon}{input}
        </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 16,
    height: 16,
    resizeMode:'contain',
    marginRight: 12
  },
  text: {
    flexGrow: 1,
    fontSize: YSFontSizes.normal,
  },
  block_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  block_touch_wrap: {
    flexDirection:'column',
    justifyContent:'center',
    ios: {
      marginRight: 36,
    },
    android: {
      marginRight: 20,
    }
  },
  btn: {
    height: 47,
    width: 110,
    borderRadius: 99,
    backgroundColor: '#D6D6D6',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

module.exports = YSInput;
