/*
 * 盟校课程组新增/修改
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
//import { Toast } from 'antd-mobile-rn';
import YSToast from 'YSToast';
import CheckBox from 'YSCheckBox';
import SearchUser from 'YSSearchUser';

import { courseTeamSave, courseTeamDelete } from '../../actions/course';

const options = [
  {label: 'JavaScript', value: 'js'},
  {label: 'Java', value: 'java'},
  {label: 'Python', value: 'python'},
  {label: 'C++', value: 'c++', disabled: true},
  {label: 'Perl', value: 'perl'},
];

class CourseTeamEdit extends React.Component {
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
        var c = props.currentDataModel;
        this.state = {
            //all_course_list: props.all_course_list,
            //currentDataModel: c,
            teachers: c.teachers || [],

            CourseTeamID: c.CourseTeamID,
            CourseTeamName: c.CourseTeamName,

            courseInfo: {
              label: c.CourseName,
              value: c.CourseSpecialty
            },
            leaderInfo: {
              label: c.LeaderName,
              value: c.TeamLeader
            }
        };
        this.getTextInputValidator = getTextInputValidator.bind(this);
        (this: any).onSave = this.onSave.bind(this);
        (this: any).onDelete = this.onDelete.bind(this);
    };

    onSave(){
      var that = this;
      let { Toast } = this;
      if(!this.state.CourseTeamName){
          Toast.fail(YSI18n.get('名称必填'));
          return;
      }
      if(!this.state.courseInfo.value){
          Toast.fail(YSI18n.get('课程必选'));
          return;
      }
      if(!this.state.leaderInfo.value){
          Toast.fail(YSI18n.get('负责人必选'));
          return;
      }
      var str = "";
      this.state.teachers.map(t => {
        str += t.value + ",";
      });
      var info = {
        CourseTeamID: this.state.CourseTeamID,
        CourseTeamName: this.state.CourseTeamName,
        TeamLeader: this.state.leaderInfo.value,
        CourseSpecialty: this.state.courseInfo.value,
        strTeacherIds: str,
        isChangeTeacher: true
      }
      this.props.courseTeamSave(info)
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
      var id = this.state.CourseTeamID;
      if(!id){
        return;
      }
      var that = this;
      let { Toast } = this;
      Alert.alert(
        '是否删除此课程组?',
        '点击确认删除此课程组!否则点击取消！',
        [
          {text: '取消', onPress: () => {}, style: 'cancel'},
          {text: '确认', onPress: () => {
            that.props.courseTeamDelete(id)
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
        const codeValidator = this.getTextInputValidator('CourseTeamName', false, (text) => {
            return (text && text.length >= 2);//
        })
        return (
            <View paddingT-s6>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...codeValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('课程组名称')}
                            helperText={YSI18n.get('请输入课程组名称')}
                            maxLength={20}
                            value={this.state.CourseTeamName}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            floatingPlaceholder
                            placeholder={YSI18n.get('课程')}
                            value={this.state.courseInfo}
                            onChange={value => {
                              this.setState({ courseInfo: value })
                            }}
                            rightIconSource={Assets.icons.dropdown}
                        >
                            {_.map(this.props.all_course_list, option => <Picker.Item key={option.courseId} value={option.courseSpecialty} label={option.courseName} enabled={true} />
                            )}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            showSearch
                            floatingPlaceholder
                            placeholder={YSI18n.get('负责人')}
                            value={this.state.leaderInfo}
                            onChange={value => {
                              this.setState({ leaderInfo: value })
                            }}
                            rightIconSource={Assets.icons.dropdown}
                            topBarProps={{title: '负责人'}}
                        >
                            {_.map(this.props.all_user_list, option => <Picker.Item key={option.value} value={option} /> )}
                        </Picker>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View flex-1 style={styles.box_middle}>
                        <Picker
                            showSearch
                            floatingPlaceholder
                            placeholder={YSI18n.get('成员')}
                            value={this.state.teachers}
                            onChange={value => {
                              this.setState({ teachers: value })
                            }}
                            rightIconSource={Assets.icons.add}
                            topBarProps={{title: '组成员'}}
                            mode={Picker.modes.MULTI}
                        >
                            {_.map(this.props.all_user_list, option => <Picker.Item key={option.value} value={option} /> )}
                        </Picker>
                        {/*<YSdetailField
                          label={YSI18n.get('成员')}
                          value={this.state.currentDataModel.TotalTeachers}/>
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            //显示成员列表
                          }}>
                          <Image source={Assets.icons.add} />
                        </TouchableOpacity>*/}
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
                        {this.state.CourseTeamID ? block_button_del : ''}
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
  return {

  }
}

function mapDispatchToProps(dispatch) {
    return {
        courseTeamSave: bindActionCreators(courseTeamSave, dispatch),
        courseTeamDelete: bindActionCreators(courseTeamDelete, dispatch)
    };
}
module.exports = connect(select, mapDispatchToProps)(CourseTeamEdit);
