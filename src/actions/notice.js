'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//消息通知列表
export function notice_list(obj) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/NoticeList", obj);
        promise.then((result) => {
            const action = {
                type: 'NOTICE_NOTICELIST',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//消息通知保存
export function notice_Save(obj) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/SaveNoticeInfo", obj);
        promise.then((result) => {
            const action = {
                type: 'NOTICE_SAVENOTICEINFO',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}
//消息通知删除
export function notice_Delete(noticeID){
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/DeleteNoticeInfo", {noticeID});
        //返回数据
        return promise;
    };
}
//查询单个消息通知
export function notice_ByID(noticeID){
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/NoticeByID", {noticeID});
        //返回数据
        return promise;
    };
}
//消息通知阅读情况
export function notice_ReadInfo(obj){
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/NoticeReadInfo", obj);
        //返回数据
        return promise;
    };
}

//总部员工列表
export function notice_UserList_zb(obj) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/UserList_zb", obj);
        promise.then((result) => {
            const action = {
                type: 'NOTICE_USERLIST_ZB',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}
//总部盟校列表
export function notice_OrganizationList_mx(obj) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Notice/OrganizationList_mx", obj);
        promise.then((result) => {
            const action = {
                type: 'NOTICE_ORGANIZATIONLIST_MX',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}