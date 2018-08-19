/*
 * @flow
 * @providesModule roleManageList
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { ListItem, Avatar, Modal, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
// //编辑模式
import EditRole from './editRole';


// //搜索模式
// import SearchForm from './searchForm';


const datas = [
    {
        "name": "教务管理",
        "functioner": 6,
        "person": 7,
        "state": '启用',

    },
    {
        "name": "招生主管",
        "functioner": 6,
        "person": 7,
        "state": '启用',
    },
    {
        "name": "财务主管",
        "functioner": 6,
        "person": 7,
        "state": '启用',
    },



]
class roleManageList extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('角色管理'),
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
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

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
        this.state = {
            dataSource: ds.cloneWithRows(datas),
            onEdit: false,
            updating: false,
            currentDataModel: null,
            editMode: 'Manage',//Edit,Create,View,Delete,Manage
            showSearchData:false,
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
                this.props.navigation.navigate('roleDetail');
                break;
            case 'Search':
                this.setState({ editMode: 'Search' })
                break;
        }
    };
    //视图回调
    onViewCallback = (dataModel) => {
        if (!dataModel) {
            this.setState({ currentDataModel: null, editMode: 'Manage' })
        }
    }

    page() {

    }

    renderRow(row, id) {

        return (
            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={80}
                onPress={(item) => this.onLookView('View', item)}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                containerStyle={styles.list_wrap}
                useNativeDriver
                style={{ backgroundColor: Colors.white }}

            >
                <ListItem.Part middle column containerStyle={[styles.border, { paddingHorizontal: 17 }]}>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <View row flex-1 centerV>
                            <View style={styles.block_dot} bg-blue30 marginR-10 />
                            <Text dark10 text70 numberOfLines={1}>{row.name}</Text>
                        </View>
                        <Text dark60 text80 style={{ marginTop: 2 }}>{row.state}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>功能权限：{row.functioner} 已授权：{row.person}人</Text>
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

             
                {/* 编辑模式 */}
                <Modal visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditRole editMode={'Create'} current viewCallback={(dataModel) => {
                            this.setState({ editMode: 'Manage' });
                        }} />
                    </View>
                </Modal>

                {/* 搜索模式 */}
                {/* <Modal visible={this.state.editMode === 'Search'} animationType={'fade'}>
                    <View bg-white flex>
                        <SearchForm editMode={'Search'} current viewCallback={(dataModel) => {
                            this.setState({ editMode: 'Manage' });
                        }} />
                    </View>
                </Modal>  */}
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
    },
    block_dot: {
        height: 18,
        width: 4,
    },
    list_wrap: {
        backgroundColor: 'transparent'
    }

});


module.exports = roleManageList;
