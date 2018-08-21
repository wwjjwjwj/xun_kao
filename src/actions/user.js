'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//用户登录
export function loginWithEmail(userName, password, school_id, school_name) {
    return (dispatch) => {
        //管理端登录
        const promise = Ajax.promisePostJson("AccessManagement/login", { UserName: userName, Password: password, SchoolId: school_id, SchoolName: school_name });
        promise.then((result) => {
            const action = {
                type: 'LOGGED_IN',
                data: {
                    token: result.ReData.Token,
                    id: result.ReData.UserID,
                    name: result.ReData.RealName,
                    userInfo: result.ReData,
                    login_name: userName,  //用于下次登录时，直接在输入框中
                    schoolInfo: {value: school_id, label: school_name}
                }
            }
            dispatch(action);
        });
        return promise;
    };
}
//获取用户功能权限清单
export function getUserMenus() {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("user/GetUserMenus");
        promise.then(
            (result) => {
                const action = {
                    type: 'GET_ALL_MENU',
                    data: result.data
                }
                dispatch(action);
            }
        )
        return promise;
    };
}

//退出登录
export function logout() {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("user/logout");
        promise.then(
            (result) => {
                const action = {
                    type: 'LOGGED_OUT',
                    data: {
                        token: '',
                        id: '',
                        name: ''
                    }
                }
                dispatch(action);
            }
        )
        const action = {
            type: 'LOGGED_OUT',
            data: {
                token: '',
                id: '',
                name: ''
            }
        }
        dispatch(action);
        return promise;
    };
};

//发送短信
// type: 1 注册；3 忘记密码
export function sendSMS(phone: string, type: number, callback: any){
    return (dispatch) => {
        const promise = Ajax.promisePostJson("", {});
        promise.then((result) => {
            const action = {
                type: 'PHONECODE_SENDED',
                data: {
                  phone: phone,
                }
            }
            dispatch(action);
        });
        return promise;
    };
}

//用手机号来 重置密码
export function resetPwdByMobile(phone, callback: any){
    return (dispatch) => {
        const promise = Ajax.promisePostJson("", {});
        promise.then((result) => {
            const action = {
                type: 'PWD_RESETTED',
                data: {
                    login_name: phone,  //用于下次登录时，直接在输入框中
                }
            }
            dispatch(action);
        });
        return promise;
    };
}

//跳过广告
export function skipAd() {
    return {
        type: 'SKIPPED_AD',
    };
}
//浏览了向导页
export function ViewIntroduction(appVersion) {
    return {
        type: 'VIEW_INTRODUCTION',
        lastedAppVersion: appVersion
    };
}
//多语言选择
export function chooseLanguage(locale) {
    //立即应用选中的语言
    global.locale = locale;
    return {
        type: 'CHOOSE_LANGUAGE',
        locale: locale
    };
}
//App消息，actionType:add,view,delete,clear
export function doAppMessage(message, actionType) {
    return {
        type: 'APP_MESSAGE_ACTION',
        actionType: actionType,//动作
        data: message//消息内容
    };
}

//教师列表
export function teacherListQuery(condition) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/teacherList", condition);
        promise.then((result) => {
            const action = {
                type: 'LOADED_TEACHERS',
                data: {
                  data_list: result.data.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}

//教师保存
export function teacherSave(info: Object) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/saveTeacher", {teacher: info});
        promise.then((result) => {
            //需返回 新增课程Id
            const action = {
                type: 'SAVED_Teacher',
                data: teacher,
            }
            dispatch(action);
        });
        return promise;
    };
}

//盟校下全部用户
export function allOrgUserQuery() {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/allOrgUserQuery");
        promise.then((result) => {
            const action = {
                type: 'LOADED_ORG_USERS',
                data: {
                  data_list: result.data.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}

//查用户
export function userQuery(condition) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/userQuery", condition);
        promise.then((result) => {
            const action = {
                type: 'LOADED_USERS',
                data: {
                  data_list: result.data.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}
