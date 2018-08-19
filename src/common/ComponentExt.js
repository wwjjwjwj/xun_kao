
/*
* @flow
* @providesModule ComponentExt
*/

/*
   组件实例方法扩展，将Component经常复用的一下方法归纳使用。
*/
import React from 'react';
import YSI18n from 'YSI18n';
import { Colors } from 'react-native-ui-lib'; //eslint-disable-line
import YSColors from 'YSColors';
export const dismissKeyboard = require('dismissKeyboard');

export function initFormValid(fieldStateNames) {
  fieldStateNames = fieldStateNames || [];
  fieldStateNames.map((stateName) => {
    let state = this.state;
    let text = eval(`(state.${stateName})`);
    if ((text || '') === '') {
      let stateObj = eval(`({${stateName}Error:true})`);
      this.setState(stateObj);
    }
    else {
      let stateObj = eval(`({${stateName}Error:false})`);
      this.setState(stateObj);
    }
  });
}

//表单条件有效性检查
export function getFormValid(fieldStateNames) {
  fieldStateNames = fieldStateNames || [];
  let isValid = true;
  fieldStateNames.map((stateName) => {
    let state = this.state;
    let itemValid = eval(`(state.${stateName}Error)`);
    if (itemValid === true || typeof (itemValid) === 'undefined') {
      isValid = false;
    }
  })
  return isValid;
}
export function getTextInputValidator(stateName, require, validRule) {
  var validator = {
    text70: true,//输入框文字大小设置
    underlineColor: { focus: YSColors.AppMainColor, error: Colors.red30 },//底线颜色设置
    floatingPlaceholderColor: { default: Colors.dark40, focus: YSColors.AppMainColor, error: Colors.red30 },
    onFocus: () => {
      let stateObj = eval(`({${stateName}ErrorMessage:''})`);
      this.setState(stateObj);
    },
    onBlur: () => {
      let state = this.state;
      let text = eval(`(state.${stateName})`);
      if (require && (text || '') === '') {
        let emptyError = YSI18n.get(`${stateName}_empty`);
        let stateObj = eval(`({${stateName}ErrorMessage:emptyError,${stateName}Error:true})`);
        this.setState(stateObj);
        return;
      }
      else if (text === '' && !require) {
        let stateObj = eval(`({${stateName}ErrorMessage:'',${stateName}Error:true})`);
        this.setState(stateObj);
        return;
      }
      //如果有验证规则，且验证失败
      if (validRule && !validRule(text || '')) {
        let formatError = YSI18n.get(`${stateName}_error`);
        let stateObj = eval(`({${stateName}ErrorMessage:formatError,${stateName}Error:true})`);
        this.setState(stateObj);
        return;
      }
      //验证通过
      let stateObj = eval(`({${stateName}ErrorMessage:'',${stateName}Error:false})`);
      this.setState(stateObj);
    },
    onChangeText: (text) => {
      let stateObj = eval(`({${stateName}:text})`);
      if (validRule && validRule(text)) {
        let stateObj = eval(`({${stateName}ErrorMessage:'',${stateName}Error:false})`);
        this.setState(stateObj);
      }
      this.setState(stateObj);
    },
    error: this.state[`${stateName}ErrorMessage`]
  }
  return validator;
}

//载入业务字典，支持多个业务字典同时加载
export function loadBizDictionary(dicTypes: Array) {
  //把不在缓存中的字典筛选出来
  let needLoadDicTypes = [];
  //准备接收对象，一起将对象下的字典属性字典导入到state中
  let stateDicTypes = {};
  dicTypes.map((item) => {
    //通过动态计算取值
    let findItem = this.props.Dictionarys[item];
    if (!findItem && item != 'dic_Status' && item != 'dic_YesNo'
      && item != 'dic_Allow' && item != 'dic_OrgType'
      && item != 'dic_sex'
    ) {//状态字典默认不提供，需要虚拟
      needLoadDicTypes.push(item);
      findItem = [];//提前占位，等待服务端加载更新
    }
    else if (item == 'dic_Status') {//启用停用类型
      findItem = [{ title: YSI18n.get('dic_Status_1'), value: '1', state: 1 }, { title: YSI18n.get('dic_Status_0'), value: '0', state: 1 }]
    }
    else if (item == 'dic_YesNo') {//是否类型
      findItem = [{ title: YSI18n.get('dic_YesNo_1'), value: '1', state: 1 }, { title: YSI18n.get('dic_YesNo_0'), value: '0', state: 1 }]
    }
    else if (item == 'dic_Allow') {//是否类型
      findItem = [{ title: YSI18n.get('dic_Allow_1'), value: '1', state: 1 }, { title: YSI18n.get('dic_Allow_0'), value: '0', state: 1 }]
    }
    else if (item == 'dic_Sex') {
      findItem = [{ title: YSI18n.get('dic_Sex_1'), value: '1', state: 1 }, { title: YSI18n.get('dic_Sex_2'), value: '2', state: 1 }]
    }
    //动态设置属性值
    eval(`stateDicTypes.${item}=findItem`);
  });
  if (stateDicTypes) {
    //用于清除缓存中的 字典添加了其他项的数据（比如“全部”等）
    for (var d in stateDicTypes) {
      if (stateDicTypes[d] && stateDicTypes[d].length) {
        for (var i = 0; i < stateDicTypes[d].length; i++) {
          var s = stateDicTypes[d][i];
          if (s.title && s.value == "") {
            stateDicTypes[d].splice(i, 1);
            break;
          }
        }
      }
    }
  }
  //先按照要求将字典推入state中（不存在的字典先空数组占位）
  this.setState({ ...stateDicTypes });
  //远程请求加载不存在的字典
  if (needLoadDicTypes.length > 0) {
    this.props.loadDictionary(needLoadDicTypes).then(res => {
      //请求完 成后更新到state数据    
      this.setState({ ...res.data })
    }).catch(err => {
    })
  }
}

//处理搜索事件
export function onSearch(resetOptions) {
  //重新查询时重置到第一页
  if (resetOptions) {
    this.state.pagingSearch.pageIndex = 1;
  }
  let pagingSearch = this.state.pagingSearch;
  this.fetch(pagingSearch);
}

//处理分页事件
export function onPageIndexChange(pageIndex, pageSize) {
  let pagingSearch = this.state.pagingSearch;
  pagingSearch.pageIndex = pageIndex;
  this.setState({ pagingSearch });
  setTimeout(() => {
    //重新查找
    this.onSearch();
  }, 100);
}

//处理调整页面大小
export function onShowSizeChange(current, size) {
  let pagingSearch = this.state.pagingSearch;
  pagingSearch.pageSize = size;
  pagingSearch.pageIndex = 1;//重置到第一页
  this.setState({ pagingSearch });
  setTimeout(() => {
    //重新查找
    this.onSearch();
  }, 100);
}