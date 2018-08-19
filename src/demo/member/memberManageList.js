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
import EditMemberInfo from './editMemberInfo';
//搜索模式
import SearchForm from './searchForm';

const orders = [
    {
        "surname": "李小青",
        "name": '小青',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/cda177_5c6d2cd3b71a41caa54309301e1dd0d7.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": ""
    },
    {
        "surname": "李小青",
        "name": '小青',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/cda177_5c6d2cd3b71a41caa54309301e1dd0d7.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": ""
    },
    {
        "surname": "李小青",
        "name": '小青',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/cda177_5c6d2cd3b71a41caa54309301e1dd0d7.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": ""
    },
    {
        "surname": "李小青",
        "name": '小青',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/cda177_5c6d2cd3b71a41caa54309301e1dd0d7.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": ""
    },
    {
        "surname": "李小青",
        "name": '小青',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": "https://static.wixstatic.com/media/cda177_5c6d2cd3b71a41caa54309301e1dd0d7.jpg_128"
    },
    {
        "surname": "姜吉祥",
        "name": '吉祥',
        "job": "总经理",
        "state": '在职',
        "accounter": 'SHM201861101',
        "thumbnail": ""
    },
]
class memberManageList extends React.Component {
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

            >
                <ListItem.Part left>
                    <Avatar
                        size={54}
                        imageSource={row.thumbnail ? { uri: row.thumbnail } : null}
                        label={row.name}
                        labelColor={Colors.white}
                        backgroundColor={'#837F7F'}
                        containerStyle={{ marginHorizontal: 13, }}
                    />

                </ListItem.Part>
                <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <Text dark10 text70 numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>{row.surname} <Text dark40 text70 numberOfLines={1}>{row.job}</Text></Text>
                        <Text dark60 text90 style={{ marginTop: 2 }}>{row.state}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={{ flex: 1, marginRight: 10 }} text80 dark40 numberOfLines={1}>{`帐号:${row.accounter}`}</Text>
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
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditMemberInfo editMode={'Create'} currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
                    </View>
                </Modal>

                {/* 搜索模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'fade'}>
                    <View bg-white flex>
                        <SearchForm editMode={'Search'} current search={() => {
                            this.setState({ showSearchData: 'true', editMode: 'Manage' });
                        }}
                            viewCallback={(dataModel) => {
                                this.setState({ editMode: 'Manage' });
                            }} />
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
        marginLeft: 13
    },
});

module.exports = memberManageList;
