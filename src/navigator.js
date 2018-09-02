//@flow

'use strict'

import React from 'react';
import {
    AppRegistry,
    Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import YSWHs from 'YSWHs';
import YSColors from 'YSColors';
import YSI18n from 'YSI18n';

//import ChooseLanguages from './chooseLanguages'
const navigator = StackNavigator(
    {
        //首页
        Home: {
            screen: require('./home/index'),
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        //OTG test
        otgTest: {
            screen: require('OtgTest'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('有线连接'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        //Blueteeth test
        blueteethTest: {
            screen: require('BlueteethTest'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('无线连接'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        //read card test
        readCardTest: {
            screen: require('ReadCardTest'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('读卡测试'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        //--------------2 刷卡签到
        //刷卡签到 首页
        signedByCard: {
            screen: require('./home/signed_by_card'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('考试刷卡签到'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        examSign: {
          screen: require('ExamSign'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('本场考试签到'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },



/*
        //员工管理
        employeeIndex: {
            screen: require('EmployeeIndex'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('员工管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //查看员工信息
        memberDetail: {
            screen: require('./demo/member/memberDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Detail'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //部门管理
        departmentIndex: {
            screen: require('DepartmentIndex'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('部门管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //查看部门信息
        DepartmentDetail: {
            screen: require('DepartmentDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Detail'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //角色管理
        roleManageList: {
            screen: require('./role/roleManageList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('RoleManage'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },


        //查看角色信息
        roleDetail: {
            screen: require('./role/roleDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Detail'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //通知消息管理
        messgeManageList: {
            screen: require('./demo/messge/messgeManageList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('通知消息管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //通知消息管理
        noticeManage_index: {
            screen: require('./notice/noticeManage_index'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('通知消息管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //阅读情况
        noticeManage_read: {
            screen: require('./notice/notice_read'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('阅读情况'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //查看信息详情
        noticeManage_detail: {
            screen: require('./notice/notice_detail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('通知消息'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //查看信息详情
        messgeDetail: {
            screen: require('./demo/messge/messgeDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('通知消息'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //课程管理
        courseIndex: {
            screen: require('CourseIndex'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('课程管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //查看课程信息
        CourseDetail: {
            screen: require('CourseDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Detail'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //课程授权管理
        courseAuthIndex: {
            screen: require('CourseAuthIndex'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('课程授权管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //查看盟校授权课程信息
        courseAuthDetail: {
            screen: require('CourseAuthDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Detail'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //课程组管理
        courseTeamIndex: {
            screen: require('CourseTeamIndex'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('课程组管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //课程组管理
        courseTeamDetail: {
            screen: require('CourseTeamDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('课程组详情'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //教师管理
        teacherIndex: {
            screen: require('TeacherIndex'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('教师管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        //教师详情
        teacherDetail: {
            screen: require('TeacherDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('教师管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //阅读情况
        receiveMessgeList: {
            screen: require('./demo/messge/receiveMessgeList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('阅读情况'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        //通知消息
        getMessgeList: {
            screen: require('./demo/messge/getMessgeList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('通知消息'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        messgeDetailAudit: {
            screen: require('./demo/messge/messgeDetailAudit'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('通知消息'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        Demo: {
            screen: require('./demo/menus'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Demo功能展示'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        editInputText: {
            screen: require('./common/YSEditInputText'),
            navigationOptions: ({ navigation }) => ({
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        setting: {
            screen: require('Setting'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('Setting'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },

        LeagueSchool: {
            screen: require('./demo/League/LeagueSchoolManageList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('盟校管理'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        leagueSchoolDetail: {
            screen: require('./demo/League/leagueSchoolDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('详情'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        perfectSchoolDetail: {
            screen: require('./demo/League/perfectSchoolDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('完善信息'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        myInformation: {
            screen: require('./home/myInformation'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('个人信息'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        myBakeUpfile: {
            screen: require('./demo/myBakeUpfile/bakeFileManageList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('我的备忘录'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        bakeFileDetail: {
            screen: require('./demo/myBakeUpfile/bakeFileDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('详情'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        },
        newsdetail: {
            screen: require('./demo/news/newsDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('详情'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal' },
                headerStyle: { borderBottomWidth: 1, borderColor: YSColors.splitlineColor, backgroundColor: YSColors.whiteBackground }
            })
        }
*/
    });

module.exports = navigator;
