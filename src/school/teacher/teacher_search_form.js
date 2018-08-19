'use strict';

import React, { Component } from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { DatePicker, List } from 'antd-mobile-rn';

class searchForm extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
          realName: '',
          userName: '',
          mobilePhone: '',
          teacherStatus: -1,
          teacherCertificate: -1,
        };
    };

    renderRadioButton(value, text) {
        return (
            <View row centerV marginB-5 >
                <RadioButton value={value} />
                <Text marginL-15 marginR-50>{text}</Text>
            </View>
        );
    }

    renderList() {

        return (
            <View paddingT-s6  >
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('姓名')}
                            helperText={YSI18n.get('请输入姓名')}
                            maxLength={20}
                            value={this.state.realName}
                            onChangeText={value => {
                              this.setState({realName: value})
                            }}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('账号')}
                            helperText={YSI18n.get('请输入账号')}
                            maxLength={20}
                            value={this.state.userName}
                            onChangeText={value => {
                              this.setState({userName: value})
                            }}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('手机号')}
                            helperText={YSI18n.get('请输入手机号')}
                            maxLength={20}
                            value={this.state.mobilePhone}
                            onChangeText={value => {
                              this.setState({mobilePhone: value})
                            }}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.teacherStatus)}
                          onValueChange={value => this.setState({ teacherStatus: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('教师资格证')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('-1', '全部')}
                                {this.renderRadioButton('1', '有')}
                                {this.renderRadioButton('0', '无')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.teacherCertificate)}
                          onValueChange={value => this.setState({ teacherCertificate: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('状态')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('-1', '全部')}
                                {this.renderRadioButton('1', '在职')}
                                {this.renderRadioButton('0', '离职')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
            </View >

        );
    }

    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>
        let block_button_search = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            text60
            marginB-s4
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('搜索')}
            onPress={() => this.props.search(this.state)} />

        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewCallback()
                    }}

                    cancelButtonProps={{ iconStyle: { tintColor: Colors.blue30 } }}
                    doneLabel={null}
                />

                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View  marginH-s4>
                        {this.renderList()}
                        {block_button_search}
                    </View>
                </KeyboardAwareScrollView>
            </View>

        );
    }
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    hasborderline: {
        borderBottomWidth: 1,
        borderColor: Colors.dark70
    },
    whitespace: {
        height: 33,
    },
    button_wrap: {
        width: '100%',
        marginTop: 30
    },
    noborder: {
        borderBottomWidth: 0,
    },
    button_reset: {
        position: 'absolute',
        right: 0,
        top: 5,
    },
    img_user: {
        width: 92,
        height: 92,
        resizeMode: 'cover',
        borderRadius: 9

    },
    Wing_blank: {
        width: 0,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    field_wrap: {
        height: 92,
    },
    box_middle: {
        height: '100%',
    },
    ico_dropdown: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        position: 'absolute',
        top: 5,
        right: 0,
    },
    disableColor: {
        color: Colors.dark40,
    },
    modalTitle: {
        fontSize: 17,
        color: Colors.dark10,
    }
});

module.exports = searchForm;
