/*
 * 盟校授权课程新增/修改
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

import { courseAuthSave } from '../../actions/course';

class CourseAuthEdit extends React.Component {
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

        var courseSpecialtys = [];
        props.all_course_list.map(c => {
          var isExist = true;
          props.currentDataModel.auth_courses.map(a => {
            if(c.courseSpecialty == a.CourseSpecialty){
              c.isChecked = true;
              isExist = true;
              courseSpecialtys.push(c.courseSpecialty);
            }
          });
          if(!isExist){
            c.isChecked = false;
          }
        });
        this.state = {
            all_course_list: props.all_course_list,
            currentDataModel: props.currentDataModel,
            courseSpecialtys: courseSpecialtys,
        };
        (this: any).onSave = this.onSave.bind(this);
    };

    onSave(){
      var that = this;
      let { Toast } = this;
      var d = this.state.currentDataModel;
      var param1 = d.organization.OrganizationID;
      var param2 = this.state.courseSpecialtys.join(',');
      this.props.courseAuthSave(param1, param2)
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
        var block_courses = this.state.all_course_list.map(course => {
          return <View style={styles.listRow} >
                  <View>
                    <CheckBox
                      //ref={(c)=>this.initCheckBoxData(c)}
                      label=""
                      checked={course.isChecked}
                      value={course.courseSpecialty}
                      style={styles.check}
                      onChange={(checked) => {
                        //---start
                        var cs = this.state.courseSpecialtys;
                        var isExist = false;
                        for(var i = 0; i < cs.length; i++){
                          if(cs[i] == course.courseSpecialty){
                            isExist = true;
                            if(!checked){
                              cs.splice(i, 1);
                            }
                            break;
                          }
                        }
                        if(!isExist && checked){
                          cs.push(course.courseSpecialty);
                        }
                        //---end
                        course.isChecked = checked
                        this.setState({
                          courseSpecialty: cs
                        });
                      }}
                    />
                  </View>
                  <View style={styles.rightContainer}>
                    <Text style={styles.title}>{course.courseName}</Text>
                  </View>
          </View>
        });

        return (
            <View paddingT-s6>
                <View row centerV style={styles.field_wrap}>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            floatingPlaceholder
                            placeholder={YSI18n.get('盟校')}
                            value={this.state.currentDataModel.organization.OrganizationName}
                            editable={false}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View flex-1 style={styles.box_middle}>
                        <Text>{YSI18n.get('盟校课程')}</Text>
                        {block_courses}

                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
            </View>

        );
    }

    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>

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
  return {

  }
}

function mapDispatchToProps(dispatch) {
    return {
        courseAuthSave: bindActionCreators(courseAuthSave, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(CourseAuthEdit);
