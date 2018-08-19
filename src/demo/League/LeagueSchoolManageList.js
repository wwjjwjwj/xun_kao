'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { ListItem, Avatar, Modal, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
//编辑模式
import EditSchoolDetail from './editSchoolDetail';
//搜索模式
import SearchForm from './searchForm';

const datas = [
    {
        name: '李彦青',
        school: '泰安盟校',
        thumail: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        grade: '一级',
    },
    {
        name: '陈妍希',
        school: '济南盟校济南盟校济南盟校济南盟校济南盟校济南盟校',
        thumail: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        grade: '一级',
    },
    {
        name: 'Amy',
        school: '泰安盟校',
        thumail: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        grade: '一级',
    },
    {
        name: '李彦青',
        school: '泰安盟校',
        thumail: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        grade: '一级',
    },
    {
        name: 'Amy',
        school: '泰安盟校',
        thumail: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        grade: '一级',
    },
    {
        name: '陈妍希',
        school: '济南盟校济南盟校济南盟校济南盟校济南盟校济南盟校',
        thumail: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        grade: '一级',
    },
]

class LeagueSchoolManageList extends React.Component {
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
                //新增
                this.onLookView('Search', {})
            },

        })
        this.state = {
            // dataSource: ds.cloneWithRows(datas),
            onEdit: false,
            updating: false,
            currentDataModel: null,
            editMode: 'Manage',//Edit,Create,View,Delete,Manage
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
                this.props.navigation.navigate('departDetail');
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


    render() {

        let block_apply = <TouchableOpacity 　onPress={() => this.props.navigation.navigate('perfectSchoolDetail')}>
            <View flex-1 row paddingH-16 paddingV-16 style={styles.list_wrap} centerV>
                <View>
                    <Image source={{ uri: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5' }} width={90} height={100} style={styles.img_bradius} />
                    <View style={styles.block_tip} center bg-blue30><Text white text90>{YSI18n.get('待完善')}</Text></View>
                </View>
                <View centerV style={{ flex: 1 }} marginL-12>
                    <View spread row marginB-14>
                        <Text text70 dark40 numberOfLines={1}>刘涛</Text>
                        <Text text70 dark40 numberOfLines={1}>二级</Text>
                    </View>
                    <Text text60 dark10 marginB-14 >泰安泰山盟校</Text>
                    <Text text70 dark40>{YSI18n.get('申请单位')}：泰安盟校</Text>
                </View>
            </View>
        </TouchableOpacity>

        let block_listrow = datas.map((item, index) => {
            return (<TouchableOpacity onPress={() => this.props.navigation.navigate('leagueSchoolDetail')}>
                <View flex-1 row paddingH-16 paddingV-16 style={[styles.list_wrap, styles.border]} centerV>
                    <Image source={{ uri: item.thumail }} width={90} height={100} style={styles.img_bradius} />
                    <View centerV style={{ flex: 1 }} marginL-12>
                        <View spread row marginB-14>
                            <Text text70 dark40 numberOfLines={1}>{item.name}</Text>
                            <Text text70 dark40 numberOfLines={1}>{item.grade}</Text>
                        </View>
                        <Text text60 dark10 marginB-14>{item.school}</Text>
                        <Text text70 dark40>{YSI18n.get('申请单位')}:{item.school}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )
        })
        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}  >
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {block_apply}
                    {block_space}
                    {block_listrow}
                </ScrollView>

                {/* 编辑模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'slide'}>
                    <View bg-white flex>
                        <EditSchoolDetail editMode={'Create'} currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
                    </View>
                </Modal>
                {/* 搜索模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'slide'}>
                    <View bg-white flex>
                        <SearchForm editMode={'Search'} currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
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
    },

    list_wrap: {
        backgroundColor: YSColors.whiteBackGround,

    },
    block_space: {
        height: 8,
        backgroundColor: YSColors.default_bjcolor,
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
    },
    img_bradius: {
        borderRadius: 9,
        resizeMode: 'cover'
    },
    block_tip: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 20,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9
    }

});


module.exports = LeagueSchoolManageList;
