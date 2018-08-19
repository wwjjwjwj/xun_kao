'use strict';

import React, { Component } from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Dialog, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
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

const datas = [
    {
        "department": "信息化部门",
        "Superior": '运营中心',
        "online": 6,
        "state": '启用',
    }
]

class editDepartInfo extends React.Component {
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
            showDialogDelete: false,
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
    renderDialogContent(dialogIndex, extraProps) {
        return (
            <View bg-white flex br20 padding-18 center spread {...extraProps}>
                <Text text50>{YSI18n.get('友情提示')}</Text>
                <Text>你确认删除此部门吗？点击确认按纽删除！</Text>
                <View row center>
                    <Button text60 label={YSI18n.get('取消')} link onPress={() => this.setState({ [`showDialog${dialogIndex}`]: false })} />
                    <Button text60 label={YSI18n.get('确认')} link onPress={() => this.setState({ [`showDialog${dialogIndex}`]: false })} />
                </View>
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
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('部门名称')}
                            helperText={YSI18n.get('请输入部门名称')}
                            maxLength={20}
                            value={datas[0].department}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('所属上级')}
                            value={this.state.super}
                            onChange={value => this.setState({ super: value })}
                            rightIconSource={Assets.icons.dropdown}
                        >
                            {_.map(supers, option => <Picker.Item key={option.value} value={option.value} label={option.label} disabled={option.disabled} />)}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row style={[styles.field_wrap, { height: 90 }]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('部门人数')} value={datas[0].online} textstyle={styles.disableColor} />
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
    ondel() {
        Alert.alert(
             YSI18n.get('友情提示'),
             YSI18n.get('你确定要删除此部门吗？点击确定按钮删除此部门'),
            [
                { text: YSI18n.get('取消'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text:  YSI18n.get('确定'), onPress: () => console.log('OK Pressed') },
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
            label={YSI18n.get('删除')}
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


module.exports = editDepartInfo;
