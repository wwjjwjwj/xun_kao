'use strict';
import Ajax from '../common/ajax';
//=======================角色管理接口===========================

//查询角色列表
export function getRoleList(pagingSearch) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Role/GetRoleList", pagingSearch);
        //返回数据
        return promise;
    };
}
//查询角色功能清单
export function getRoleFunList(roleID) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Role/GetRoleFunList", {roleID});
        //返回数据
        return promise;
    };
}

//保存角色信息
export function saveRoleInfo(roleInfo) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Role/SaveRoleInfo", roleInfo);
        //返回数据
        return promise;
    };
}

//删除角色信息
export function deleteRoleInfo(roleID) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Role/DeleteRoleInfo", {roleID});
        //返回数据
        return promise;
    };
}