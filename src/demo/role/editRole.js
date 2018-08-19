/*
 * @flow
 * @providesModule EditRole
 */

'use strict';

import React, { Component } from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
import { Tree } from '../../common/YSTree'



//所属上级
const supers = [
    { label: '运营中心', value: '0' },
    { label: '服务中心', value: '1' },
    { label: '技术中心', value: '2' },
    { label: '研发中心', value: '3', },
]

const datas = [
    {
        "name": "教务管理",
        "description": '文字输入，角色描述，字数太多？正常显示即可，自动折行，调整距离设备的间距。',
        "funDescription": '1、系统管理：用户权限管理、操作用户管理； 2、教师信息管理：授课教师管理',
        "state": '启用',

    }
]

export const treeData = [
    {
        key: 'food',
        label: '权限功能',
        children: [
            {
                key: 'mainfood',
                label: '系统管理',
                children: [
                    {
                        key: 'noodle',
                        label: '用户权限管理',
                    },
                    {
                        key: 'rice',
                        label: '操作用户管理',
                    },

                ]
            },
            {
                key: 'fruit',
                label: '教室管理',
                children: [
                    {
                        key: 'apple',
                        label: '教室信息管理',
                    },
                    {
                        key: 'xigua',
                        label: '教室日程表',
                    },

                ]
            }
        ]
    }
];


class EditRole extends React.Component {
    state: State;

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <Button label={YSI18n.get('保存')} link marginR-s4 onPress={() => this.save()} />
            ),
        }
    }
    constructor(props: Props) {
        super(props);

        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
            super: { label: '服务中心', value: '1' },
            state: '启用',
            isOpen: false,
            selectedKeys: [],
            expandedKeys: [],
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
                <View row centerV style={[styles.field_wrap]} >
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('角色名称')}
                            helperText={YSI18n.get('请输入角色名称')}
                            maxLength={20}
                            value={datas[0].name}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV marginB-32 style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            multiline
                            floatingPlaceholder
                            placeholder={YSI18n.get('角色描述')}
                            helperText={YSI18n.get('请输入角色描述')}
                            maxLength={150}
                            value={datas[0].description}
                            style={{ marginTop: 14 }}
                            showCharacterCounter
                        />
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

                <View row centerV >
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <Text marginB-10 text90 dark40 >
                            {YSI18n.get('功能权限')}
                        </Text>

                        <Tree
                            nodeStyle={{ fontSize: 16, color: YSColors.default_color,lineHeight:30 }}
                            treeStyle={{ height:230 }}
                            checkable={true}
                            defaultExpandAll
                            onSelect={value => this.setState({ selectedKeys: value })}
                            onExpand={value => this.setState({ expandedKeys: value })}
                            treeData={treeData}
                        />

                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
            </View >

        );
    }

    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>

        let block_button_del = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            outline
            text60
            marginB-s4
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('删除')}
            onPress={() => this.props.del()} />

        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewCallback()
                    }}
                    onDone={() => {
                        let dataModel = {};
                        this.props.viewCallback(dataModel)
                    }}
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={YSI18n.get('Save')}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4>
                        {this.renderList()}
                        {block_button_del}
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
    },
    tree_wrap: {
        height: 100,

    }





});


module.exports = EditRole;
