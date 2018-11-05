
'use strict';

import type {Action } from '../actions/types';
import { getCurrentTimeStamp, split } from '../common/Util';

export type Dictionary = {
  group_name: String,
  data_list: Array,
}

export type State = {
  dictionarys: Dictionary,
  deviceInfo: {}
};

const initialState = {
  dictionarys: [],
  deviceInfo: {}
};

function base(state: State = initialState, action: Action): State {
  /*
   *  应该为每个分组设置一个过期时间，比如1小时，到了就删除，需要重新从服务器获取
  */

  /*if (action.type == 'LOGGED_OUT') {
    return initialState;
  }
  if(action.type === 'LOAD_DICTIONARY'){
    return state.dictionarys || [];
  }
  if (action.type === 'LOADED_DICTIONARY') {
    let list = state.dictionarys;
    var isExist = false;
    list.forEach(item => {
      if(action.data.group_name == item.group_name){
        isExist = true;
        item = action.data;
        break;
      }
    });
    if(!isExist){
      list.add(action.data);
    }
    return {
      ...state,
      dictionarys: list
    };
  }*/
  if(action.type === 'GETTED_UUID'){
    return {
      ...state,
      deviceInfo: action.data
    }
  }
  else if(action.type == 'SET_CONNECTED_DEVICE'){
    var flag = action.data.flag;
    return {
      ...state,
      connect_flag: flag
    }
  }

  return state;
}

module.exports = base;
