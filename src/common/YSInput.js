/*
@flow
@providesModule YSInput
通用文本框
*/

'use strict';

import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import YSWHs from './YSWHs';
import YSColors from 'YSColors';
import YSFontSizes from 'YSFontSizes';

const IMG_CLEAR = require('../login/img/reg_delete.png');
const IMG_EYE_OPEN = require('../login/img/reg_eye_open.png');
const IMG_EYE_CLOSE = require('../login/img/reg_eye_close.png');
export type Props = {
  icon?: number;
  placeholder: string;
  style?: any;
  borderStyle?: any;
  ispassword: Boolean;
  //autoFocus: Boolean;
  value?: string;
  enableClear: string;
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
    }
  };
  onBlur() {
    this.refs.text.blur();
  }
  clearValue() {
    this.refs.text.clear();
    this.props.doClearBack()
  }
  toggleEye() {
    this.setState({ ispassword: !this.state.ispassword })
  }
  render() {
    let icon;
    let input;
    if (this.props.icon) {
      icon = <Image source={this.props.icon} style={[styles.icon, this.props.iconstyle]} resizeMode='contain' />
    }
    if (this.props.ispassword) {
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
        />
        {this.props.enableEye && <TouchableOpacity style={styles.block_touch_wrap} activeOpacity={1} onPress={() => this.toggleEye()}><Image style={styles.img_eye} source={this.state.ispassword ? IMG_EYE_CLOSE : IMG_EYE_OPEN} /></TouchableOpacity>}
      </View>

    } else {
      input = <View style={styles.block_wrap}>
        <TextInput
          ref="text"
          selectionColor={this.props.selectionColor || ''}
          style={[styles.text, this.props.style]}
          // style={[ this.props.style]}
          underlineColorAndroid='transparent'
          placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : '#999'}
          placeholder={this.props.placeholder}
          onChangeText={(text) => this.props.onChangeText(text)}
          value={this.props.value}
        />
        {this.props.enableClear && <TouchableOpacity style={styles.block_touch_wrap} activeOpacity={1} onPress={() => this.clearValue()}><Image source={IMG_CLEAR} /></TouchableOpacity>}
      </View>
    }
    return (
        <View style={[styles.container, this.props.containerStyle ]}>
          {icon}{input}
        </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 47,
    width: 280,
  },

  icon: {
    width: YSWHs.icoInputTextWidth,
    resizeMode: 'contain',
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
    height: '100%',
    flexDirection:'column',
    justifyContent:'center'
  }
})

module.exports = YSInput;
