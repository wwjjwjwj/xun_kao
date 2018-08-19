/**
 * Created by Administrator on 4/14/2017.
 * @providesModule Home
 * @flow
 */

'use strict';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  NativeModules,
  NativeAppEventEmitter,
  Linking
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Toast, DatePicker, List } from 'antd-mobile-rn';
import YSI18n from 'YSI18n';

import Orientation from 'react-native-orientation';
import JPushModule from 'jpush-react-native';
const AppState = require('AppState');
import md5 from 'crypto-js/md5';
import { IOSInit, startLogPageView, stopLogPageView } from 'YSAnalytics';

import { logout, chooseLanguage } from './actions/user';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      showMessageBox: false,
      showNoticeBox: true,
      latest_version: {},
      version_info: { latest_version: '' },
      is_need_update: false
    };
  }

  componentWillMount() {
    Orientation.lockToPortrait();
  }
  ReceiveNotificationSubscription: null;
  OpenNotificationSubscription: null;
  NetworkDidReceiveMessageSubscription: null;
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    //消息推送
    if (Platform.OS != 'ios') {
      //JPushModule.initPush();
    }
    else if (Platform.OS == 'ios') {
      JPushModule.setBadge(0, () => { });//清除状态栏消息
      this.ReceiveNotificationSubscription = NativeAppEventEmitter.addListener(
        'ReceiveNotification',
        (notification) => {
          //alert(JSON.stringify(notification))
        }
      );
      this.OpenNotificationSubscription = NativeAppEventEmitter.addListener(
        'OpenNotificationToLaunchApp',
        (notification) => {
          let msg = { id: notification._j_msgid, message: notification.aps.alert, data: notification.data || {} };
          //this.props.dispatch(doAppMessage(msg, 'add'));
          this.setState({ showMessageBox: true, showMessage: msg });
          JPushModule.setBadge(0, () => { });//清除状态栏消息
        }
      );
      this.OpenNotificationSubscription = NativeAppEventEmitter.addListener(
        'OpenNotification',
        (notification) => {
          let msg = { id: notification._j_msgid, message: notification.aps.alert, data: notification.data || {} };
          //this.props.dispatch(doAppMessage(msg, 'add'));
          this.setState({ showMessageBox: true, showMessage: msg });
          JPushModule.setBadge(0, () => { });//清除状态栏消息
        }
      );
      this.NetworkDidReceiveMessageSubscription = NativeAppEventEmitter.addListener(
        'networkDidReceiveMessage',
        (message) => {
          console.log(message);
        }
      );
    }
    //JPushModule.setAlias(this.props.userInfo.uid.replace(/-/g, ''), (e) => { }, (e) => { })
    if (Platform.OS == 'android') {
      JPushModule.notifyJSDidLoad(() => { });

      JPushModule.addReceiveCustomMsgListener((msg) => {
        //msg.message="hello"
        //msg.extras=""
        msg.id = msg.id || md5(msg.message);
        var extrasObj = msg.extras == '' ? {} : eval('(' + msg.extras + ')');
        if (!extrasObj.isCommand) { //不是命令类型
          //this.props.dispatch(doAppMessage(msg, 'add'));
          this.setState({ showMessageBox: true, showMessage: msg });
        }
        console.log("receive custommessage: " + msg);
      });

      JPushModule.addReceiveNotificationListener((msg) => {
        //msg.alertContent="hello"
        //msg.extras="{}"

        msg.message = msg.alertContent;
        msg.id = msg.id || md5(msg.message);
        //this.props.dispatch(doAppMessage(msg, 'add'));
        this.setState({ showMessageBox: true, showMessage: msg });
        JPushModule.clearAllNotifications();//清除状态栏消息
        console.log("receive notification: " + msg);
      });

      JPushModule.addReceiveOpenNotificationListener((msg) => {

        msg.message = msg.alertContent;
        msg.id = msg.id || md5(msg.message);
        //this.props.dispatch(doAppMessage(msg, 'add'));
        this.setState({ showMessageBox: true, showMessage: msg });
        console.log("open notification:" + msg)
      });
    }
    //统计跟踪,ios
    if (Platform.OS == 'ios') {
      IOSInit();
    }
  }
  componentWillUnmount() {
    //监听销毁
    if (Platform.OS == 'ios') {
      this.ReceiveNotificationSubscription.remove();
      this.OpenNotificationSubscription.remove();
      this.NetworkDidReceiveMessageSubscription.remove();
    }
    else {
      JPushModule.removeReceiveCustomMsgListener();
      JPushModule.removeReceiveNotificationListener();
      JPushModule.removeReceiveOpenNotificationListener();
    }
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (appState) => {
    if (appState == 'active') {
      
    }
  }

  switchLocale = (locale) => {
    this.props.chooseLanguage(locale);
  }

  render() {
    let block_Home = null;
    block_Home = <View><Text>{YSI18n.get('homePage')}</Text><Button onClick={() => {
      this.props.logout();
    }}>{YSI18n.get('logout')}</Button>
      <Button onClick={() => {
        Toast.loading('', 3)
        this.switchLocale('en');
      }}>英文</Button>
      <Button onClick={() => {
        Toast.loading('', 3)
        this.switchLocale('zh');
      }}>中文</Button>
      <List>
        <DatePicker
          mode="date"
          minDate={new Date(2015, 7, 6)}
          maxDate={new Date(2026, 11, 3)}
          onChange={this.onChange}
          format="YYYY-MM-DD"
        >
          <List.Item arrow="horizontal">Select Date</List.Item>
        </DatePicker>
      </List>
    </View>
    //获取最后一条消息
    return <View style={styles.container}>
      {block_Home}
    </View>
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
})

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    userInfo: store.user.userInfo,
    closeAd: store.user.closeAd,
    lastedAppVersion: store.user.lastedAppVersion,
    locale: store.user.locale,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators(logout, dispatch),
    chooseLanguage: bindActionCreators(chooseLanguage, dispatch),
  };
}
module.exports = connect(select, mapDispatchToProps)(Home);
