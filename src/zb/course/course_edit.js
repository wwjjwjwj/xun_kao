/*
 * 课程新增/修改
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

import { courseSave, courseDelete } from '../../actions/course';

const initCourse = {
  courseId: '',
  courseSpecialty: '',
  courseName: '',
  courseType: 1,
  status: 1,
};

class CourseEdit extends React.Component {
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

            status: props.currentDataModel ?  JSON.stringify(props.currentDataModel.status) : initCourse.status,
            currentDataModel: props.currentDataModel || initCourse
        };
        (this: any).onSave = this.onSave.bind(this);
        (this: any).onDelete = this.onDelete.bind(this);
    };

    onSave(){
      var that = this;
      var d = this.state.currentDataModel;
      d.courseSpecialty = this.state.courseSpecialty || this.state.currentDataModel.courseSpecialty;
      d.courseName = this.state.courseName || this.state.currentDataModel.courseName;
      d.courseType = this.state.courseType;
      d.status = this.state.status;
      this.props.courseSave(d)
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
      if(!this.state.currentDataModel.courseId){
        return;
      }
      var id = this.state.currentDataModel.courseId;
      var that = this;
      Alert.alert(
        '是否删除此课程?',
        '点击确认删除此课程!否则点击取消！',
        [
          {text: '取消', onPress: () => {}, style: 'cancel'},
          {text: '确认', onPress: () => {
            that.props.courseDelete(id)
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
        const codeValidator = this.getTextInputValidator('courseSpecialty', false, (text) => {
            return (text && text.length >= 3);//姓氏
        })
        const nameValidator = this.getTextInputValidator('courseName', false, (text) => {
            return (text && text.length >= 2);//姓氏
        })

        return (
            <View paddingT-s6>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...codeValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('课程编号')}
                            helperText={YSI18n.get('请输入课程编号')}
                            maxLength={20}
                            value={this.state.currentDataModel.courseSpecialty}
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
                            placeholder={YSI18n.get('课程名称')}
                            helperText={YSI18n.get('请输入课程名称')}
                            maxLength={20}
                            value={this.state.currentDataModel.courseName}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.currentDataModel.courseType)}
                          onValueChange={value => this.setState({ courseType: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('课程类型')}
                            </Text>
                            <View row >
                                {this.renderRadioButton('1', '授权课程')}
                                {this.renderRadioButton('2', '开放课程')}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={JSON.stringify(this.state.currentDataModel.status)}
                          onValueChange={value => this.setState({ status: value })}>
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
                        {this.state.currentDataModel.courseId ? block_button_del : ''}
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
        courseSave: bindActionCreators(courseSave, dispatch),
        courseDelete: bindActionCreators(courseDelete, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(CourseEdit);
