/**
 * Created by Administrator on 4/14/2017.
 * @providesModule Setting
 * @flow
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  Platform,
  Alert,
  NativeModules,
  ScrollView,
  NativeAppEventEmitter,
  Linking
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { Toast, List, WingBlank, WhiteSpace, DatePicker } from 'antd-mobile-rn';
import { Constants, Modal, View, Text, Typography, BorderRadiuses, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings, Picker } from 'react-native-ui-lib';
import YSI18n from 'YSI18n';
import { ListStyle, CustomLoginListStyle } from '../common/ComponetStyle'
import { district, provinceLite } from './data/index';
import { logout, chooseLanguage } from '../actions/user';
//支持的多语言包
import LocaleContext from '../locale/index';
import Util from 'Util';
const Item = List.Item;
const Brief = Item.Brief;

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  //退出登录事件
  onLogout = () => {
    let that = this;
    let title = YSI18n.get('Tip');
    let body = YSI18n.get('logout_tip');
    let cancel = YSI18n.get('Cancel');
    let ok = YSI18n.get('OK');

    Alert.alert(title, body,
      [
        {
          text: cancel, onPress: () => {
            console.log('Cancel Pressed!')
          }
        },
        {
          text: ok, onPress: () => {
            that.props.logout();
          }
        },
      ],
      { cancelable: false }
    )
  };
  //切换多语言
  onSwitchLocale = (option) => {
    Toast.loading(YSI18n.get('Loading'), 3, () => {
      this.props.chooseLanguage(option.value);
    })
  }
  render() {
    let block_button_exit = <Button
      backgroundColor={YSColors.whiteBackground}
      size='large'
      text60
      marginB-s4
      dark10
      style={styles.button_wrap}
      borderRadius={0}
      label={YSI18n.get('logout')}
      onPress={this.onLogout} />

    let block_content = <View flex>
      <WhiteSpace size='lg' />
      <List>
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => { this.props.navigation.navigate('editInputText', { title: YSI18n.get('手机号'), value: this.state.phone, type: 'phone' }) }}
        >
          {YSI18n.get('手机号')}
        </Item>
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => { this.props.navigation.navigate('editInputText', { title: YSI18n.get('登录密码'), value: this.state.feedback, type: 'password' }) }}
        >
          {YSI18n.get('修改登录密码')}
        </Item>
      </List>
      <WhiteSpace size='lg' style={styles.border} />
      <List>
        <Item
          extra={YSI18n.get(`Languages_${this.props.locale}`)}
          arrow="horizontal"
          multipleLine
          onClick={() => { this.languagePicker.handlePickerOnPress() }}
        >
          <Picker
            ref={(languagePicker) => {
              this.languagePicker = languagePicker;
            }}
            placeholder={YSI18n.get('Languages')}
            value={{ label: YSI18n.get('Languages'), value: this.props.locale }}
            enableModalBlur={false}
            onChange={this.onSwitchLocale}
            topBarProps={{ title: YSI18n.get('Languages') }}
            hideUnderline
          >
            {LocaleContext.supportLocales
              .map((item) => { return { label: YSI18n.get(`Languages_${item.locale}`), value: item.locale, disabled: false } })
              .map((option) => <Picker.Item key={option.value} value={option} disabled={option.disabled} />)}
          </Picker>

        </Item>
      </List>
      <WhiteSpace size='lg' style={styles.border} />
      <List>
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => { this.props.navigation.navigate('editInputText', { title: YSI18n.get('意见反馈'), value: this.state.value, type: 'textarea' }) }}
        >
          {YSI18n.get('意见反馈')}
        </Item>
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => { this.props.navigation.navigate('editInputText') }}
        >
          {YSI18n.get('关于我们')}
        </Item>
      </List>
      <WhiteSpace size='lg' style={styles.border} />
      <WhiteSpace size='lg' />
    </View>

    return <View style={styles.container}>
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {block_content}
        {block_button_exit}
      </ScrollView>
    </View>
  };
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: YSColors.default_bjcolor,
  },
  img_thumb: {
    borderRadius: 4,
    resizeMode: 'cover',

  },
  block_navigator: {
    paddingTop: Constants.isIphoneX ? 29 : 0,
    height: Constants.isIphoneX ? 81 : 56,
    borderBottomWidth: 1,
    borderColor: Colors.dark70,
    backgroundColor: Colors.white
  },
  list_body: {
    backgroundColor: YSColors.whiteBackground,
    paddingLeft: 16,
    paddingRight: 5,
    height: 70
  },
  border: {
    borderTopWidth: 1,
    borderColor: ThemeManager.dividerColor,
  },
  button_wrap: {
    color: '#111',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: ThemeManager.dividerColor,
  }

})

function select(store) {
  return {
    userInfo: store.user.userInfo,
    lastedAppVersion: store.user.lastedAppVersion,
    locale: store.user.locale || global.locale,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators(logout, dispatch),
    chooseLanguage: bindActionCreators(chooseLanguage, dispatch),
  };
}
module.exports = connect(select, mapDispatchToProps)(Setting);