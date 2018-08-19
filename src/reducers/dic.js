'use strict';

const initialState = {
  Dictionarys: {},
};

function dic(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOAD_DICTIONARY':
      {
        let newDic = action.data;
        let allDic = { ...state.Dictionarys, ...newDic };//合并属性   
        return {
          ...state,
          Dictionarys: allDic,
        };
      }
    case 'SET_DICTIONARY':
      {
        let newDic = action.data;
        let allDic = { ...state.Dictionarys, ...newDic };//合并属性   
        return {
          ...state,
          Dictionarys: allDic,
        };
      }
    default:
      return state;
  }
}

module.exports = dic;