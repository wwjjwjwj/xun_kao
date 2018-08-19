/*
 * @flow
 * @providesModule messgeManageList
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import Swipeout from 'react-native-swipeout';

//编辑模式
import EditMessge from './editMessge';
import SelectPerson from './selectPerson';

//搜索模式
import SearchForm from './searchForm';
import { Tabs } from 'antd-mobile-rn';


var swipeoutBtns = [
    {
        text: YSI18n.get('删除'),
        backgroundColor: Colors.orange10,
        color: Colors.white,
        type: 'delete',
        onPress: () => {
            Alert.alert('dd')
        }
    }
]
const orders = [
    {
        "title": "致盟校校长的一封信致盟校校长的",
        "creator": '小青',
        "Auditor": "张三",
        "auditDate": '2018/4/25',
        "view": "120",
        "date": '2018/4/25',
        "state": '审核不通过',
    },
    {
        "title": "致盟校校长的一封信致盟校校长",
        "creator": '小青',
        "Auditor": "张三",
        "view": "120",
        "auditDate": '2018/4/25',
        "date": '2018/4/25',
        "state": '草稿',
    },
    {
        "title": "致盟校校长的一封信致盟校校长",
        "creator": '小青',
        "Auditor": "张三",
        "view": "120",
        "auditDate": '2018/4/25',
        "date": '2018/4/25',
        "state": '审核不通过',
    },


]
class messgeManageList extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('员工管理'),
            headerRight: (
                <View row>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.params.onSearch()
                    }}>
                        <Image source={Assets.icons.search} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.params.onAdd()
                    }}>
                        <Image source={Assets.icons.add} />
                    </TouchableOpacity>
                </View>

            ),
        }
    }
    constructor(props: Props) {
        super(props);
        //顶部按钮事件处理
        props.navigation.setParams({
            onAdd: () => {
                //新增
                this.onLookView('Create', {})
            },
            onSearch: () => {
                //搜索
                this.onLookView('Search', {})
            }
        })
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            currentDataModel: null,
            editMode: 'Manage',//Edit,Create,View,Delete,Manage
            dataSource: ds.cloneWithRows(orders),
            onEdit: false,
            updating: false,
            showSearchData: false,
            activeIndex: 0,
        };

    };


    //浏览视图
    onLookView = (op, item) => {
        this.setState({
            editMode: op,//编辑模式
            currentDataModel: item,//编辑对象
        });
        switch (op) {
            case 'View':
                this.props.navigation.navigate('messgeDetail');
                break;
            case 'Search':
                this.setState({ editMode: 'Search' })
                break;
        }
    };
    //视图回调
    viewCallback = (dataModel) => {
        if (dataModel) {
            //如果需要更新，则刷新
        }
        this.setState({ editMode: 'Manage' });
    }

    page() {

    }
    renderRow1(row, id) {

        return (
            <Swipeout right={swipeoutBtns} disabled={row.state != '草稿'}>
                <ListItem
                    activeBackgroundColor={Colors.dark60}
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={(item) => this.onLookView('View', item)}
                    animation="fadeIn"
                    easing="ease-out-expo"
                    duration={1000}
                    useNativeDriver

                >
                    <ListItem.Part middle column containerStyle={[styles.border]}>
                        <ListItem.Part containerStyle={{ marginBottom: 13, marginTop: 18 }}>
                            <View row flex-1 centerV>
                                <Text dark10 text70 numberOfLines={1}>{row.title}</Text>
                            </View>
                            <Text dark60 text80 style={{ marginTop: 2 }}>{row.date}</Text>
                        </ListItem.Part>

                        <ListItem.Part containerStyle={{ marginBottom: 18 }}>
                            <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>创建人：{row.creator}</Text>
                            <Text dark60 text80 style={{ marginTop: 2 }}>{row.state}</Text>
                        </ListItem.Part>
                    </ListItem.Part>

                </ListItem>
            </Swipeout>
        );
    }
    renderRow2(row, id) {

        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={110.5}
                onPress={(item) => this.onLookView('View', item)}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver

            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part containerStyle={{ marginBottom: 13, marginTop: 18 }}>
                        <View row flex-1 centerV>
                            <Text dark10 text70 numberOfLines={1}>{row.title}</Text>
                        </View>
                        <Text dark60 text80 style={{ marginTop: 2 }}>{YSI18n.get('阅读')}：{row.view}</Text>
                    </ListItem.Part>

                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <View row flex-1 centerV>
                            <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('创建人')}：{row.creator} {YSI18n.get('创建时间')}：{row.date}</Text>
                        </View>
                    </ListItem.Part>
                    <ListItem.Part containerStyle={{ marginBottom: 18 }}>
                        <View row flex-1 centerV>
                            <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('审核人')}：{row.Auditor} {YSI18n.get('审核时间')}：{row.auditDate}</Text>
                        </View>
                    </ListItem.Part>
                </ListItem.Part>

            </ListItem>

        );
    }
    render() {
        const tabs = [
            { title: YSI18n.get('待发送') },
            { title: YSI18n.get('已发送') },
        ];

        let block_listView1 =
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow1(row, rowId)}
            />

        let block_listView2 =
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow2(row, rowId)}
            />

        let block_tabbar = <Tabs tabs={tabs}
            initalPage={0}
            swipeable={false}
        >
            {block_listView1}
            {block_listView2}

        </Tabs>

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}>

                {block_tabbar}
                {block_space}


                {/* 编辑模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditMessge editMode={'Create'}
                            addSender={
                                () => this.onLookView('AddSender', {})
                            }
                            currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
                    </View>
                </Modal>

                {/* 搜索模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'fade'}>
                    <View bg-white flex>
                        <SearchForm editMode={'Search'} current search={() => {
                            this.setState({ showSearchData: 'true', editMode: 'Manage' });
                        }}
                            viewCallback={this.viewCallback} />
                    </View>
                </Modal>

                {/* 添加接收人  */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'AddSender'} animationType={'fade'}>
                    <View bg-white flex>
                        <SelectPerson editMode={'AddSender'} currentDataModel={this.state.currentDataModel} viewCallback={() => this.onLookView('Create', {})} />
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
    text_touch_button_selected: {
        color: Colors.white
    },
    text_touch_button: {
        color: Colors.blue30,
        fontSize: 13,
    },
    block_space: {
        height: 18
    }
});

module.exports = messgeManageList;
