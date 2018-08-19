'use strict';
import Ajax from '../common/ajax';
//=======================字典接口===========================

//获取字典
export function loadDictionary(dicTypes: Array) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Dictionary/ClientLoadDictionarys", { groupName: dicTypes.join(',') });
        promise.then((result) => {
            const action = {
                type: 'LOAD_DICTIONARY',
                data: result.data
            }
            dispatch(action);
        });
        //返回数据
        return promise;
    };
}

//设置字典
export function setDictionary(dicTypes) {
  return {
    type: 'SET_DICTIONARY',
    data: dicTypes
  }
}