'use strict';

import React, { Component } from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Card, ListItem, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { DatePicker, List } from 'antd-mobile-rn';
import { SearchInput } from 'react-native-search-input';
import YSToast from 'YSToast';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//组件实例模板方法引入
import { onSearch, onPageIndexChange, onShowSizeChange } from 'ComponentExt';
//业务处理
import { notice_list } from '../actions/notice';

const datas = [
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
    {
        "name": "服务部（发消息者）",
        "title": '致盟校校长的一封信（消息的标题）',
        "date": '上午8:00',
        "creater": 'lekd',
        "content": '内容文字，默认取一行，一行显示完毕即可，默认取一'
    },
]

class notice_search extends React.Component {
    state: State;


    constructor(props: Props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource: ds.cloneWithRows(datas),
            pagingSearch: { pageIndex: 1, pageSize: 999, Title: '', Status: 1 },
            data_list: [],
            loading: false,
            isEmpty: true
        };
        this.Title = '';
        //扩展方法用于本组件实例
        this.onSearch = onSearch.bind(this);
    };

    componentWillMount() {
        //首次进入搜索，加载服务端字典项内容
        this.onSearch(true);
    }
    //调用api加载数据
    fetch = (pagingSearch) => {
        if (this.state.editMode === 'Manage') {
            this.setState({ loading: true })
        }
        pagingSearch.Title = this.Title;
        if (this.Title != '') {
            this.props.notice_list(pagingSearch)
                .then((response) => {
                    var ds = new ListView.DataSource({
                        rowHasChanged: (r1, r2) => r1 !== r2,
                        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
                    });
                    this.setState({
                        dataSource: ds.cloneWithRows(response.data.data_list),
                        data_list: response.data.data_list,
                        loading: false,
                        isEmpty: false,
                    });
                })
                .catch((response) => {
                    this.setState({ loading: false });
                    let { Toast } = this;
                    Toast.fail(response ? response.message : "err");
                })
        }
    }

    render() {
        let data_list = this.state.data_list;
        let block_listView_data1_1 = data_list.filter(item => item.Status == 3).map(
            (row, index) => {
                return (
                    <View middle paddingB-16 column style={[styles.border]}>
                        <TouchableOpacity onPress={() => {
                            this.props.onLookView('View', row)
                        }
                        }>
                            <View style={styles.list_header}></View>
                            <View row spread centerV marginT-10 paddingR-10>
                                <View row flex-1 centerV marginT-10>
                                    <View style={styles.redDot} marginR-10 centerV></View><Text dark10 text60 marginR-10 numberOfLines={1}>{row.CreareDepartment + '(' + row.CreateRealName + ')'}</Text>
                                </View>
                                <Text dark60 text70 >{row.CreatedDate}</Text>
                            </View>
                            <View marginV-10>
                                <Text text70 dark40 numberOfLines={1}>{row.Title}</Text>
                            </View>
                            <View>
                                <Text text70 dark60 numberOfLines={1}>{row.Content}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }
        )
        let block_listView_data1 = data_list.filter(item => item.Status == 3).length > 0 ?
            <View>
                <View style={styles.list_header}><Text>{YSI18n.get('Send')}</Text></View>
                {block_listView_data1_1}
            </View> : null

        let block_listView_data2_2 = data_list.filter(item => item.Status != 3).map(
            (row, index) => {
                return (
                    <View middle paddingB-16 column style={[styles.border]}>
                        <TouchableOpacity onPress={() => {
                            if (row.Status == 1) {
                                this.props.onLookView('Create', row)
                            } else {
                                this.props.onLookView('View', row)
                            }
                        }
                        }>
                            <View row flex-1 marginT-10>
                                <Text dark10 text60 marginR-10 numberOfLines={1}>{row.CreareDepartment + '(' + row.CreateRealName + ')'}</Text>
                            </View>
                            <View row spread centerV marginT-10 paddingR-10>
                                <View>
                                    <Text text70 dark30 marginB-5 numberOfLines={1}>{YSI18n.get('creator')}:{row.CreateRealName}</Text>
                                    <Text text70 dark30 numberOfLines={1}>{row.CreatedDate}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }
        )
        let block_listView_data2 = data_list.filter(item => item.Status != 3).length > 0 ? <View>
            <View style={styles.list_header}><Text>{YSI18n.get('WaitSend')}</Text></View>
            {block_listView_data2_2}
        </View> : null

        let block_listView1 = <View >
            {block_listView_data1}
            <View style={styles.block_space}></View>
            {block_listView_data2}
        </View>

        //初始化时显示
        let block_initText = <Text text70 dark60 center marginT-130>{YSI18n.get('Empty')}</Text>

        return (
            <View flex bg-white>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View style={styles.inputStyle} >
                        <SearchInput ref="search_box" backgroundColor={'transparent'}
                            cancelTitle={YSI18n.get('Cancel')}
                            titleCancelColor={Colors.blue30} placeholder={YSI18n.get('Search')} inputHeight={30}
                            onSearch={(text) => {
                                this.Title = text;
                                this.onSearch(true);
                            }}
                            onCancel={() => {
                                this.props.viewCallback()
                            }}
                        />
                    </View>
                    {!this.state.isEmpty && block_listView1}
                    {this.state.isEmpty && block_initText}
                    {/* 数据加载动画 */}
                    {this.state.loading &&
                        <LoaderScreen
                            color={Colors.blue30}
                            message={YSI18n.get('Loading')}
                            overlay
                        />}
                    <YSToast ref={(toast) => this.Toast = toast} />

                </KeyboardAwareScrollView>
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },

    inputStyle: {
        paddingHorizontal: 11,
        height: 44,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: ThemeManager.dividerColor,
        marginBottom: 2,
    },

    redDot: {
        backgroundColor: '#FE3824',
        width: 8,
        height: 8,
        borderRadius: 999,
    },

    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
        marginLeft: 16,
    },
    list_header: {
        height: 56,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 14
    },
    block_space: {
        height: 13,
        backgroundColor: YSColors.default_bjcolor,
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
    },


});

function select(store) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        notice_list: bindActionCreators(notice_list, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(notice_search);

