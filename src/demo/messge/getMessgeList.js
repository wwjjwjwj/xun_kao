
'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import { Tabs, ActionSheet } from 'antd-mobile-rn';
import SearchForm from './searchForm'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
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

class getMessgeList extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <View row>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.params.onSearch()
                    }}>
                        <Image source={Assets.icons.search} />
                    </TouchableOpacity>
                </View>

            ),
        }
    }
    constructor(props: Props) {
        super(props);
        props.navigation.setParams({
            onSearch: () => {
                //搜索
                this.setState({ showSearchForm: true })
            }
        })
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            dataSource: ds.cloneWithRows(datas),
            activeIndex: 0,
            showSearchForm: false,
        };

    };


    renderRow(row, id) {
        let block_button_audit = <Button
            backgroundColor={YSColors.AppMainColor}
            size='small'
            outline
            text70
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('审核')}
            onPress={() => this.showActionSheet()} />
        return (
            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={116}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver
                onPress={() => this.props.navigation.navigate('messgeDetailAudit')}
            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part>
                        <View row flex-1 centerV marginB-10>
                            <Text dark10 text60 numberOfLines={1}>{row.name}</Text>
                        </View>
                    </ListItem.Part>
                    <ListItem.Part>
                        <View>
                            <Text text70 dark30 marginB-5 numberOfLines={1}>{YSI18n.get('创建人')}:{row.creater}</Text>
                            <Text text70 dark30 numberOfLines={1}>{row.date}</Text>
                        </View>
                        {block_button_audit}
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        );
    }

    showActionSheet = () => {
        const BUTTONS = [YSI18n.get('通过'), YSI18n.get('不通过'), YSI18n.get('Cancel')];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
            wrapProps,
        },
            (buttonIndex) => {

            });
    }

    render() {
        const tabs = [
            { title: YSI18n.get('收件箱') },
            { title: YSI18n.get('待审核') },
        ];

        let block_listView_data1 = datas.map(
            (row, index) => {
                return (
                    <View middle paddingV-13 column style={[styles.border]}>
                        <TouchableOpacity>
                            <View row spread>
                                <View row flex-1 centerV marginB-10>
                                    <View style={styles.redDot} marginR-10 centerV></View><Text dark10 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                                </View>
                                <Text dark60 text70 >{row.date}</Text>
                            </View>
                            <View marginB-10>
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
        let block_listView_data2 = datas.map(
            (row, index) => {
                return (
                    <View middle paddingV-13 column style={[styles.border]}>
                        <TouchableOpacity>
                            <View row spread>
                                <View row flex-1 centerV marginB-10>
                                    <Text dark10 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                                </View>
                                <Text dark60 text70 >{row.date}</Text>
                            </View>
                            <View marginB-10>
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

        let block_listView1 = <ScrollView >
            <View style={styles.block_header} marginT-15 centerV paddingL-16>
                <Text blue30 text70 style={styles.text_header}>{YSI18n.get("置顶消息")}</Text>
            </View>
            {/* 置顶消息列表 */}
            {block_listView_data1}
            <View style={styles.block_space}></View>
            {block_listView_data2}
        </ScrollView>

        let block_listView2 = <View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
            />
        </View>

        let block_tabbar = <Tabs tabs={tabs}
            initalPage={0}
        >
            {block_listView1}
            {block_listView2}

        </Tabs>


        return (
            <View style={styles.container}>
                {block_tabbar}
                {/* 搜索模式 */}
                <Modal onRequestClose={() => this.setState({ showSearchForm: false })} visible={this.state.showSearchForm === true} animationType={'slide'}>
                    <View bg-white flex>
                        <SearchForm viewCallback={() => this.setState({ showSearchForm: false })} />
                    </View>
                </Modal>
            </View>
        );
    }


};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
        paddingHorizontal: 16,

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
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
    },
    touch_button_selected: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: YSColors.AppMainColor,
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
    },
    text_touch_button_selected: {
        color: Colors.white
    },
    text_touch_button: {
        color: Colors.blue30,
        fontSize: 13,
    },
    block_header: {
        height: 37,
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
        backgroundColor: YSColors.default_bjcolor
    },
    block_space: {
        height: 13,
        backgroundColor: YSColors.default_bjcolor,
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
    },
    redDot: {
        backgroundColor: '#FE3824',
        width: 8,
        height: 8,
        borderRadius: 999,
    }
});

module.exports = getMessgeList;
