'use strict';

import {
    View,
    Text,
    StyleSheet,
    InteractionManager
} from 'react-native';


const React = require('React');
var App = require('./app');
var configureStore = require('./store/configureStore');
var { Provider } = require('react-redux');
//闪屏
import SplashScreen from 'react-native-splash-screen'

//读取当前设备的语言环境
import I18n from 'react-native-i18n'
const deviceLocale = I18n.locale;

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
