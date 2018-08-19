/*
 * @flow
 * @providesModule noticeManage_index
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import YSToast from 'YSToast';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { LoaderScreen, Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import Swipeout from 'react-native-swipeout';
import { dateFormat } from '../common/Util';

//编辑模式
import EditMessge from './notice_edit';
//import SelectPerson from '../messge/selectPerson';
//搜索模式
import SearchForm from './notice_search';
//组件实例模板方法引入
import { onSearch, onPageIndexChange, onShowSizeChange } from 'ComponentExt';
//业务处理
import { notice_list, notice_Delete } from '../actions/notice';



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
class noticeManage_index extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('NoticeManage'),
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
            dataSource: ds.cloneWithRows([]),
            onEdit: false,
            updating: false,
            showSearchData: false,
            activeIndex: 0,
            selectNoticeID: '',
            pagingSearch: { pageIndex: 1, pageSize: 10, keyword: '', Status: 1 },
            data_list: [],
            data_list_total: 0,
            loading: false,
        };
        this.Status = 1;
        //扩展方法用于本组件实例
        this.onPageIndexChange = onPageIndexChange.bind(this);
        this.onShowSizeChange = onShowSizeChange.bind(this);
        this.onSearch = onSearch.bind(this);
    };
    renderTabBar(props) {
        return (<View style={{ borderWidth: 1, height: 40 }} row>
            {({ style }) => <Tabs.DefaultTabBar {...props} />}
        </View>);
    }
    //调用api加载数据
    fetch = (pagingSearch) => {
        if (this.state.editMode === 'Manage') {
            this.setState({ loading: true })
        }
        pagingSearch.Status = this.Status;
        this.props.notice_list(pagingSearch)
            .then((response) => {
                var ds = new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
                });
                this.setState({
                    dataSource: ds.cloneWithRows(response.data.data_list),
                    loading: false,
                    data_list_total: response.data.data_list_total
                });
            })
            .catch((response) => {
                this.setState({ loading: false });
                let { Toast } = this;
                Toast.fail(response ? response.message : "err");
            })
    }
    componentWillMount() {
        //首次进入搜索，加载服务端字典项内容
        this.onSearch(true);
    }

    //浏览视图
    onLookView = (op, item) => {
        console.log(item);
        this.setState({
            editMode: op,//编辑模式
            currentDataModel: item,//编辑对象
        });
        switch (op) {
            case 'View':
                this.props.navigation.navigate('noticeManage_detail', { noticeID: item.NoticeID });
                break;
            case 'Search':
                this.setState({ editMode: 'Search' })
                break;
            case 'Create':
                this.setState({ editMode: 'Create' })
                break;
        }
    };
    //视图回调
    viewCallback = (dataModel) => {
        if (dataModel) {
            //如果需要更新，则刷新
            this.onSearch(true);
        }
        this.setState({ editMode: 'Manage' });
    }

    page() {

    }
    renderRow(row, id) {
        const swipeoutBtns = [
            {
                text: YSI18n.get('Delete'),
                backgroundColor: Colors.orange10,
                color: Colors.white,
                type: 'delete',
                onPress: () => {
                    Alert.alert(
                        //title
                        YSI18n.get('DeleteConfirmTitle'),
                        //content
                        YSI18n.get('DeleteConfirmContent'),
                        [
                            //cancel
                            {
                                text: YSI18n.get('Cancel'),
                                onPress: () => {
                                    console.log('Cancel Pressed')
                                },
                                style: 'cancel'
                            },
                            //ok
                            {
                                text: YSI18n.get('OK'),
                                onPress: () => {
                                    let { Toast } = this;
                                    Toast.loading(YSI18n.get('Posting'));
                                    this.props.notice_Delete(this.state.selectNoticeID)
                                        //api调用成功
                                        .then((response) => {
                                            let { Toast } = this;
                                            Toast.success(YSI18n.get('PostSuccess'));
                                            //返回后刷新数据
                                            this.onSearch(true);
                                        })
                                        //api调用失败,提示错误信息
                                        .catch((response) => {
                                            let { Toast } = this;
                                            Toast.fail(response.message);
                                        });
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
            }
        ]

        if (this.state.activeIndex == 0) {
            return (
                <Swipeout right={swipeoutBtns} disabled={row.Status != 1}
                    close={!(this.state.selectNoticeID === row.NoticeID)}
                    onOpen={() => {
                        this.setState({
                            selectNoticeID: row.NoticeID,
                        });
                    }}
                >
                    <ListItem
                        activeBackgroundColor={Colors.dark60}
                        activeOpacity={0.3}
                        height={77.5}
                        onPress={(item) => {
                            if (row.Status == 1) {
                                this.onLookView('Edit', row)
                            } else {
                                this.onLookView('View', row)
                            }
                        }
                        }
                        animation="fadeIn"
                        easing="ease-out-expo"
                        duration={1000}
                        useNativeDriver
                    >
                        <ListItem.Part middle column containerStyle={[styles.border]}>
                            <ListItem.Part containerStyle={{ marginBottom: 13, marginTop: 18 }}>
                                <View row flex-1 centerV>
                                    <Text dark10 text70 numberOfLines={1}>{row.Title}</Text>
                                </View>
                                <Text dark60 text80 style={{ marginTop: 2 }}>{row.CreatedDate}</Text>
                            </ListItem.Part>

                            <ListItem.Part containerStyle={{ marginBottom: 18 }}>
                                <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('creator')}：{row.CreateRealName}</Text>
                                <Text dark60 text80 style={{ marginTop: 2 }}>{row.StatusText}</Text>
                            </ListItem.Part>
                        </ListItem.Part>

                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <ListItem
                    activeBackgroundColor={Colors.dark60}
                    activeOpacity={0.3}
                    height={110.5}
                    onPress={(item) => this.onLookView('View', row)}
                    animation="fadeIn"
                    easing="ease-out-expo"
                    duration={1000}
                    useNativeDriver

                >
                    <ListItem.Part middle column containerStyle={[styles.border]}>
                        <ListItem.Part containerStyle={{ marginBottom: 13, marginTop: 18 }}>
                            <View row flex-1 centerV>
                                <Text dark10 text70 numberOfLines={1}>{row.Title}</Text>
                            </View>
                            <Text dark60 text80 style={{ marginTop: 2 }}>{YSI18n.get('read')}：{row.ReceiveReadSum}/{row.ReceiveSum}</Text>
                        </ListItem.Part>

                        <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                            <View row flex-1 centerV>
                                <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('creator')}：{row.CreateRealName} {YSI18n.get('createdate')}：{row.CreatedDate}</Text>
                            </View>
                        </ListItem.Part>
                        <ListItem.Part containerStyle={{ marginBottom: 18 }}>
                            <View row flex-1 centerV>
                                <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('auditor')}：{row.PublishRealName} {YSI18n.get('auditdate')}：{row.PublishDate}</Text>
                            </View>
                        </ListItem.Part>
                    </ListItem.Part>

                </ListItem>

            );
        }
    }
    render() {

        let block_tabbar = <View row center marginH-16 style={styles.tabar_wrap}>
            <TouchableOpacity style={this.state.activeIndex == 0 ? styles.touch_button_selected : styles.touch_button} onPress={() => {
                this.setState({ activeIndex: 0 });
                this.Status = 1;
                this.onSearch(true);
            }
            }>
                <Text style={this.state.activeIndex == 0 ? styles.text_touch_button_selected : styles.text_touch_button}>{YSI18n.get('WaitSend')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={this.state.activeIndex == 1 ? styles.touch_button_selected_right : styles.touch_button} onPress={() => {
                this.setState({ activeIndex: 1 })
                this.Status = 2;
                this.onSearch(true);
            }}>
                <Text style={this.state.activeIndex == 1 ? styles.text_touch_button_selected : styles.text_touch_button}>{YSI18n.get('Send')}</Text>
            </TouchableOpacity>

        </View>

        let block_listView = <ListView
            dataSource={this.state.dataSource}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />

        let block_listView_1 = <ListView
            dataSource={this.state.dataSource}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}>

                {block_tabbar}
                {block_space}
                {this.state.activeIndex == 0 && block_listView}
                {this.state.activeIndex == 1 && block_listView_1}
                {/* 分页控件 */}
                {this.state.data_list_total > this.state.pagingSearch.pageSize &&
                    <YSpage
                        onPageIndexChange={this.onPageIndexChange}
                        pageIndex={this.state.pagingSearch.pageIndex}
                        pageSize={this.state.pagingSearch.pageSize}
                        data_list={this.state.data_list || []}
                        data_list_total={this.state.data_list_total || 0}
                    />
                }
                {/* 编辑模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditMessge editMode={'Create'}
                            addSender={
                                () => this.onLookView('AddSender', {})
                            }
                            currentDataModel={{}}
                            viewCallback={this.viewCallback} />
                    </View>
                </Modal>

                {/* 新建模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Edit'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditMessge editMode={'Edit'}
                            addSender={
                                () => this.onLookView('AddSender', {})
                            }
                            currentDataModel={this.state.currentDataModel}
                            viewCallback={this.viewCallback} />
                    </View>
                </Modal>

                {/* 搜索模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'fade'}>
                    <View bg-white flex>
                        <SearchForm editMode={'Search'} current search={() => {
                            this.setState({ showSearchData: 'true', editMode: 'Manage' });
                        }}
                            viewCallback={this.viewCallback}
                            onLookView={(op, dataModel) => {
                                this.onLookView(op, dataModel)
                            }}
                        />
                    </View>
                </Modal>
                {/* 数据加载动画 */}
                {this.state.loading &&
                    <LoaderScreen
                        color={Colors.blue30}
                        message={YSI18n.get('Loading')}
                        overlay
                    />}
                <YSToast ref={(toast) => this.Toast = toast} />
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

function select(store) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        notice_list: bindActionCreators(notice_list, dispatch),
        notice_Delete: bindActionCreators(notice_Delete, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(noticeManage_index);
