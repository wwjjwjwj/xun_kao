/*
@flow
@providesModule YSEditInputText
通用文本框
*/

'use strict';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import YSWHs from './YSWHs';
import YSColors from 'YSColors';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { TextInput, Button, ThemeManager, TextArea } from 'react-native-ui-lib';
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'

class YSEditInputText extends React.Component {
  props: Props;
  state = {
    title: String,
    inputText: String,
    type: String
  };
  static navigationOptions = ({ navigation }) => {
    return {
      title: YSI18n.get('编辑') + navigation.state.params.title,
      headerRight: (
        <Button label={YSI18n.get('保存')} link marginR-s4 onPress={() => this.save()} />
      ),
    }
  }
  constructor(props: Props) {
    super(props);
    this.getTextInputValidator = getTextInputValidator.bind(this);
    this.state = {
      title: props.navigation.state.params.title || YSI18n.get('编辑'),
      value: props.navigation.state.params.value || '',
      type: props.navigation.state.params.type || '',
    }
  };

  render() {

    const passwordValidator = this.getTextInputValidator('password', false, (text) => {
      return (text.length >= 6);//最少6位密码
    })
    const mobileValidator = this.getTextInputValidator('mobile', false, (text) => {
      return (text.length >= 11);//最少11位数字
    })

    let block_content = <View />
    switch (this.state.type) {
      case 'password':
        block_content = <TextInput
          {...passwordValidator}
          floatingPlaceholder
          placeholder={this.state.title}
          helperText={YSI18n.get('请输入') + this.state.title}
          value={this.state.value}
          secureTextEntry
          numberOfLines={1}
        />
        break;
      case 'phone':
        block_content = <TextInput
          {...mobileValidator}
          floatingPlaceholder
          placeholder={this.state.title}
          helperText={YSI18n.get('请输入') + this.state.title}
          value={this.state.value}
          numberOfLines={1}
        />
        break;
      case 'textarea':
        block_content = <TextArea text70 placeholder={YSI18n.get('请输入') + this.state.title} />
        break;
      default:
        block_content = <TextInput
          floatingPlaceholder
          placeholder={this.state.title}
          helperText={YSI18n.get('请输入') + this.state.title}
          value={this.state.value}
          numberOfLines={1}
        />
        break;
    }
    return (
      <View style={styles.container}>
        {block_content}
      </View>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: YSColors.whiteBackground,
    paddingHorizontal: 14,
    paddingTop: 10
  },
  border: {
    borderWidth: 1,
    borderColor: ThemeManager.dividerColor,
    paddingLeft: 8
  },

})

module.exports = YSEditInputText;
