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
        taskList: {
            screen: require('TaskList'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('监考任务'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        noticeDetail: {
            screen: require('NoticeDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('监考须知'),
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
                header: null,
                /*title: YSI18n.get('本场考试签到'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }*/
            })
        },
        //-------------------3 考场拍照
        examTakePhoto: {
            screen: require('./home/exam_take_photo'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('考场拍照'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        placeTakePhoto: {
            screen: require('PlaceTakePhoto'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('本场考场拍照'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        //-------------------4 统计
        signedStat: {
            screen: require('./home/signed_stat'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('签到统计'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        oneExamSignedStat: {
            screen: require('OneExamSignedStat'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('本场签到统计'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' }
            })
        },
        statDetailByType: {
            screen: require('StatDetailByType'),
        },

        //-------------------5 其他签到
        signedByOther: {
            screen: require('./home/signed_by_other'),
            navigationOptions: ({ navigation }) => ({
              //header: null
            })
        },
        otherSignedDetail: {
            screen: require('OtherSignedDetail'),
            navigationOptions: ({ navigation }) => ({
                title: YSI18n.get('本场其他签到'),
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 20 },
                headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19,
                  //flex: 1, textAlign: 'center'
                },
                headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' },
                //headerBackTitle: null,
            })
        },

    });

module.exports = navigator;
