
'use strict';

import type {Action } from '../actions/types';
import { getCurrentTimeStamp, split } from '../common/Util';
export type State = {
  organizations: any,
};

const initialState = {
  organizations: { pageIndex: 0, json_version: '1.0', data_list: [], data_version: 0 },

};

function appendOrganizations(oneRecord, oldList) {
  const id = oneRecord.DepartmentID;
  if (oldList.find((n) => n.DepartmentID === id)) {
    return oldList;
  }
  return [list: oldList, oneRecord];
}

function organization(state: State = initialState, action: Action): State {
  //退出登录后清空store中的数据
  if (action.type == 'LOGGED_OUT') {
    return initialState;
  }
  if (action.type === 'LOADED_ORGANIZATIONS') {
    let list = state.organizations.data_list;
    let pageIndex = state.organizations.pageIndex;
    if (action.data.pageIndex == 1) {//重新加载数据
      list = action.data.data_list;
      pageIndex = action.data.pageIndex;
    }
    else if (pageIndex < action.data.pageIndex) {//合并多页数据
      action.data.data_list.forEach((item) => {
        list = appendOrganizations(item, list);
      });
      pageIndex = action.data.pageIndex;
    }
    //合并查询数据到数组
    return {
      ...state,
      organizations: { pageIndex: pageIndex, data_list: list }
    };
  }else if(action.type === 'SAVED_ORGANIZATION') {
    return {
      ...state,
    }
  }

  return state;
}

module.exports = organization;
