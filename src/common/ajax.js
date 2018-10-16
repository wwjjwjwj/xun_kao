/*
* 异步 提交请求到服务器
* @flow
*/

'use strict'

//import React from 'React';
//import { Component } from 'react-native';

import { serverURL, getToken, apiDebug, getLocale,
  getSchoolId, getFinger } from '../env';

//class Ajax extends React.Component{
module.exports = {

  //get请求
  /**
  *url :请求地址
  *callback:回调函数
  */
  get(url: string, callback: any) {
    var full_url = '';
    if (url.indexOf("http") >= 0) {
      full_url = url;
    } else {
      full_url = serverURL + url;
    }
    fetch(full_url)
      .then((response) => {
        response.text();
        //response.json();
      }).then((responseText) => {
        if (callback) {
          if (responseText) {
            callback(JSON.parse(responseText));
          } else {
            callback("");
          }
        }
      }).done();
  },

  /**
    *url :请求地址
    *data:参数(Json对象)
    *callback:回调函数
    */
  postJson(url: string, data: any, callback: any) {
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        //json形式
        //'Content-Type': 'application/json',
        'Content-Type': 'application/json.net',
        'token': getToken(),
        'locale': getLocale()//语言环境
      },
      body: JSON.stringify(data)
    };

    fetch(serverURL + url, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        callback(JSON.parse(responseText));
      }).done();
  },

  /**
      *url :请求地址
      *data:参数(Json对象)
      */
  async postJsonAsync(url: string, data: any): any {
    var param = {
      Finger: getFinger()
    };
    var school = "";
    for(var index in data){
      if(data[index] instanceof Array){
        param[index] = JSON.stringify(data[index]);
      }else {
        param[index] = data[index];
      }
      if(index == "SchoolId"){
        school = data[index];
      }
    };
    var _data = {
      RequestBaseData: {
        SchoolId: school || getSchoolId(),
        Token: getToken(),
        Finger: getFinger(),
        clientToken: '',
        Time: '2018-8-16 16:59:02.2222'
      },
      ParamData: param,
      //index: 1,
      //size: 999
    }
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        //json形式
        //'Content-Type': 'application/json',
        'Content-Type': 'application/json.net',
        'token': getToken(),
        'locale': getLocale()//语言环境
      },
      body: JSON.stringify(_data)
    };
    //alert(JSON.stringify(_data));

    try {
      let beginTime = new Date();
      let response = await fetch(serverURL + url, fetchOptions)
      let responseText = await response.text();
      //alert(JSON.stringify(responseText));
      if (response.status == 200) {
        var json = JSON.parse(responseText);
        if (apiDebug) {
          let api = "API->" + serverURL + url + " 传入参数:" + JSON.stringify(data);
          //console.log(api +" "+beginTime);
          //console.log("[postJsonAsync][responseText]" + responseText);
          //console.log("[postJsonAsync][json]" + json);
          //let now=new Date();
          //console.log("API耗时:"+(now-beginTime)+"ms");
        }
        if(json.State == 1){
          json.result = true;
        }
        return json;
      }
      else if (response.status == 401) {
        console.log("[postJsonAsync]" + responseText);
        return { result: false, message: '认证超时,重新登录!', data: 401 };
      }
      else {
        console.log("[postJsonAsync]" + responseText);
        return { result: false, message: '您的网络质量不佳!' };
      }
      //let responseText = await fetch(serverURL + url, fetchOptions).text();
    } catch (e) {
      console.log("[postJsonAsync]" + e);
    }
  },

  async promisePostJson(api, postData) {
    var res = await module.exports.postJsonAsync(api, postData);
    let actionPromise = new Promise(function (resolve, reject) {
      if (res && res.result) {
        resolve(res)//在异步操作成功时调用
      }
      else {
        reject(res);//在异步操作失败时调用
      }
    });
    return actionPromise;
  },
  //post请求
  /**
  *url :请求地址
  *data:参数
  *callback:回调函数
  */
  postForm(url: string, data: any, callback: any) {
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        //表单
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': getToken(),
        'locale': getLocale()//语言环境
      },
      body: 'data=' + data + ''
    };

    fetch(serverURL + url, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        callback(JSON.parse(responseText));
      }).done();
  },
  //上次文件列表(音频 或 图片)到服务器
  async postFilesAsync(url: string, fileArray: Array<Object>) {
    let formData = new FormData();    //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
    //var file_type = 'multipart/form-data';
    //image/jp
    //image/png
    var records = [];
    for (var i = 0; i < fileArray.length; i++) {
      var r = fileArray[i];
      var file_type = r.AttachmentType == 2 ? 'audio/mp3' : 'image/jpg';
      let file = { uri: r.path, type: file_type, name: r.name };   //这里的key(uri和type和name)不能改变,
      formData.append("files", file);   //这里的files就是后台需要的key
      var record = {
        CourseUnitType: r.CourseUnitType,   //5 看图造句
        CourseID: r.CourseID,//"34ed0eb1faf444a28d731ed6ae90273c",
        CourseUnitID: r.CourseUnitID,
        CourseWareID: r.CourseWareID,
        //FileName: r.FileName,
        AttachmentType: r.AttachmentType,
        MediaSize: r.MediaSize
      }
      records.push(record);
    }
    //formData.append("type", 7);
    var str = JSON.stringify(records);
    formData.append("records", str);

    var fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'token': getToken()
      },
      body: formData
    };

    try {
      let response = await fetch(serverURL + url, fetchOptions);
      if (response) {
        var c = 0;
      }
      let responseText = await response.text();
      if (responseText) {
        var d = 0;
      }
      if (response.status == 200) {
        var json = JSON.parse(responseText);
        return json;
      } else {
        console.log("[postFilesAsync]上传文件出错啦啦啦啦：" + response.error)
      }
    } catch (e) {
      console.log("[postFilesAsync]" + e);
    }
  }

}

//module.exports = Ajax;
