
'use strict';

import type {Action } from '../actions/types';
import { getCurrentTimeStamp, split } from '../common/Util';
export type State = {
  courses: any,
};

const initialState = {
  courses: [],
};

function course(state: State = initialState, action: Action): State {
  //退出登录后清空store中的数据
  if (action.type == 'LOGGED_OUT') {
    return initialState;
  }
  if (action.type === 'LOADED_COURSES') {
    let list = state.courses;
    return {
      ...state,
      courses: actions.data.data_list
    };
  }else if(action.type === 'SAVED_COURSE') {
    state.courses.map(c => {
      if(c.CourseID == action.data.CourseID){
        c = action.data;
      }
    })
    return {
      ...state,
      courses: state.courses
    }
  }

  return state;
}

module.exports = course;
