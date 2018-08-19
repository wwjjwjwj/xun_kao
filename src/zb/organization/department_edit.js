/*
 * 部门新增/修改
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
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { DatePicker, List } from 'antd-mobile-rn';
import { Toast } from 'antd-mobile-rn';

import { departmentSave, departmentDelete } from '../../actions/organization';


//所属上级
/*const supers = [
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
]*/

const initDepartment = {
  DepartmentID: '',
  ParentID: '',
  DepartmentName: '',
  Status: '1',
};

class DepartmentEdit extends React.Component {
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
            //super: { label: '服务中心', value: '1' },
            //state: '启用',
            all_department_list: props.all_department_list,

            ParentInfo: props.currentDataModel ? {value: props.currentDataModel.ParentID, label: props.currentDataModel.ParentName} : {},
            Status: props.currentDataModel ?  JSON.stringify(props.currentDataModel.Status) : initDepartment.Status,
            department: props.currentDataModel || initDepartment

        };
        (this: any).onSave = this.onSave.bind(this);
        (this: any).onDelete = this.onDelete.bind(this);
    };

    onSave(){
      var that = this;
      var d = this.state.department;
      d.DepartmentName = this.state.DepartmentName || this.state.department.DepartmentName;
      d.ParentID = this.state.ParentInfo.value;
      d.Status = this.state.Status;
      this.props.departmentSave(d)
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

    onDelete(){
      if(!this.state.department.DepartmentID){
        return;
      }
      var id = this.state.department.DepartmentID;
      var that = this;
      Alert.alert(
        '是否删除此部门?',
        '点击确认删除此部门!否则点击取消！',
        [
          {text: '取消', onPress: () => {}, style: 'cancel'},
          {text: '确认', onPress: () => {
            that.props.departmentDelete(id)
            .then((response) => {
              if(response.result){
                Toast.success("删除成功");

                let dataModel = {is_deleted: true};
                that.props.viewCallback(dataModel)
              }
            })
            //api调用失败,提示登录名或密码错误
            .catch((response) => {
              Toast.fail(response.message || YSI18n.get('loginFailed'));
            })
          }},
        ],
        { cancelable: false }
      )
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
        //表单验证器
        const surenameValidator = this.getTextInputValidator('DepartmentName', false, (text) => {
            return (text && text.length >= 4);//姓氏
        })

        return (
            <View paddingT-s6>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...surenameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('部门名称')}
                            helperText={YSI18n.get('请输入部门名称')}
                            maxLength={20}
                            value={this.state.department.DepartmentName}
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
                            value={this.state.ParentInfo}
                            onChange={value => {
                              if(value.value && value.value != this.state.department.DepartmentID){
                                this.setState({ ParentInfo: value })
                              }
                            }}
                            rightIconSource={Assets.icons.dropdown}
                        >
                            {_.map(this.props.all_department_list, option => <Picker.Item key={option.value} value={option.value} label={option.parent_value == '00000000-0000-0000-0000-000000000000' ? option.title : '    ' + option.title} enabled={option.value != this.state.department.DepartmentID} />
                            )}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                {
                  this.state.department.DepartmentID ?
                  <View centerV row style={[styles.field_wrap]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('部门人数')} value={this.state.department.UserSum} textstyle={styles.disableColor} />
                    </View>
                    <View style={styles.Wing_blank}></View>
                  </View>
                  : ""
                }

                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.department.Status)} onValueChange={value => this.setState({ Status: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('当前状态')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('1', '启用')}
                                {this.renderRadioButton('0', '停用')}
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
                        {this.state.department.DepartmentID ? block_button_del : ''}
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

function select(store){
  return {

  }
}

function mapDispatchToProps(dispatch) {
    return {
        departmentSave: bindActionCreators(departmentSave, dispatch),
        departmentDelete: bindActionCreators(departmentDelete, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(DepartmentEdit);
