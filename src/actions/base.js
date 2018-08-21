
'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');
import DeviceModule from 'react-native-schoolearn';

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//部门列表     状态：0:查全部；1启用
export function dicList(groupName: String) {
    return (dispatch) => {
        var options = {
          GroupName: groupName,
          Status: 1
        }
        const promise = Ajax.promisePostJson("dictionary/searchDictionary", options);
        promise.then((result) => {
            const action = {
                type: 'LOADED_DICTIONARY',
                data: {
                  group_name: groupName,
                  data_list: result.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}

//部门保存
export function departmentSave(department: Object) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/saveDepartment", department);
        promise.then((result) => {
            const action = {
                type: 'SAVED_ORGANIZATION',
                data: { },
            }
            dispatch(action);
        });
        return promise;
    };
}
//部门删除
export function departmentDelete(id: any) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/deleteDepartment", {id: id});
        promise.then((result) => {
            const action = {
                type: 'DELETED_ORGANIZATION',
                data: { },
            }
            dispatch(action);
        });
        return promise;
    };
}

export function getDeviceUuid(){
  return (dispatch) => {
    DeviceModule.getUuid(function (result) {
      if (result && result.uuid) {
        const action = {
          type: 'GETTED_UUID',
          data: result
        }
        dispatch(action);
      }
    })
  };
}
