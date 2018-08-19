
'use strict';

import {
  StyleSheet,
  View,
  StatusBar,
  AppRegistry,
  Platform,
  Linking,
  Alert
} from 'react-native';

import {
  LocaleProvider
} from 'antd-mobile-rn';

const React = require('React');
const AppState = require('AppState');

const Login = require('./login/login');
const ReadCard = require('./read_card');

import { connect } from 'react-redux';
import { appVersion, wxAppID } from './env';
const Navigator = require('./navigator');
const Introduction = require('./introduction');


//ant-design 多语言包环境配置
import LocaleContext from './locale/index';

//导入APP图片包定义
import './assets';

class App extends React.Component {
  componentWillMount() {
  }
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }
  handleAppStateChange(appState) {
    if (appState == 'active') {

    }
  }

  render() {
    let content_block = "";
    // 应用版本更新时显示
    if (appVersion != this.props.lastedAppVersion) {
      content_block = <Introduction />;
    }
    //未登录情况
    if (!this.props.isLoggedIn) {
      content_block = <Login />;
    }
    //已经登录用户
    else {
      content_block = <Navigator />;
    }
    //content_block = <ReadCard />;
    // 多语言环境支持
    return <LocaleProvider locale={LocaleContext.chooseLocale()}>
      {content_block}
    </LocaleProvider>
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    closeAd: store.user.closeAd,
    lastedAppVersion: store.user.lastedAppVersion || '',//introduction control
    locale: store.user.locale,
  }
}

module.exports = connect(select)(App);
