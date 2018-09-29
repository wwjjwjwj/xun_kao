'use strict';

import { getCurrentTimeStamp, dateFormat } from '../common/Util';
const initialState = {
    isLoggedIn: false,
    isShowSet: false,
    id: null,
    name: null,
    userInfo: null,
    lastVisitedTimeStamp: 0,//最近一次访问时间戳
    language: 'zh',
    AppMessages: { data_list: [], data_version: 0 }//app消息
};
function appendAPPMessage(message, list) {
    const id = message.id;
    if (list.find((n) => n.id === id)) {
        return list;
    }
    return [...list, message];
}
function user(state = initialState, action) {
    if (action.type === 'LOGGED_IN') {
        //alert(JSON.stringify(action.data))
        let { token, id, name, userInfo, account, schoolInfo } = action.data;
        return {
            ...state,
            isLoggedIn: true,
            id,
            name,
            account,
            login_name: account,
            schoolInfo,
            userInfo,
        };
    }
    /*if (action.type === 'REGGED_IN') {
        let { token, id, name, userInfo, login_name } = action.data;
        return {
            ...state,
            isLoggedIn: true,
            id,
            name,
            userInfo,
            login_name: login_name
        };
    }*/
    if (action.type == 'LOGGED_OUT') {
        return {
            ...state,
            isLoggedIn: false,
            isShowSet: false,
            id: '',
            name: '',
            userInfo: null,
            //email: state.userInfo.user_name,
            schoolInfo: {},
            saw_notice: false
        }
    }
    if(action.type === 'LOADED_SCHOOLS'){
        let { school_list } = action.data;
        var _list = [];
        if(school_list && school_list.length){
          school_list.map(s => {
            if(s){
              _list.push({
                value: s.schoolId,
                label: s.schoolName
              })
            }
          })
        }
        return {
            ...state,
            school_list: _list
        };
    }
    if (action.type === 'SKIPPED_AD') {
        return {
            ...state,
            closeAd: true
        };
    }
    if(action.type === 'SAW_NOTICE') {
        return {
          ...state,
          saw_notice: true
        }
    }
    //app消息处理
    if (action.type === 'APP_MESSAGE_ACTION') {
        var AppMessages = state.AppMessages || { data_list: [], data_version: 0 };
        var message = action.data;
        message.readStatus = 0;
        message.createTime = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        switch (action.actionType) {
            case 'add':
                AppMessages.data_list = appendAPPMessage(message, AppMessages.data_list);
                break;
            case 'view':
                var find = AppMessages.data_list.find(A = A.id == message.id);
                if (find) {
                    find.readStatus = 1;
                }
                break;
            case 'delete':
                AppMessages.data_list = AppMessages.data_list.filter(A => A.id != message.id);
                break;
            case 'clear':
                var AppMessages = { data_list: [], data_version: 0 };
                break;
        }
        AppMessages.data_version = getCurrentTimeStamp();
        return {
            ...state,
            AppMessages
        };
    }
    if (action.type === 'UPDATE_LASTVISITED_TIMESTAMP') {
        return {
            ...state,
            lastVisitedTimeStamp: getCurrentTimeStamp(),
        };
    }
    if (action.type === 'CHOOSE_LANGUAGE') {
        return {
            ...state,
            locale: action.locale
        };
    }
    if (action.type === 'VIEW_INTRODUCTION') {
        return {
            ...state,
            lastedAppVersion: action.lastedAppVersion
        };
    }
    return state;
}

module.exports = user;
