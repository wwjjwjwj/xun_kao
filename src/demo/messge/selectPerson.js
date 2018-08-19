/*
 * @flow
 * @providesModule selectPerson
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
import { Tree } from '../../common/YSTree'
import AlphabetlistView from './AlphabetlistView'
import SchoolListView from './selectSchoolList'
import ParentListView from './selectParentList'
import { SearchInput } from 'react-native-search-input';
import { Tabs } from 'antd-mobile-rn';


export const treeData = [
    {
        key: 'root',
        label: '全部选中',
        children: [
            {
                key: 'key1',
                label: '临沂教学实践基地',
                children: [
                    {
                        key: 'noodle',
                        label: '校区管理中心',
                    },
                    {
                        key: 'rice',
                        label: '办公管理中心',
                    },
                    {
                        key: 'rice',
                        label: '课程管理中心',
                    },

                ]
            },
            {
                key: 'key2',
                label: '神墨课程研究院',

            },
            {
                key: 'key3',
                label: '神墨总部管理中心',

            }


        ]
    }
];


class selectPerson extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
            visible: false,
            isTop: '是',
            activeIndex: 0,
        };


    };

    render() {
        const tabs = [
            { title: YSI18n.get('部门') },
            { title: YSI18n.get('员工') },
            { title: YSI18n.get('盟校') },
            { title: YSI18n.get('家长') },
        ];



        let block_whitespace = <View style={styles.whitespace} ></View>

        let block_listView0 = <View marginH-16 marginT-13>
            <Tree
                nodeStyle={{ fontSize: 16, color: YSColors.default_color, lineHeight: 30 }}
                treeStyle={{ height: YSWHs.height - 120 }}
                checkable={true}
                defaultExpandAll
                onSelect={value => this.setState({ selectedKeys: value })}
                onExpand={value => this.setState({ expandedKeys: value })}
                treeData={treeData}
            />
        </View>

        let block_listView1 = <View marginT-13>
            <AlphabetlistView />
        </View>

        let block_listView2 = <View flex marginT-13>
            <SchoolListView />
        </View>

        let block_listView3 = <View flex marginT-13>
            <ParentListView />
        </View>

        let block_tabbar = <Tabs tabs={tabs}
            initalPage={0}
        >
            {block_listView0}
            {block_listView1}
            {block_listView2}
            {block_listView3}

        </Tabs>

        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get('添加接收人')}
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
                {block_tabbar}

              

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
        top: 30,
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
    },
    tabar_wrap: {
        borderWidth: 1,
        borderColor: YSColors.AppMainColor,
        height: 24 * YSWHs.scale_rx,
        borderRadius: 8,
        marginTop: 12,

    },
    touch_button: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touch_button_selected_right: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: YSColors.AppMainColor,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    touch_button_selected: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: YSColors.AppMainColor,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    touch_button_selected_middle: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: YSColors.AppMainColor,
        borderLeftWidth: 1,
        borderColor: YSColors.AppMainColor,
    },
    touch_button_middle: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: YSColors.AppMainColor,
    },
    text_touch_button_selected: {
        color: Colors.white
    },
    text_touch_button: {
        color: Colors.blue30,
        fontSize: 13,
    },


});


module.exports = selectPerson;
