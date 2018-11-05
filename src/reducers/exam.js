
'use strict';

import type {Action } from '../actions/types';
import { getCurrentTimeStamp, split } from '../common/Util';
export type State = {
  place_info: any,
};

const initialState = {
  place_info: {},
  class_sign_list: [],
  class_stat_list: []
};

function exam(state: State = initialState, action: Action): State {
  //退出登录后清空store中的数据
  if (action.type == 'LOGGED_OUT') {
    return initialState;
  }
  if (action.type == 'GETTED_PLACE') {
    var place_info = action.data || {};
    return {
      ...state,
      place_info
    }
  }
  else if(action.type == 'GETTED_EXAM_CLASS_SIGN'){
    var class_sign_list = action.data || [];
    //包含 examId, stationId, palceId, orderName, className, time...
    return {
      ...state,
      class_sign_list
    }
  }
  else if(action.type == 'GETTED_EXAM_CLASS_STAT'){
    var class_stat_list = action.data || [];
    return {
      ...state,
      class_stat_list
    }

  }
  

  return state;
}

module.exports = exam;
