
'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//课程列表
export function courseListQuery() {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/allCourseList", {});
        promise.then((result) => {
            const action = {
                type: 'LOADED_COURSES',
                data: {
                  data_list: result.data.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}

//课程保存
export function courseSave(course: Object) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/saveCourse", course);
        promise.then((result) => {
            //需返回 新增课程Id
            const action = {
                type: 'SAVED_COURSE',
                data: course,
            }
            dispatch(action);
        });
        return promise;
    };
}
//课程删除
export function courseDelete(id: any) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/deleteCourse", {id: id});
        promise.then((result) => {
            const action = {
                type: 'DELETED_COURSE',
                data: { },
            }
            dispatch(action);
        });
        return promise;
    };
}

//盟校课程授权列表
export function courseAuthListQuery(searchCondition) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/OrganizationAuthCourseList", {options: searchCondition});
        promise.then((result) => {
            const action = {
                type: 'LOADED_AUTH_COURSES',
                data: {
                  data_list: result.data.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}

//课程授权保存
export function courseAuthSave(organizationId, courseSpecialtys) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/saveOrganizationAuthCourses", {organizationId: organizationId, courseSpecialtys: courseSpecialtys});
        promise.then((result) => {
            //需返回 新增课程Id
            const action = {
                type: 'SAVED_AUTH_COURSE',
                data: course,
            }
            dispatch(action);
        });
        return promise;
    };
}

//盟校课程组列表
export function courseTeamListQuery() {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/TeachCourseTeamList", {});
        promise.then((result) => {
            const action = {
                type: 'LOADED_COURSE_TEAMS',
                data: {
                  data_list: result.data.data_list,
                },
            }
            dispatch(action);
        });
        return promise;
    };
}

//课程组保存
export function courseTeamSave(info) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/saveTeachCourseTeam", {team: info});
        promise.then((result) => {
            //需返回 新增课程Id
            const action = {
                type: 'SAVED_COURSE_TEAM',
                data: course,
            }
            dispatch(action);
        });
        return promise;
    };
}
//课程组删除
export function courseTeamDelete(id: any) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("course/deleteCourseTeam", {id: id});
        promise.then((result) => {
            const action = {
                type: 'DELETED_COURSE_TEAM',
                data: { },
            }
            dispatch(action);
        });
        return promise;
    };
}
