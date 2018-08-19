/*
 * 教师新增/修改
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, TextArea, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { DatePicker, List } from 'antd-mobile-rn';
//import { Toast } from 'antd-mobile-rn';
import YSToast from 'YSToast';
import CheckBox from 'YSCheckBox';
import SearchUser from 'YSSearchUser';
import { getDictionaryTitle, dataBind } from 'Util';
import { loadDictionary } from '../../actions/dictionary';

import { teacherSave } from '../../actions/user';

class TeacherEdit extends React.Component {
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
        var t = props.currentDataModel.teacher || {};
        var u = props.currentDataModel.user || {};
        this.state = {
            //currentDataModel: props.currentDataModel,
            teacher: t,
            user: u,
            teachers: [],

            roleInfo: {},

            Surname: u.surname,
            RealName: u.realName,
            Sex: u.gender,
            UserName: u.username,
            Password: u.password,
            MobilePhone: u.mobile,
            Email: u.email,
            Phone: u.icon,

            IDCard: t.IDCard,
            Education: t.Education,
            BankCardNum: t.BankCardNum,
            EntryDate: t.EntryDate,
            Status: t.Status,
            Descrition: t.Descrition,
        };
        this.getTextInputValidator = getTextInputValidator.bind(this);
        (this: any).onSave = this.onSave.bind(this);
        this.loadBizDictionary = loadBizDictionary.bind(this);
    };

    componentWillMount() {
        //载入需要的字典项
        this.loadBizDictionary(['dic_Status']);
    }

    onSave(){
      var that = this;
      let { Toast } = this;
      var info = {
        Surname: this.state.Surname,
        RealName: this.state.RealName,
        Sex: this.state.Sex,
        IDCard: this.state.IDCard,
        UserName: this.state.UserName,
        Password: this.state.Password,
        MobilePhone: this.state.MobilePhone,
        Education: this.state.Education,
        Email: this.state.Email,
        BankCardNum: this.state.BankCardNum,
        EntryDate: this.state.EntryDate,
        Role: this.state.roleInfo.value,
        Status: this.state.Status,
        TeacherID: this.state.teacher.TeacherID,

        Photo: this.state.Phone,
        Description: this.state.Descrition

      }
      this.props.teacherSave(info)
        //api调用成功
        .then((response) => {
          if(response.result){
            Toast.success("保存成功");

            let dataModel = {is_changed: true};
            this.props.viewCallback(dataModel)
          }
        })
        //api调用失败,提示登录名或密码错误
        .catch((response) => {
          Toast.fail(response.message || YSI18n.get('loginFailed'));
        })
    }

    renderRadioButton(value, text) {
        return (
            <View row centerV marginB-5 >
                <RadioButton value={value} />
                <Text marginL-15 marginR-50>{text}</Text>
            </View>
        );
    }

    renderList() {
        const surnameValidator = this.getTextInputValidator('Surname', false, (text) => {
            return (text && text.length >= 4);//姓氏
        })
        const realNameValidator = this.getTextInputValidator('RealName', false, (text) => {
            return (text && text.length >= 4);//姓氏
        })
        const cardValidator = this.getTextInputValidator('IDCard', false, (text) => {
            return (text && text.length == 18);//身份证
        })
        const userNameValidator = this.getTextInputValidator('UserName', false, (text) => {
            return (text && text.length >= 6);//userName
        })
        const passwordValidator = this.getTextInputValidator('Password', false, (text) => {
            return (text && text.length >= 6);//password
        })
        const mobileValidator = this.getTextInputValidator('MobilePhone', false, (text) => {
            return (text && text.length == 11);//mobile
        })

        const educationValidator = this.getTextInputValidator('Education', false, (text) => {
            return true;//education
        })
        const emailValidator = this.getTextInputValidator('Email', false, (text) => {
            return true;//email
        })
        const bankValidator = this.getTextInputValidator('BankCardNum', false, (text) => {
            return true;//email
        })
        const entryDateValidator = this.getTextInputValidator('EntryDate', false, (text) => {
            return true;//email
        })
        return (
            <View paddingT-s6>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surnameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('姓氏')}
                            helperText={YSI18n.get('请输入姓氏')}
                            maxLength={20}
                            value={this.state.Surname}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...realNameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('名字')}
                            helperText={YSI18n.get('请输入名字')}
                            maxLength={20}
                            value={this.state.RealName}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.Sex)}
                            onValueChange={value => { this.setState({Sex: value}) }}>
                            <Text marginB-20 text90 dark40>{YSI18n.get('性别')}</Text>
                            <View row >
                                {this.renderRadioButton('1', '男')}
                                {this.renderRadioButton('2', '女')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...cardValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('身份证号')}
                            helperText={YSI18n.get('请输入身份证号')}
                            maxLength={20}
                            value={this.state.IDCard}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...educationValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('学历')}
                            helperText={YSI18n.get('请输入学历')}
                            maxLength={20}
                            value={this.state.Education}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...userNameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('账号')}
                            helperText={YSI18n.get('请输入账号')}
                            maxLength={20}
                            value={this.state.UserName}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...passwordValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('密码')}
                            helperText={YSI18n.get('请输入密码')}
                            maxLength={20}
                            value={this.state.PassWord}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...mobileValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('手机号')}
                            helperText={YSI18n.get('请输入手机号')}
                            maxLength={20}
                            value={this.state.MobilePhone}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...emailValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('邮箱')}
                            helperText={YSI18n.get('请输入邮箱')}
                            maxLength={20}
                            value={this.state.Email}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...bankValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('银行卡号')}
                            helperText={YSI18n.get('请输入银行卡号')}
                            maxLength={20}
                            value={this.state.BankCardNum}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...entryDateValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('入职时间')}
                            helperText={YSI18n.get('请输入入职时间')}
                            maxLength={20}
                            value={this.state.EntryDate}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('角色')}
                            value={this.state.roleInfo}
                            onChange={value => {
                              this.setState({ roleInfo: value })
                            }}
                            rightIconSource={Assets.icons.dropdown}
                        >
                            {_.map(this.props.all_role_list, option => <Picker.Item key={option.value} value={option.value} label={option.title} enabled={true} />
                            )}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View centerV row style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.Status)}
                            onValueChange={value => { this.setState({ Status: value }) }}>
                            <Text marginB-20 text90 dark40>{YSI18n.get('状态')}</Text>
                            <View row >
                                {this.renderRadioButton('1', '启用')}
                                {this.renderRadioButton('0', '停用')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('头像')}
                            helperText={YSI18n.get('请输入头像')}
                            maxLength={20}
                            value={this.state.Photo}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextArea
                            placeholder={YSI18n.get('个人介绍')}
                            helperText={YSI18n.get('请输入个人介绍')}
                            value={this.state.Description}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('图片/小视频介绍')}
                            helperText={YSI18n.get('请输入图片')}
                            value={this.state.teacher.FileDescription}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70> </Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('教师资格证')}
                            helperText={YSI18n.get('请输入教师资格证')}
                            value={this.state.teacher.FileCertificate}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>


            </View>

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
            onPress={this.onDelete} />

        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewCallback()
                    }}
                    onDone={this.onSave}
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={YSI18n.get('Save')}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4>
                        {this.renderList()}
                    </View>
                </KeyboardAwareScrollView>
                <YSToast ref={(toast) => this.Toast = toast} />
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

function select(store){
  //基本字典数据
  let { Dictionarys } = store.dic;
  let { items } = store.menu;
  return { Dictionarys, AllMenus: items };
}

function mapDispatchToProps(dispatch) {
    return {
        teacherSave: bindActionCreators(teacherSave, dispatch),
        loadDictionary: bindActionCreators(loadDictionary, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(TeacherEdit);
