'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, ListItem, Avatar, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
//编辑模式
// import EditMemberInfo from './editMemberInfo';
//搜索模式
// import SearchForm from './searchForm';

const orders = [
    {
        "name": 'C01 珠心算',
        "type": "授权课程",
        "state": '启用'
    },
    {
        "name": 'C02 珠心算',
        "type": "授权课程",
        "state": '启用'
    },
    {
        "name": 'C03 珠心算',
        "type": "授权课程",
        "state": '启用'
    },
    {
        "name": 'C04 珠心算',
        "type": "授权课程",
        "state": '启用'
    },


]
class courseManageList extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('员工管理'),
            headerRight: (
                <View row>
                   
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
                this.props.navigation.navigate('memberDetail');
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
    renderRow(row, id) {

        return (
            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={77.5}
                onPress={(item) => this.onLookView('View', item)}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver
                containerStyle={styles.list_wrap}

            >
                <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <View row flex-1 centerV>
                            <View style={styles.block_dot} bg-blue30 marginR-10 />
                            <Text dark10 text70 numberOfLines={1}>{row.name}</Text>
                        </View>
                        <Text dark60 text80 style={{ marginTop: 2 }}>{row.state}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>类型：{row.type}</Text>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        );
    }
    render() {
        let block_listView = <ListView
            dataSource={this.state.dataSource}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />
        let block_search_title = <View row centerH marginV-40><Text text80 blue30 centerH >{YSI18n.get('以下为全部搜索内容')}</Text></View>
        let block_button_clear = <View row centerH marginV-40><Button
            label={YSI18n.get('清除搜索内容')}
            outline
            size='large'
            centerH
            onPress={() => this.setState({ showSearchData: false })}
            borderRadius={9}
            text60
            marginB-s4 />
        </View>

        return (
            <View style={styles.container}>
                {/* 搜索返回结果列表才显示 */}
                {this.state.showSearchData && block_search_title}

                {block_listView}

                {/* 搜索返回结果列表才显示 */}
                {this.state.showSearchData && block_button_clear}

                {!this.state.showSearchData && <YSpage page={() => this.page()} />}

                {/* 编辑模式 */}
                {/* <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditMemberInfo editMode={'Create'} currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
                    </View>
                </Modal> */}

                {/* 搜索模式 */}
                {/* <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'fade'}>
                    <View bg-white flex>
                        <SearchForm editMode={'Search'} current search={() => {
                            this.setState({ showSearchData: 'true', editMode: 'Manage' });
                        }}
                            viewCallback={(dataModel) => {
                                this.setState({ editMode: 'Manage' });
                            }} />
                    </View>
                </Modal> */}

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
        marginLeft: 13
    },
    block_dot: {
        height: 18,
        width: 4,
    },
    list_wrap: {
        backgroundColor: 'transparent'
    }
});

module.exports = courseManageList;
