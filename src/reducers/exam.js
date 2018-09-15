
'use strict';

import type {Action } from '../actions/types';
import { getCurrentTimeStamp, split } from '../common/Util';
export type State = {
  place_info: any,
};

const initialState = {
  place_info: {},
};

function exam(state: State = initialState, action: Action): State {
  //退出登录后清空store中的数据
  if (action.type == 'GETTED_PLACE') {
    var place_info = action.data || {};
    return {
      ...state,
      place_info
    }
  }
  if(action.type == 'GETTED_EXAM_CLASS'){
    
  }

  return state;
}

module.exports = exam;
