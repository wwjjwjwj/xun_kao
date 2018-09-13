'use strict';
import {
    Platform,
} from 'react-native';

import I18n from 'react-native-i18n'

const deviceLocale = I18n.locale;
const url = 'http://211.167.76.161:8112/';
const url2 = 'http://211.167.76.161:8112/';

module.exports = {
    appName: '巡考',
    appVersion: '1.0.0',//app当前版本
    JPUSHID: '9867c7067671ca35dd19f242',
    apiDebug: true,//api调试
    testEnabled: false,
    resURL: url2,
    //serverURL: url + 'API-1.0/',//测试服务器
    serverURL: url + 'api/',//测试服务器
    version: 101,
    iosAppStore: 'itms-apps://itunes.apple.com/us/app/%E4%BC%98%E5%AE%9E%E5%AD%A6%E5%A0%82/id1148560657?l=zh&ls=1&mt=8',
    defaultPageSize: 10,
    //获取当前用户token
    getToken: function () {
        var user = global.STORE_INSTANCE.getState().user;
        if (user && user.userInfo) {
            //管理端提供用户多应用身份切换
            return user.userInfo.Token;
            if (user.userInfo.Token) {
                //return user.userInfo.token + ',' + user.userInfo.role_contexts[0].orgID;
            }
            else {
                return user.userInfo.token;
            }
        }
        return "";
    },
    //获取当前用户语言环境
    getLocale: function () {
        var user = global.STORE_INSTANCE.getState().user;
        if (user && user.locale) {
            return user.locale;
        }
        return deviceLocale;
    },
    getSchoolId: function() {
        var user = global.STORE_INSTANCE.getState().user;
        if (user && user.schoolInfo) {
            //管理端提供用户多应用身份切换
            return user.schoolInfo.value;
        }
        return "";
    },
    getFinger: function() {
      var base = global.STORE_INSTANCE.getState().base;
      if(base && base.deviceInfo){
        return base.deviceInfo.uuid;
      }
      return "";
    }
};
