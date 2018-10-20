'use strict';

import {
    View,
    Text,
    StyleSheet,
    InteractionManager,
    Alert
} from 'react-native';


const React = require('React');
var App = require('./app');
var configureStore = require('./store/configureStore');
var { Provider } = require('react-redux');
//闪屏
import SplashScreen from 'react-native-splash-screen'

//import { reportError } from './actions/common';
//读取当前设备的语言环境
import I18n from 'react-native-i18n'
const deviceLocale = I18n.locale;

import YSI18n from 'YSI18n';

var globalErrorCounts = 0;
var IsShowErrorDetail=true;
//全局监控错误
require('ErrorUtils').setGlobalHandler(function (err) {
    //网络故障，请检查网络 Network request failed
    if(err.message.toLocaleLowerCase().indexOf('network')!=-1){
        //提示
        Alert.alert(YSI18n.get('tip'), YSI18n.get('NetworkFailed'),
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        return;
    }
    console.log('runtime has error->' + err.message);
    //服务端记录错误
    //reportError(err.stack);
    globalErrorCounts++;
    if (globalErrorCounts > 0 && IsShowErrorDetail) {
        //提示
        Alert.alert(YSI18n.get('tip'), `${YSI18n.get('UnknowAppError')}'${err.message}'`,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
    }
});

//模拟错误发生器
 /*
 setTimeout(() => {
     throw new Error('Ouch');
 }, 10000);
 */

import theme from './common/theme';

class setup extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            store: configureStore(() => {
                var userStore = this.state.store.getState().user;
                userStore = userStore || { locale: deviceLocale || 'zh-CN' };
                global.locale = userStore.locale || deviceLocale || 'zh-CN';
                this.setState({ isLoading: false });
            }),
        };
        global.STORE_INSTANCE = this.state.store;
    };
    componentWillMount() {
        console.disableYellowBox = true;    //关闭黄屏警告
    }
    componentDidMount() {
        // do anything while splash screen keeps, use await to wait for an async task.
        //SplashScreen.hide();
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
            });
        }, 1500);
        setTimeout(function(){
          SplashScreen.hide();
        }, 5000);
    }

    render() {
        if (this.state.isLoading)
            return null;
        return (
            <Provider store={this.state.store}>
                <App />
            </Provider>
        );
    };

}
module.exports = setup;
