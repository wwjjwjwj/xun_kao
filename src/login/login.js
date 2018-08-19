//@flow

'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import LoginInput from './login_by_email';              //邮箱登录

const Login = StackNavigator({
    LoginInput: {
        screen: LoginInput,
        navigationOptions: ({ navigation }) => ({
            header: null,
        })
    }
});
module.exports = Login;
