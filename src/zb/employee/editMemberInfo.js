/*
 * @flow
 * @providesModule editMemberInfo
 */

'use strict';

import React, { Component } from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, View, Text, Typography, BorderRadiuses, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { DatePicker, List } from 'antd-mobile-rn';



//部门
const departs = [
    { label: '人事部', value: '0' },
    { label: '财务部', value: '1' },
    { label: '研发部', value: '2' },
    { label: '销售部', value: '3', },
    { label: '保卫部', value: '4' },
];

//角色
const roles = [
    { label: '总经理', value: '0' },
    { label: 'ＣＥＯ', value: '1' },
    { label: '董事长', value: '2' },
    { label: '财务经理', value: '3' },
    { label: '法人代表', value: '4' },
];

//职务
const offers = [
    { label: '总经理', value: '0' },
    { label: 'ＣＥＯ', value: '1' },
    { label: '董事长', value: '2' },
    { label: '财务经理', value: '3' },
    { label: '法人代表', value: '4' },
];

const datas = [
    {
        surname: "李小青",
        name: '小青',
        role: "总经理",
        sex: '男',
        depart: "信息化部门",
        state: '在职',
        mobile: '18673679789',
        email: 'guxq@shenmo.com',
        entry: '2018-06-06',
        password: '******',
        id: '20170601001',
        thumbnail: "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },


]
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const CustomChildren = ({ extra, onClick, children }) => (
    <View onClick={onClick} style={[styles.hasborderline]}>
        {children}
        <Text text70 dark10 marginB-10>{extra}</Text>
    </View>
);

class editMemberInfo extends React.Component {
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
            language: undefined,
            visible: false,
            date: now,
            sex: '男',
            roles: [{ label: '总经理', value: '0' }],
            depart: { label: '财务部', value: '1' },
            offer: { label: 'ＣＥＯ', value: '1' }

        };
        Colors.loadColors({
            blue30: YSColors.AppMainColor,
        });

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
        const surenameValidator = this.getTextInputValidator('surname', false, (text) => {
            return (text.length >= 8);//姓氏
        })
        const nameValidator = this.getTextInputValidator('name', false, (text) => {
            return (text.length >= 8);//名字
        })
        const accounterValidator = this.getTextInputValidator('account', false, (text) => {
            return (text.length >= 8);//账号
        })
        const emailValidator = this.getTextInputValidator('email', false, (text) => {
            return (text.length >= 8);//12位员工号
        })
        const passwordValidator = this.getTextInputValidator('password', false, (text) => {
            return (text.length >= 6);//最少6位密码
        })
        const mobileValidator = this.getTextInputValidator('mobile', false, (text) => {
            return (text.length >= 6);//最少11位数字
        })

        return (
            <View paddingT-s6  >
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('姓氏')}
                            helperText={YSI18n.get('请输入姓氏')}
                            maxLength={20}
                            value={datas[0].surname}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...nameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('名字')}
                            helperText={YSI18n.get('请输入名字')}
                            maxLength={20}
                            value={datas[0].name}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={this.state.sex} onValueChange={value => this.setState({ sex: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('性别')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('男', '男')}
                                {this.renderRadioButton('女', '女')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('部门')}
                            value={this.state.depart}
                            onChange={item => this.setState({ depart: item })}
                            rightIconSource={Assets.icons.dropdown}

                        >
                            {_.map(departs, option => <Picker.Item key={option.value} value={option} label={option.label} disabled={option.disabled} />)}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('职务')}
                            value={this.state.offer}
                            onChange={item => this.setState({ offer: item })}
                            rightIconSource={Assets.icons.dropdown}

                        >
                            {_.map(offers, option => <Picker.Item key={option.value} value={option} label={option.label} disabled={option.disabled} />)}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={[styles.field_wrap, { height: 90 }]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('账号')} value={datas[0].id} textstyle={styles.disableColor} />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...mobileValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('手机')}
                            helperText={YSI18n.get('请输入手机')}
                            maxLength={11}
                            value={datas[0].mobile}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...emailValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('邮箱')}
                            helperText={YSI18n.get('请输入邮箱')}
                            maxLength={20}
                            value={datas[0].email}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={[styles.field_wrap, { height: 90 }]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('密码')} value={datas[0].password} />
                        <Button
                            backgroundColor={YSColors.AppMainColor}
                            size='small'
                            outline
                            text70
                            style={styles.button_reset}
                            borderRadius={9}
                            label={YSI18n.get('重置')}
                            onPress={() => this.props.reset()} />
                    </View>

                    <View style={styles.Wing_blank}></View>
                </View>
                <View centerV row style={[styles.field_wrap, { height: 90 }]} >
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View style={[styles.box_middle, { flex: 1 }]} >
                        <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ visible: true })}>
                            <DatePicker
                                visible={this.state.visible}
                                mode="date"
                                title={YSI18n.get('选择入职日期')}
                                extra="Optional"
                                value={this.state.date}
                                onOk={date => this.setState({ dpValue: date, visible: false })}
                                onDismiss={() => this.setState({ visible: false })}
                                onChange={date => this.setState({ date })}
                            >
                                <CustomChildren >
                                    <Text marginB-10 text90 dark40>
                                        {YSI18n.get('入职')}
                                    </Text>
                                </CustomChildren>
                            </DatePicker>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View >

                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('角色')}
                            value={this.state.roles}
                            onChange={items => this.setState({ roles: items })}
                            mode={Picker.modes.MULTI}
                            rightIconSource={Assets.icons.dropdown}
                            style={{ marginBottom: 10 }}
                        >
                            {_.map(roles, option => <Picker.Item key={option.value} value={option} disabled={option.disabled} />)}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={datas[0].state} onValueChange={value => this.setState({ state: value })}>
                            <Text marginB-20 text90 dark40>
                                {YSI18n.get('状态')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('在职', '在职')}
                                {this.renderRadioButton('离职', '离职')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle} >
                        <Text text90 dark40 marginB-20>
                            {YSI18n.get('头像')}
                        </Text>

                        {/* 添加头像 */}
                        <TouchableOpacity activeOpacity={1}>
                            <Image source={Assets.icons.addUserPhoto} style={styles.img_add} />
                        </TouchableOpacity>

                        {/* 编辑时的头像显示 */}
                        {/* 
                        　　<TouchableOpacity activeOpacity={1}>
                            <Image source={{ uri: datas[0].thumbnail }} style={styles.img_user} />
                           </TouchableOpacity> 
                        */}
                    </View>
                </View>

            </View >

        );
    }

    ondel() {
        Alert.alert(
            YSI18n.get('友情提示'),
            YSI18n.get('你确定要删除此部门吗？点击确定按钮删除此部门'),
            [
                { text: YSI18n.get('取消'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: YSI18n.get('确定'), onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
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
            label={YSI18n.get('Delete')}
            onPress={() => this.ondel()} />

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
                        {block_whitespace}
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
    }





});


module.exports = editMemberInfo;
