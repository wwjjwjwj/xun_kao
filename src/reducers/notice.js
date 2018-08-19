'use strict';

import { getCurrentTimeStamp, dateFormat } from '../common/Util';

//合并用户数据
function appendData(oneRecord, oldList) {
    const id = oneRecord.uid;
    if (oldList.find((n) => n.uid === id)) {
        return oldList;
    }
    return [...oldList, oneRecord];
}
//合并盟校数据
function appendMXData(oneRecord, oldList) {
    const id = oneRecord.OrganizationID;
    if (oldList.find((n) => n.OrganizationID === id)) {
        return oldList;
    }
    return [...oldList, oneRecord];
}

const initialState = {
    Notice_NoticeList: { data_list: [], data_list_total: 0, data_version: 0 },
    Notice_UserList_zb: { pageIndex: 1, data_list: [], data_list_total: 0, data_version: 0 },
    Notice_OrganizationList_mx: { pageIndex: 1, data_list: [], data_list_total: 0, data_version: 0 },
};
function notice(state = initialState, action) {
    if (action.type == 'LOGGED_OUT') {
        return {
            ...state,
            initialState
        }
    }
    if (action.type == 'NOTICE_NOTICELIST') {
        let noticelist = state.Notice_NoticeList || { data_list: [], data_list_total: 0, data_version: 0 };
        noticelist.data_list = action.data.data_list;
        noticelist.data_list_total = action.data.data_list_total;
        noticelist.data_version = getCurrentTimeStamp();
        return {
            ...state,
            Notice_NoticeList: noticelist
        }
    }
    if (action.type == 'NOTICE_SAVENOTICEINFO') {
        return {
            ...state,
        }
    }
    if (action.type == 'NOTICE_USERLIST_ZB') {
        let userlist = state.Notice_UserList_zb || { pageIndex: 1, data_list: [], data_list_total: 0, data_version: 0 };
        let pageIndex = state.Notice_UserList_zb.pageIndex;
        if (action.data.pageIndex == 1) {//重新加载数据
            userlist.data_list = action.data.data_list;
        }
        else if (pageIndex < action.data.pageIndex) {//合并多页数据
            action.data.data_list.forEach((item) => {
                userlist.data_list = appendData(item, userlist.data_list);
            });
        }
        userlist.pageIndex = action.data.pageIndex;
        userlist.data_list_total = action.data.data_list_total;
        return {
            ...state,
            Notice_UserList_zb:userlist
        }
    }
    if (action.type == 'NOTICE_ORGANIZATIONLIST_MX') {
        let mxlist = state.Notice_OrganizationList_mx || { pageIndex: 1, data_list: [], data_list_total: 0, data_version: 0 };
        let pageIndex = state.Notice_OrganizationList_mx.pageIndex;
        if (action.data.pageIndex == 1) {//重新加载数据
            mxlist.data_list = action.data.data_list;
        }
        else if (pageIndex < action.data.pageIndex) {//合并多页数据
            action.data.data_list.forEach((item) => {
                mxlist.data_list = appendMXData(item, mxlist.data_list);
            });
        }
        mxlist.pageIndex = action.data.pageIndex;
        mxlist.data_list_total = action.data.data_list_total;
        return {
            ...state,
            Notice_OrganizationList_mx:mxlist
        }
    }
    return state;
}

module.exports = notice;