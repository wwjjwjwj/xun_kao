'use strict';

import { getCurrentTimeStamp, dateFormat } from '../common/Util';
const initialState = {
    Zixun_InformationList:{data_list: [], data_list_total:0, data_version: 0},
};
function zixun(state = initialState, action) {
    if (action.type == 'LOGGED_OUT') {
        return {
            ...state,
            Zixun_InformationList:{data_list: [], data_list_total:0, data_version: 0},
        }
    }
    if (action.type == 'INFORMATION_HOME_LIST') {
        var infomationlist =state.Zixun_InformationList || { data_list: [], data_list_total:0, data_version: 0 };
        infomationlist.data_list = action.data.data_list;
        infomationlist.data_list_total = action.data.data_list_total;
        infomationlist.data_version = getCurrentTimeStamp();
        return {
            ...state,
            Zixun_InformationList:infomationlist
        }
    }
    return state;
}

module.exports = zixun;