'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//1.	考试批次、学习中心、考点地址的列表数据
export function GetPlace() {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetPlace");
        promise.then((result) => {
            const action = {
                type: 'GET_PLACE',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//2.	考点地址-场次安排
export function GetExamClass(examId, stationId, placeId) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetExamClass", {
          examId: examId,
          stationId: stationId,
          placeId: placeId
        });
        promise.then((result) => {
            const action = {
                type: 'GET_EXAM_CLASS',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//3.	场次统计信息
export function GetOrderStatistics(examId, stationId, placeId, orderName, className) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetOrderStatistics", {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          orderName: orderName,
          className: className,
        });
        promise.then((result) => {
            const action = {
                type: 'GET_ORDER_STATISTICS',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//4.1	根据证件号获取考生信息，精确匹配
export function GetStudentByCard(examId, stationId, placeId, cardNumber) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetStudent", {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          cardNumber: cardNumber,
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//4.2	根据考生姓名、学号、证件号获取考生信息，模糊匹配
export function GetStudentByName(studentInfo) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetStudent", {
          studentInfo: studentInfo,
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//4.3	根据场次状态获取考生信息
export function GetStudentByState(state) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetStudent", {
          state: state,
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}


//1.	刷卡签到
export function CardSign(studentId, pos, cardPic, photo) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("UserPhoto/CardSign", {
          studentId: studentId,
          pos: pos,
          cardPic: cardPic,
          photo: photo
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//2.	其他签到
export function PhotoSign(studentId, pos, photo) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("UserPhoto/PhotoSign", {
          studentId: studentId,
          pos: pos,
          photo: photo
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}

//3.	拍照上传
export function PhotoUpload(examId, stationId, placeId, orderName, className, pos, files) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("UserPhoto/PhotoUpload", {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          orderName: orderName,
          className: className,
          pos: pos,
          files: files,
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}
