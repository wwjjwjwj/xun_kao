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

class searchForm extends React.Component {
    state: State;


    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource: ds.cloneWithRows(datas),
        };


    };

    componentDidMount() {

    }

    render() {

        let block_listView_data1 = datas.map(
            (row, index) => {
                return (
                    <View middle paddingB-16 column style={[styles.border]}>
                        <TouchableOpacity>

                            <View row spread centerV marginT-10 paddingR-10>
                                <View row flex-1 centerV marginT-10>
                                    <View style={styles.redDot} marginR-10 centerV></View><Text dark10 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                                </View>
                                <Text dark60 text70 >{row.date}</Text>
                            </View>
                            <View marginV-10>
                                <Text text70 dark40 numberOfLines={1}>{row.title}</Text>
                            </View>
                            <View>
                                <Text text70 dark60 numberOfLines={1}>{row.content}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }
        )
        let block_button_audit = <Button
            backgroundColor={YSColors.AppMainColor}
            size='small'
            outline
            text70
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('审核')}
            onPress={() => this.showActionSheet()} />

        let block_listView_data2 = datas.map(
            (row, index) => {
                return (
                    <View middle paddingB-16 column style={[styles.border]}>
                        <TouchableOpacity>

                            <View row flex-1 marginT-10>
                                <Text dark10 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                            </View>
                            <View row spread centerV marginT-10 paddingR-10>
                                <View>
                                    <Text text70 dark30 marginB-5 numberOfLines={1}>{YSI18n.get('创建人')}:{row.creater}</Text>
                                    <Text text70 dark30 numberOfLines={1}>{row.date}</Text>
                                </View>
                                {block_button_audit}
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }
        )
        let block_listView1 = <View >
            <View style={styles.list_header}><Text>收件箱</Text></View>
            {block_listView_data1}
            <View style={styles.block_space}></View>
            <View style={styles.list_header}><Text>待审核</Text></View>
            {block_listView_data2}
        </View>

        //初始化时显示
        let block_initText = <Text text70 dark60 center marginT-130>请输入文字搜索相关内容</Text>

        return (
            <View flex bg-white>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View style={styles.inputStyle} >
                        <SearchInput ref={function (input) {
                            if (input != null) {
                                input.focus();
                            }
                        }} backgroundColor={'transparent'} onCancel={() => this.props.viewCallback()} cancelTitle={YSI18n.get('取消')} titleCancelColor={Colors.blue30} placeholder={YSI18n.get('搜索')} inputHeight={30} />
                    </View>
                    {true && block_listView1}
                    {false && block_initText}
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
        paddingLeft:14
    },
    block_space: {
        height: 13,
        backgroundColor: YSColors.default_bjcolor,
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
    },


});


module.exports = searchForm;
