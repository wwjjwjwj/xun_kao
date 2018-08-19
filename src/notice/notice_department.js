/*
 * @flow
 * @providesModule notice_department
 */

'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import { Tree } from '../common/YSTree'
import AlphabetlistView from './notice_employees'
import SchoolListView from './notice_school'
import ParentListView from './notice_parents'
import { SearchInput } from 'react-native-search-input';
import { Tabs } from 'antd-mobile-rn';
//业务处理
import { departmentListQuery } from '../actions/organization';

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

const initReceiverData = {
    ReceiveType: 0,
    selectItem: []
};
class notice_department extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
            visible: false,
            showTree: false,
            isTop: '是',
            activeIndex: this.props.activeIndex || 0,
            selectedKeys: [],
            departmentList: [],
            keyLabelArray: [],
            ReceiveData: this.props.ReceiveData || initReceiverData
        };
        this.userList = [];
        this.mxList = [];
        this.parentList = [];
    };

    componentWillMount() {
        let receiveData = this.props.ReceiveData;

        this.props.departmentListQuery(1, 1, 0).then((response) => {
            //转扁平数组
            let keyLabelArray = [];
            response.data.data_list.map(item => {
                keyLabelArray = [...keyLabelArray, { key: item.Department.DepartmentID, label: item.Department.DepartmentName }];
                keyLabelArray = [...keyLabelArray, ...this.pushALLIDs(item.Child)];
            });
            //处理已选情况
            let firstChooseTree = [];
            if (receiveData.ReceiveType == 3) {
                receiveData.selectItem.map(item => {
                    firstChooseTree = [...firstChooseTree, item.selectedKey];
                });
            }
            if (receiveData.ReceiveType == 1) {
                firstChooseTree = [...firstChooseTree, 'root'];
                keyLabelArray.map(item => {
                    firstChooseTree = [...firstChooseTree, item.key];
                });
            }
            this.setState({ selectedKeys: firstChooseTree, departmentList: response.data.data_list, showTree: true, keyLabelArray: keyLabelArray });
        });

        //处理员工数据
        if (receiveData.ReceiveType == 2) {
            this.userList = receiveData.selectItem;
        }
        //盟校
        if (receiveData.ReceiveType == 4 || receiveData.ReceiveType == 5) {
            this.mxList = receiveData.selectItem;
        }
        //家长
        if (receiveData.ReceiveType == 6) {
            this.parentList = receiveData.selectItem;
        }
    }
    //针对当前树形组件转换功能菜单树数据结构
    convertTreeJson = () => {
        let treeNodes = [];
        treeNodes.push({
            key: 'root',
            label: YSI18n.get('All'),
            children: []
        });
        this.state.departmentList.map((item) => {
            treeNodes[0].children.push({
                key: item.Department.DepartmentID,
                label: item.Department.DepartmentName,
                children: this.pushChildren(item.Child)
            });
        })
        return treeNodes;
    }
    pushChildren(child) {
        if (child) {
            let childtreenodes = [];
            child.map(item => {
                childtreenodes.push({
                    key: item.Department.DepartmentID,
                    label: item.Department.DepartmentName,
                    children: this.pushChildren(item.Child)
                });
            });
            return childtreenodes;
        }
        return [];
    }
    pushALLIDs(child) {
        let keyLabelArray = [];
        if (child) {
            child.map(item => {
                keyLabelArray = [...keyLabelArray, { key: item.Department.DepartmentID, label: item.Department.DepartmentName }];
                keyLabelArray = [...keyLabelArray, ...this.pushALLIDs(item.Child)];
            });
            return keyLabelArray;
        }
        return keyLabelArray;
    }
    onsave() {
        let receiveData = initReceiverData;
        switch (this.state.activeIndex) {
            case 0:
                let keyLabelArray = this.state.keyLabelArray;
                if (this.state.selectedKeys.find(item => item == 'root')) {
                    receiveData.ReceiveType = 1;
                } else {
                    receiveData.ReceiveType = 3;
                    let selectItem = [];
                    this.state.selectedKeys.map(item => {
                        selectItem = [...selectItem, { selectedKey: item, selectedLabel: this.state.keyLabelArray.find(a => a.key == item).label }];
                    })
                    receiveData.selectItem = selectItem;
                }
                break;
            case 1:
                receiveData.ReceiveType = 2;
                receiveData.selectItem = this.userList;
                break;
            case 2:
                if (this.mxList.find(item => item.selectedKey == 'root')) {
                    receiveData.ReceiveType = 5;
                    receiveData.selectItem = this.mxList.filter(item => item.selectedKey == 'root');
                } else {
                    receiveData.ReceiveType = 4;
                    receiveData.selectItem = this.mxList;
                }
                break;
            case 3:
                receiveData.ReceiveType = 6;
                receiveData.selectItem = this.parentList.filter(item => item.selectedKey == 'root');
                break;
        }
        this.props.viewEditCallback(receiveData)
    }
    render() {
        const tabs = [
            { title: YSI18n.get('Department') },
            { title: YSI18n.get('Employees') },
            { title: YSI18n.get('School') },
            { title: YSI18n.get('Parents') },
        ];
        let block_whitespace = <View style={styles.whitespace} ></View>
        let treeNodes = this.convertTreeJson();

        let block_listView0 = this.state.showTree ? <View marginH-16 marginT-13 key={'tab_0'}>
            <Tree
                nodeStyle={{ fontSize: 16, color: YSColors.default_color, lineHeight: 30 }}
                treeStyle={{ height: YSWHs.height - 120 }}
                checkable={true}
                defaultSelectedKeys={this.state.selectedKeys}
                defaultExpandAll
                onSelect={value => this.setState({ selectedKeys: value })}
                onExpand={value => this.setState({ expandedKeys: value })}
                treeData={treeNodes}
            />
        </View> : <View marginH-16 marginT-13></View>;

        let block_listView1 = <View marginT-13 key={'tab_1'}>
            <AlphabetlistView ReceiveData={this.props.ReceiveData} onCallback={(user, checked) => {
                if (checked) {
                    this.userList = [...this.userList, { selectedKey: user.uid, selectedLabel: user.name }];
                } else {
                    this.userList = this.userList.filter(item => item.selectedKey != user.uid);
                }
            }} />
        </View>

        let block_listView2 = <View flex marginT-13 key={'tab_2'}>
            <SchoolListView ReceiveData={this.props.ReceiveData} onCallback={(dept, checked) => {
                if (checked) {
                    this.mxList = [...this.mxList, { selectedKey: dept.OrganizationID, selectedLabel: dept.OrganizationName }];
                } else {
                    this.mxList = this.mxList.filter(item => item.selectedKey != dept.OrganizationID);
                }
                if (dept.OrganizationID == 'root') {
                    this.mxList = this.mxList.filter(item => item.selectedKey == dept.OrganizationID);
                }
            }} />
        </View>

        let block_listView3 = <View flex marginT-13 key={'tab_3'}>
            <ParentListView ReceiveData={this.props.ReceiveData} onCallback={(parent, checked) => {
                if (checked) {
                    this.parentList = [...this.parentList, { selectedKey: parent.key, selectedLabel: parent.label }];
                } else {
                    this.parentList = this.parentList.filter(item => item.selectedKey != parent.key);
                }

            }} />
        </View>

        let block_tabbar = <Tabs tabs={tabs} swipeable={false}
            initialPage={'tab_' + this.state.activeIndex} page={this.state.activeIndex} onTabClick={(tab, index) => {
                this.setState({ activeIndex: index })
            }}
        >
            {block_listView0}
            {block_listView1}
            {block_listView2}
            {block_listView3}

        </Tabs>


        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get('AddRecipient')}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewEditCallback()
                    }}
                    onDone={() => {
                        this.onsave();
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


function select(store) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        departmentListQuery: bindActionCreators(departmentListQuery, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(notice_department);


