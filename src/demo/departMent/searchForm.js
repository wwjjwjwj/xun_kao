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



//所属上级
const supers = [
    { label: '运营中心', value: '0' },
    { label: '服务中心', value: '1' },
    { label: '技术中心', value: '2' },
    { label: '研发中心', value: '3', },
]
//部门名称
const departs = [
    { label: '人事部', value: '0' },
    { label: '财务部', value: '1' },
    { label: '研发部', value: '2' },
    { label: '销售部', value: '3', },
    { label: '保卫部', value: '4' },
];


class searchForm extends React.Component {
    state: State;


    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
            super: { label: '服务中心', value: '1' },
            state: '启用',
            depart: { label: '财务部', value: '1' },
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
        //表单验证器
        const surenameValidator = this.getTextInputValidator('departName', false, (text) => {
            return (text.length >= 8);//姓氏
        })

        return (
            <View paddingT-s6  >
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('部门名称')}
                            value={this.state.depart}
                            onChange={item => this.setState({ depart: item })}
                            rightIconSource={Assets.icons.dropdown}
                            topBarProps={{ doneLabel: YSI18n.get('确定'), cancelLabel: YSI18n.get('取消') }}
                        >
                            {_.map(departs, option => <Picker.Item key={option.value} value={option} label={option.label} disabled={option.disabled} />)}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('所属上级')}
                            value={this.state.super}
                            onChange={item => this.setState({ super: item })}
                            rightIconSource={Assets.icons.dropdown}
                        >
                            {_.map(supers, option => <Picker.Item key={option.value} value={option} label={option.label} disabled={option.disabled} />)}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={this.state.state} onValueChange={value => this.setState({ state: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('当前状态')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('启用', '启用')}
                                {this.renderRadioButton('停用', '停用')}
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
            onPress={() => this.props.search()} />

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
                <View paddingH-s4>
                    {this.renderList()}
                    {block_button_search}
                </View>
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
        width: 13,
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
