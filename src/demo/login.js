/*
 * @flow
 * @providesModule login
 */

'use strict';

import React from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { View, Colors, Text, TextInput, TextArea, Typography, Modal, Button, Toast, Assets, Image, } from 'react-native-ui-lib';


const INPUT_SPACING = 10;
class login extends React.Component {
    state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            password: '',
            disabled: true,

        };

    };
    componentDidMount() {

    };
    componentWillUnmount() {

    };
    _login() {
        Toast.info(YSI18n.get('对不起，您输入的账号不存在'));
    }


    _validEmail = () => {

    }

    render() {
        let block_email = <TextInput
            text70
            containerStyle={{ marginBottom: INPUT_SPACING }}
            floatingPlaceholder
            placeholder={YSI18n.get('请输入账号')}
            onChangeText={text => this.setState({ error: text ? '' : 'accounter is required' })}
            error={this.state.error}
        />

        let block_password = <TextInput
            text70
            maxLength={6}
            secureTextEntry
            containerStyle={{ marginBottom: 40 }}
            floatingPlaceholder
            placeholder={YSI18n.get('请输入密码')}
            onChangeText={text => this.setState({ error: text ? '' : 'password is required' })}
            error={this.state.error}
        />

        let block_button_login = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            outline
            text60
            borderRadius={9}
            style={{width:'100%',height:48}}
            label={YSI18n.get('登录')}
            disabled={this.state.disabled}
            onPress={() => this._login()} />


        return (
            <ScrollView keyboardShouldPersistTaps="always">
                <View centerH paddingH-s7 flex paddingT-87 >
                   <View marginB-60><Image source={Assets.LOGO.App_Logo} style={{width:120,height:152,resizeMode:'contain'}} /></View>
                    <View style={{ width: '100%', } }>
                        {block_email}
                        {block_password}
                    </View>
                    {block_button_login}
                </View>
            </ScrollView>

        );
    }
};

module.exports = login;
