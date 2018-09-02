
/*
* @flow
* @providesModule Util
*/

import YSI18n from 'YSI18n';
import SchoolearnModule from 'react-native-schoolearn';

export function getDictionaryTitle(dic, value, defaultTitle) {
  dic = dic || [];
  var findItem = dic.find((item) => { return item.value == value; });
  if (findItem != null) {
    return findItem.title;
  }
  if (defaultTitle) return defaultTitle;
  else return value;
}

//获取编辑模式描述
export function getViewEditModeTitle(editMode, defaultValue) {
  let opTitle = '';
  switch (editMode.toLowerCase()) {
    case "create":
      opTitle = '添加';
      break;
    case "edit":
      opTitle = '修改';
      break;
    case "view":
      opTitle = '查看';
      break;
    case "delete":
      opTitle = '删除';
      break;
    case "audit":
      opTitle = '审核';
      break;
  }
  //多语言
  opTitle = YSI18n.get(editMode);
  if (opTitle == '' && defaultValue) {
    return defaultValue
  }
  else {
    return opTitle;
  }
}
//绑定值到组件
export function dataBind(value, isDate) {
  if (isDate) {
    return moment(value != '' ? value : undefined)
  }
  else {
    if (value == undefined) {
      return '';
    }
    else {
      return value.toString();
    }
  }
}

//文本...显示
export function ellipsisText(source, maxLength, ellipsis) {
  source = source || "";
  maxLength = maxLength || 20;
  ellipsis = ellipsis || "...";
  if (source.length > maxLength) {
    let cutString = source.slice(0, maxLength)
    return `${cutString}...`;
  }
  else {
    return source;
  }
}

//文本内容转HTML格式显示
export function convertTextToHtml(source) {
  source = source || "";
  return source.replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
}

//获取当前时间戳
export function getCurrentTimeStamp() {
  let timestamp = (new Date()).valueOf();
  timestamp = timestamp / 1000;
  return timestamp;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export function dateFormat(dateTime, fmt) { //author: meizz
  Date.prototype.Format = function (fmt) {
    var o = {
      //"Y+": dateTime.getFullYear(),
      "M+": dateTime.getMonth() + 1, //月份
      "d+": dateTime.getDate(), //日
      //"D+": dateTime.getDate(), //日
      "h+": dateTime.getHours(), //小时
      "m+": dateTime.getMinutes(), //分
      "s+": dateTime.getSeconds(), //秒
      "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度
      "S": dateTime.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt) || /(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      var r = new RegExp("(" + k + ")", "gi");
      if (r.test(fmt)) {
        //fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        fmt = fmt.replace(r, o[k] < 10 ? "0" + o[k] : "" + o[k]);
      }
    }
    return fmt;
  }
  return dateTime.Format(fmt);
}

//数组去重
export function distinctOfArray(sourceArray) {
  if (!sourceArray || sourceArray.length < 1) {
    return sourceArray;
  }
  var resultArray = [];
  sourceArray.map((item, index) => {
    if (item != '') {
      resultArray = [...resultArray.filter(A => A != item), item];
    }
  })
  return resultArray;
}

//数组乱选
export function randomOfArray(sourceArray) {
  var sWordsTemp = [];
  for (var k = 0; k < sourceArray.length; k++) {
    sWordsTemp.push(sourceArray[k]);
  }
  var sWords = [];
  while (sWordsTemp.length > 0) {
    var tempNum = parseInt(Math.random() * 10);
    if (sWordsTemp.length == 1)
      tempNum = 0;
    if (tempNum < sWordsTemp.length) {
      sWords.push(sWordsTemp[tempNum]);
      sWordsTemp.splice(tempNum, 1);
    }
  }
  return sWords;
}

//','分割的字符串拆分为数组（兼容为空）
export function split(source, char) {
  if (typeof (source) == 'undefined' || source == null) return [];
  char = (char || ',');
  let result = source.toString().split(char).filter(a => a != '');
  return result;
}

export function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
//正则验证 手机号
export function isValidMobile(phone: string, countryCode: number) {
  countryCode = !countryCode ? 86 : countryCode;
  var ipRegExp = '';
  if (countryCode == 86) {
    ipRegExp = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
  } else if (countryCode == 1) {
    //ipRegExp = /^(\s*\+?\s*(?<leftp>\()?\s*\d+\s*(?(leftp)\)))(\s*-\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/;
    ipRegExp = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/
  }
  if (ipRegExp.exec(phone)) {
    return true;
  } else {
    return false;
  }
}
//正则验证 邮箱
export function isValidEmail(email: string) {
  var ipRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (ipRegExp.exec(email)) {
    return true;
  } else {
    return false;
  }
}

//从app打包的图片中，获取背景图
export function getAppBg(isInOrder: boolean) {
  var length = 1;
  var list = [
    require('../../assets/1.jpg'),
  ]
  if (isInOrder) {
    //从保存的上一个开始，取下一个
  } else {
    var tempNum = parseInt(Math.random() * 1);
    //var name = '../../assets/backgrounds/' + tempNum + '.jpg';
    //var IMG = require(name);
    var IMG = list[tempNum];
    return IMG;
  }
}

// 时间转换成几分钟前，几小时前，几天前
export function formatMsgTime (comparedateTime:string) {
  var dateTime = new Date(comparedateTime.replace(/-/g,'/'));

  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = now.valueOf();  //typescript转换写法

  var milliseconds = 0;
  var timeSpanStr;

  milliseconds = now_new - dateTime.valueOf();

  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = YSI18n.get('just');
  }
  else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + YSI18n.get('minutesago');
  }
  else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + YSI18n.get('hoursago');
  }
  else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + YSI18n.get('daysago');
  }
  else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
  } else {
    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  }

  return timeSpanStr;
};

// permissionType: 1 语音； 2 摄像头
function _checkPermissionIOS(permissionType: number, callback: any){
  if (permissionType == 2) {
    SchoolearnModule.checkPermissionCamera(function (result) {
      if (result && result.is_success) {
        if (callback) {
          callback(true);
        }
      } else {
        if (callback) {
          callback(false);
        }
        //toast("请您在设置中，允许我们使用您手机的摄像头.");
      }
    })
  }
};
// permissionType: 1 语音； 2 摄像头
function _checkPermissionAndroid(permissionType: number, callback: any){
  //在低于Android 6.0的设备上，权限只要写在AndroidManifest.xml里就会自动获得，此情形下check和request 方法将始终返回true。
  //6.0以后的可以正确读取到是否有权限
  if (permissionType == 2) {
    SchoolearnModule.checkPermissionCamera(function (result) {
      //alert(JSON.stringify(result))
      if (result && result.is_success) {
        if (callback) {
          callback(true);
        }
      } else {
        if (callback) {
          callback(false);
        }
        //toast("请您在设置中，允许我们使用您手机的摄像头.");
      }
    })
  }

};
export function checkPermissionCamera(callback: any){
  if (Platform.OS == 'ios') {
    this._checkPermissionIOS(2, callback);
  } else {
    this._checkPermissionAndroid(2, callback);
  }
}
