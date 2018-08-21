//@flow

'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import LoginByEmail from './login_by_email';              //邮箱登录
import ResetPassword from './reset_password';              //邮箱登录

const Login = StackNavigator({
    loginByEmail: {
        screen: LoginByEmail,
        navigationOptions: ({ navigation }) => ({
            header: null,
        })
    },
    resetPassword: {
        screen: ResetPassword,
        navigationOptions: ({ navigation }) => ({
            header: null,
        })
    }
});
module.exports = Login;
