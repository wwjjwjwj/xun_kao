
/*
* @flow
* @providesModule Util
*/

import YSI18n from 'YSI18n';
import {
  Platform,
  InteractionManager,
  PermissionsAndroid
} from 'react-native';
import SchoolearnModule from 'react-native-schoolearn';
import Geolocation from 'Geolocation';

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
    //ipRegExp = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
    ipRegExp = /^[1][3,4,5,7,8][0-9]{9}$/;
  } else if (countryCode == 1) {
    //ipRegExp = /^(\s*\+?\s*(?<leftp>\()?\s*\d+\s*(?(leftp)\)))(\s*-\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/;
    ipRegExp = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/
  }
  //if (ipRegExp.exec(phone))
  if (ipRegExp.test(phone))
  {
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
    _checkPermissionIOS(2, callback);
  } else {
    _checkPermissionAndroid(2, callback);
  }
}

export function getGeolocation(callback){
  var result = {};
  Geolocation.getCurrentPosition(val => {
        let ValInfo = "速度：" + val.coords.speed +
            "\n经度：" + val.coords.longitude +
            "\n纬度：" + val.coords.latitude +
            "\n准确度：" + val.coords.accuracy +
            "\n行进方向：" + val.coords.heading +
            "\n海拔：" + val.coords.altitude +
            "\n海拔准确度：" + val.coords.altitudeAccuracy +
            "\n时间戳：" + val.timestamp;
        result = {result: true, x: val.coords.longitude, y: val.coords.latitude}
        callback(result);
    }, val => {
        let ValInfo = '获取坐标失败：' + JSON.stringify(val);
        result = {result: false, msg : ValInfo};
        callback(result);
    });
}

//------------- md5

var hexcase = 0;
var b64pad = "";
var chrsz = 8;
function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}
function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz));
}
function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
}
function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
}
function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data));
}
function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}
function core_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16),
    opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}
function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    return bin;
}
function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
    return str;
}
function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF": "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
}
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
var lastInput;
function md5(text) {
    text = text.trim();
    var reg = /^[0-9a-f]{16}$|^[0-9a-f]{32}$/;
    reg.ignoreCase = true;
    if (reg.test(text.toLowerCase())) {
        ctl00_ContentPlaceHolder1_LabelResult.innerHTML = '';
    } else {
        var ret = hex_md5(text);
        ctl00_ContentPlaceHolder1_LabelResult.innerHTML = 'MD5(' + text + ',32) = ' + ret + '<br>';
        ctl00_ContentPlaceHolder1_LabelResult.innerHTML += 'MD5(' + text + ',16) = ' + ret.substr(8, 16);
        lastInput = text;
    }
}
function CheckInput() {
    var text = document.all["ctl00_ContentPlaceHolder1_TextBoxq"].value;
    text = text.trim();
    var reg = /^[0-9a-f]{16}$|^[0-9a-f]{32}$/;
    if (reg.test(text.toLowerCase())) {
        if (lastInput + "" != "undefined") {
            var result = hex_md5(lastInput);
            if (result.indexOf(text) >= 0) {
                ctl00_ContentPlaceHolder1_LabelResult.innerHTML = lastInput;
                return false;
            }
        } else {
            var lastResult = ctl00_ContentPlaceHolder1_LabelResult.innerHTML;
            var result = hex_md5(lastResult);
            if (result.indexOf(text) >= 0) {
                ctl00_ContentPlaceHolder1_LabelResult.innerHTML = lastResult;
                return false;
            }
        }
        ctl00_ContentPlaceHolder1_LabelResult.innerHTML = "Wait.....";
        return true;
    } else {
        md5(text);
        return false;
    }
}


export function md5_32(text: string){
  var md32 = hex_md5(text);
  var _upper = md32.toUpperCase();
  //alert(_upper);
  return _upper;
}

//-------------
