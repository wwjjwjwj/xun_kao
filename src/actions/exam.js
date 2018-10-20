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
            if(result.State == 1){
              const action = {
                  type: 'GETTED_PLACE',
                  data: result.ReData
              }
              dispatch(action);
            }
        });
        return promise;
    };
}


//1.1	考试须知
export function GetExamNotice(examId) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetExamPlanInvigilateNotice", {examId: examId});
        promise.then((result) => {
            if(result.State == 1){
              const action = {
                  type: 'GETTED_EXAM_NOTICE',
                  data: result.ReData
              }
              dispatch(action);
            }
        });
        return promise;
    };
}
//1.1	考试任务
export function GetExamTask(examId) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetExamPlanInvigilateTask", {
          examId: examId, index: 1, size: 999
        });
        promise.then((result) => {
            if(result.State == 1){
              const action = {
                  type: 'GETTED_EXAM_TASK',
                  data: result.ReData
              }
              dispatch(action);
            }
        });
        return promise;
    };
}


//2.	考点地址-场次安排（包含签到）
export function GetExamClassSign(examId, stationId, placeId) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetExamClass", {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          index: 1,
          size: 999
        });
        promise.then((result) => {
            //alert(JSON.stringify(result));
            if(result.State == 1){
              const action = {
                  type: 'GETTED_EXAM_CLASS_SIGN',
                  data: result.ReData.dataList
              }
              dispatch(action);
            }
        });
        return promise;
    };
}
//2.	考点地址-场次安排（包含缺考等详情）
export function GetExamClassStat(examId, stationId, placeId) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetExamClassSign", {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          index: 1,
          size: 999
        });
        promise.then((result) => {
            //alert(JSON.stringify(result));
            if(result.State == 1){
              const action = {
                  type: 'GETTED_EXAM_CLASS_STAT',
                  data: result.ReData.dataList
              }
              dispatch(action);
            }
        });
        return promise;
    };
}

//3.	场次统计信息
export function GetOrderStatistics(examId, stationId, placeId, orderName, className) {
    return (dispatch) => {
        var params = {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          orderName: orderName,
          className: className,
        };
        const promise = Ajax.promisePostJson("ExamPlan/GetOrderStatistics", params);
        promise.then((result) => {
            //alert(JSON.stringify(result));
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
export function GetStudentByCard(examId, stationId, placeId, orderName, cardNumber) {
    return (dispatch) => {
      var params = {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          orderName: orderName,
          cardNumber: cardNumber,
        };
      /*var params = {
          examId: 13,
          stationId: 12,
          placeId: 41,
          orderName: '第一场',
          cardNumber: '110224199007260023',
        };*/
//alert(JSON.stringify(params))
        const promise = Ajax.promisePostJson("ExamPlan/GetStudentByCard", params);
        promise.then((result) => {
//alert(JSON.stringify(result))
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
export function GetStudentByName(examId, stationId, placeId, orderName, studentInfo, index, size) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetStudentBySearch", {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          //orderName: orderName,
          studentInfo: studentInfo,
          index: index,
          size: size
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
export function GetStudentByState(examId, stationId, placeId, orderName, state, index, size) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetStudentByState", {
          examId, stationId, placeId, orderName, state, index, size
        });
        promise.then((result) => {
            //alert(JSON.stringify(result));
            const action = {
                type: 'GET_STUDENT',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}


//4.3	根据场次获取考生信息
export function GetStudentByOrder(examId, stationId, placeId, orderName, index, size) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("ExamPlan/GetStudentByOrder", {
          examId, stationId, placeId, orderName, index, size
        });
        promise.then((result) => {
            const action = {
                type: 'GET_STUDENT_BY_ORDER',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}


//1.	刷卡签到
export function CardSign(s) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("UserPhoto/CardSign", s
        /*{
          studentId: studentId,
          pos: pos, //test  39.94876642336431,116.4245867729187
          cardPic: cardPic,
          photo: photo
        }*/
        );
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
export function StudentPhotoSign(studentId, pos, photo) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("UserPhoto/PhotoSign", {
          studentId: studentId,
          pos: pos, //test  39.94876642336431,116.4245867729187
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
//2.	其他签到（从拍照签到跳转过来的 签到）
export function StudentPhotoSignAdd(studentId, pos, photo) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("UserPhoto/AddSign", {
          studentId: studentId,
          pos: pos, //test  39.94876642336431,116.4245867729187
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
export function PhotoUpload(examId, stationId, placeId, orderName, pos, situation, memo, files) {
    return (dispatch) => {
        var params = {
          examId: examId,
          stationId: stationId,
          placeId: placeId,
          orderName: orderName,
          className: className,
          pos: pos, //test  39.94876642336431,116.4245867729187
          situation: situation,
          memo: memo,
          files: files,
        }
        alert(JSON.stringify(params))
        const promise = Ajax.promisePostJson("UserPhoto/PhotoUpload", params);
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
