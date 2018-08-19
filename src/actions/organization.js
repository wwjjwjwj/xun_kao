
'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//部门列表     状态：0:查全部；1启用
export function departmentListQuery(status: number, pageIndex: number, pageSize: number) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("sso/departmentList", { status });
        promise.then((result) => {
            const action = {
                type: 'LOADED_ORGANIZATIONS',
                data: {
                  pageIndex: pageIndex,
                  data_list: result.data_list,
                  data_version: result.data_version
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
