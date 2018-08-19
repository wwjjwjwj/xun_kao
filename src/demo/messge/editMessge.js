/*
 * @flow
 * @providesModule editMessge
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
import { ActionSheet } from 'antd-mobile-rn';
import SelectAuditPerson from './selectAuditPerson'

const datas = [
    {
        receiver: "李小青",
        auditor: '小青',
        title: "消息标题",
        isTop: '是',
        description: '消息内容消息内容消息内容消息内容',
    },
]

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class editMessge extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
            visible: false,
            showActionSheet: false,
            isTop: '是',
            enableSend: false,
            showSelectPerson: false,
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
        const surenameValidator = this.getTextInputValidator('surname', false, (text) => {
            return (text.length >= 8);//姓氏
        })


        return (
            <View paddingT-s6  >
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('接收人')} value={datas[0].receiver} />
                        <TouchableOpacity style={[styles.touch_img_right, { top: 22 }]} onPress={() => this.props.addSender()}>
                            <Image source={Assets.icons.small_add} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('审核人')} value={datas[0].auditor} />
                        <TouchableOpacity style={[styles.touch_img_right, { top: 22 }]} onPress={() => this.setState({ showSelectPerson: true })}>
                            <Image source={Assets.icons.small_add} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('标题')}
                            helperText={YSI18n.get('请输入标题')}
                            maxLength={20}
                            value={datas[0].title}
                        />
                        <TouchableOpacity style={styles.touch_img_right}>
                            <Image source={Assets.icons.link_color} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={[styles.field_wrap, { height: 70 }]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={[styles.box_middle, styles.hasborderline]}>
                        <RadioGroup value={this.state.isTop} onValueChange={value => this.setState({ isTop: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('是否置顶')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('是', '是')}
                                {this.renderRadioButton('否', '否')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View centerV row marginV-16 style={[styles.field_wrap]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            multiline
                            floatingPlaceholder
                            placeholder={YSI18n.get('内容')}
                            helperText={YSI18n.get('请输入内容')}
                            value={datas[0].description}
                            style={{ marginTop: 10 }}
                            showCharacterCounter
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
            </View >

        );
    }

    renderProfile() {
        return <View row cener marginH-5 marginB-10 style={{ flexWrap: 'wrap' }}>
            <View marginH-5 marginB-10 style={{ width: (YSWHs.width_window ) / 2-32, }}>
                <TouchableOpacity style={{ height: YSWHs.width_window / 3.4 }}>
                    <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} width={'100%'} height={'100%'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.img_close}>
                    <Image source={Assets.icons.close} />
                </TouchableOpacity>
            </View>
            <View marginH-5 marginB-10 cell center style={{ width: (YSWHs.width_window ) / 2-32 }}>
                <TouchableOpacity style={styles.touch_add} onPress={() => this.showActionSheetPhoto()}>
                    <Image source={Assets.icons.add_file} />
                </TouchableOpacity>
            </View>

        </View>
    }
    showActionSheet = () => {
        const BUTTONS = [YSI18n.get('存储草稿'), YSI18n.get('删除草稿'), YSI18n.get('Cancel')];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
            wrapProps,
        },
            (buttonIndex) => {
                this.props.viewCallback()
                this.setState({ clicked: BUTTONS[buttonIndex] });
            });
    }
    showActionSheetPhoto = () => {
        const BUTTONS = [YSI18n.get('拍照'), YSI18n.get('从手机相册选择'), YSI18n.get('Cancel')];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
            wrapProps,
        },
            (buttonIndex) => {
                this.props.viewCallback()
                this.setState({ clicked: BUTTONS[buttonIndex] });
            });
    }

    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>


        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.showActionSheet()
                    }}
                    onDone={() => {
                        let dataModel = {};
                        if (this.state.enableSend) {
                            this.props.viewCallback(dataModel)
                        }

                    }}
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={YSI18n.get('发送')}
                    doneButtonProps={this.state.enableSend ? { color: Colors.blue30 } : { color: Colors.dark60 }}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4>
                        {this.renderList()}
                        {this.renderProfile()}
                    </View>
                </KeyboardAwareScrollView>
                {/* 添加接收人  */}
                <Modal onRequestClose={() => this.setState({ showSelectPerson: false })} visible={this.state.showSelectPerson} animationType={'slide'}>
                    <View bg-white flex>
                        <SelectAuditPerson viewCallback={() => this.setState({ showSelectPerson: false })} />
                    </View>
                </Modal>
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
    touch_img_right: {
        position: 'absolute',
        top: 25,
        right: 0,
    },
    touch_add: {
        backgroundColor: YSColors.default_bjcolor,
        height: YSWHs.width_window / 3.4,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.dark70,
    },
    img_close: {
        position: 'absolute',
        top: 0,
        left: 0,
    }


});


module.exports = editMessge;
