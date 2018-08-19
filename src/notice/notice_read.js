
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
import { Tabs } from 'antd-mobile-rn';
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'

import YSToast from 'YSToast';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//组件实例模板方法引入
import { onSearch, onPageIndexChange, onShowSizeChange } from 'ComponentExt';

//业务处理
import { notice_ReadInfo } from '../actions/notice';

const orders = [
    {
        "name": "王彪",
        "offer": '产品经理',
        "date": '上午8:00',
        "phone": '18678789000'
    },
    {
        "name": "王彪",
        "offer": '产品经理',
        "date": '下午2:00',
        "phone": '18678789000'
    },
    {
        "name": "王彪",
        "offer": '产品经理',
        "date": '昨天',
        "phone": '18678789000'
    },

]
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});
class notice_read extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);


        this.state = {
            dataSource: ds.cloneWithRows(orders),
            activeIndex: 0,
            pagingSearch: { pageIndex: 1, pageSize: 10, Title: '', Status: 1 },
            data_list: [],
            data_list_total: 0,
            receiveType: 0,
            loading: false,
        };
        this.readStatus=2;
        //扩展方法用于本组件实例
        this.onSearch = onSearch.bind(this);
        this.onPageIndexChange = onPageIndexChange.bind(this);
        this.onShowSizeChange = onShowSizeChange.bind(this);
    };

    componentWillMount() {
        //首次进入搜索，加载服务端字典项内容
        this.onSearch(true);
    }
    //调用api加载数据
    fetch = (pagingSearch) => {
        let param = {
            noticeID: this.props.navigation.state.params.noticeID,
            readStatus: this.readStatus,
            options: pagingSearch
        }
        this.props.notice_ReadInfo(param)
            .then((response) => {
                this.setState({ ...response.data, loading: false })
            })
            .catch((response) => {
                this.setState({ loading: false });
                let { Toast } = this;
                Toast.fail(response ? response.message : "err");
            })
    }

    renderRow2(row, id) {

        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={60}
                onPress={(item) => this.onLookView('View', item)}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver

            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part containerStyle={{}}>
                        <View row flex-1 centerV>
                            <Text dark30 text60 marginR-10 numberOfLines={1}>{row.RealName}</Text>
                            <Text dark50 text60 numberOfLines={1}>{row.PositionName}</Text>
                        </View>
                        <Text dark60 text70 style={{ marginTop: 2 }}>{row.ReadDate}</Text>
                    </ListItem.Part>
                </ListItem.Part>

            </ListItem>

        );
    }
    renderRow1(row, id) {

        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={60}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver

            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part containerStyle={{}}>
                        <View row flex-1 centerV>
                            <Text dark30 text60 marginR-10 numberOfLines={1}>{row.RealName}</Text>
                            <Text dark50 text60 numberOfLines={1}>{row.PositionName}</Text>
                        </View>
                        <Text dark60 text70 style={{ marginTop: 2 }}>{row.MobilePhone}</Text>
                    </ListItem.Part>
                </ListItem.Part>

            </ListItem>

        );
    }

    render() {
        const tabs = [
            { title: YSI18n.get('Unread') },
            { title: YSI18n.get('Read') },
        ];

        let dataSource = ds.cloneWithRows(this.state.data_list);
        let toptext = '';
        switch (this.state.receiveType) {
            case 1:
            case 2:
                toptext = YSI18n.get('HeadTotal').replace('${this.state.data_list_total}', this.state.data_list_total);
                break;
            case 3:
                toptext = YSI18n.get('DepartmentTotal').replace('${this.state.data_list_total}', this.state.data_list_total);
                break;
            case 4:
            case 5:
                toptext = YSI18n.get('SchoolTotal').replace('${this.state.data_list_total}', this.state.data_list_total);
                break;
            case 6:
                toptext = YSI18n.get('ParentsTotal').replace('${this.state.data_list_total}', this.state.data_list_total);
                break;
        }
        let block_listView1 = <View>
            <View style={styles.block_header} marginT-15 centerV paddingL-16>
                <Text dark50 text70 style={styles.text_header}>{toptext}</Text>
            </View>
            <ListView
                dataSource={dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow1(row, rowId)}
            />
        </View>

        let block_listView2 = <View>
            <View style={styles.block_header} marginT-15 centerV paddingL-16>
                <Text dark50 text70 style={styles.text_header}>{toptext}</Text>
            </View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow2(row, rowId)}
            />
        </View>

        let block_tabbar = <Tabs tabs={tabs}  swipeable={false}
            initalPage={0} onTabClick={(tab, index) => {
                this.setState({ activeIndex: index})
                this.readStatus= index == 0 ? 2 : 1;
                this.onSearch();
            }}
        >
            {block_listView1}
            {block_listView2}

        </Tabs>


        return (
            <View style={styles.container}>
                {block_tabbar}
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
    }
});

function mapDispatchToProps(dispatch) {
    return {
        //各业务接口
        notice_ReadInfo: bindActionCreators(notice_ReadInfo, dispatch),
    };
}
//redux 组件 封装
module.exports = connect(null, mapDispatchToProps)(notice_read);

