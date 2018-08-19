
'use strict';

import {applyMiddleware, createStore} from 'redux';
import {AsyncStorage} from 'react-native';
import {persistStore, autoRehydrate} from 'redux-persist';
import thunk from 'redux-thunk';
var createLogger = require('redux-logger');
var reducers = require('../reducers');

import promise from './promise';
import array from './array';

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var createAppStore = applyMiddleware(thunk, promise, array)(createStore);

function configureStore(onComplete: ?() => void){
  const store = autoRehydrate()(createAppStore)(reducers);
  persistStore(store, {storage: AsyncStorage}, onComplete);
  if(isDebuggingInChrome){
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
