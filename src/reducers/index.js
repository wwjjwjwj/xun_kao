
'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
    base: require('./base'),
    user: require('./user'),
    dic: require('./dic'),
    exam: require('./exam')
});
