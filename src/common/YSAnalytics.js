/*
* @flow
* @providesModule YSAnalytics
*/

'use strict';
import JAnalyticsModule from 'janalytics-react-native';

import { testEnabled, JPUSHID } from '../env'

/**
 * IOS 初始化
 */
export const IOSInit = () => {
  JAnalyticsModule.setup({ appKey: JPUSHID })
  JAnalyticsModule.setDebug({ enable: true })
  JAnalyticsModule.crashLogON();
};

/**
 * 登录事件
 */
export const onLoginPress = (loginName, isSuccess) => {
  var LoginEvent = {
    type: 'login',
    extra: {
      userId: loginName || ''
    },
    method: "login",
    success: isSuccess || true
  };
  JAnalyticsModule.postEvent(LoginEvent);
}


/**
 * 注册事件
 */
export const onRegisterPress = (loginName, isSuccess) => {
  var RegisterEvent = {
    type: "register",
    extra: {
      userId: loginName || ''
    },
    method: "register",
    success: isSuccess || true
  };
  JAnalyticsModule.postEvent(RegisterEvent);
}


/**
 * 支付事件
 */
export const onPurchasePress = (loginName, productId, productName, price) => {
  var PurchaseEvent = {
    goodsId: productId || '',
    type: 'purchase',
    extra: {
      userId: loginName || ''
    },
    goodsType: 'order',
    goodsName: productName,
    price: parseInt(price || 0),
    currency: 'CNY',
    count: 1,
    success: true
  };
  JAnalyticsModule.postEvent(PurchaseEvent);
}


/**
 * 计数事件
 */
export const onCountPress = (loginName, eventID) => {
  var CountEvent = {
    id: eventID,
    extra: {
      userId: loginName
    },
    type: 'count'
  };
  JAnalyticsModule.postEvent(CountEvent);
}

/**
 * 计算事件
 */
export const onCalculatePress = (loginName, eventID, value) => {
  var CalculateEvent = {
    id: eventID,
    extra: {
      userId: loginName
    },
    type: 'calculate',
    value: parseInt(value)
  };
  JAnalyticsModule.postEvent(CalculateEvent);
}

/**
 * 浏览事件
 */
export const onBrowsePress = (loginName, resouceID, resourceName, resourceType, duration) => {
  var BrowseEvent = {
    id: resouceID,
    name: resourceName,
    type: 'browse',
    extra: {
      userId: loginName
    },
    contentType: resourceType,
    duration: parseInt(duration)
  };
  JAnalyticsModule.postEvent(BrowseEvent);
}

/**
* 页面访问进入计时开始
*/
export const startLogPageView = (pageName) => {
  var param = {
    pageName: pageName
  };
  JAnalyticsModule.startLogPageView(param);
}

/**
* 页面访问退出计时结算
*/
export const stopLogPageView = (pageName) => {
  var param = {
    pageName: pageName
  };
  JAnalyticsModule.stopLogPageView(param);
}
