
'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
    user: require('./user'),
    dic: require('./dic'),
    menu: require('./menu'),
    notice: require('./notice'),
    zixun: require('./zixun'),
    //organization: require('./organization'),
});
