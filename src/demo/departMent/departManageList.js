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
import EditDepartInfo from './editDepartInfo';
//搜索模式
import SearchForm from './searchForm';


const datas = [
    {
        "department": "总校长",
        "children": { data: [] },
        "state": '启用',
    },
    {
        "department": "校常委会",
        "children": { data: [] },
        "state": '启用',
    },
    {
        "department": "神墨文化传承中心",
        "children": {
            data: [
                { department: '神墨书院', state: '启用' }
            ]
        },
        "state": '启用',
    },
    {
        "department": "临沂教学实践基地",
        "children": {
            data: [
                { department: '新校区管理中心', state: '启用' },
                { department: '办公管理中心', state: '停用' },
                { department: '课程管理中心', state: '停用' },
                { department: '练字研究院', state: '启用' },
                { department: '绘画研究院', state: '启用' },
                { department: '6F全脑研究院', state: '启用' },
                { department: '英语研究院', state: '启用' },
            ]
        },
        "state": '启用',
    },
    {
        "department": "神墨课程研究院",
        "children": {
            data: [
                { department: '珠心算研究院', state: '启用' },
                { department: '口才研究院', state: '启用' },
                { department: '练字研究院', state: '启用' },
                { department: '绘画研究院', state: '启用' },
                { department: '6F全脑研究院', state: '启用' },
                { department: '英语研究院', state: '启用' },
            ]
        },
        "state": '启用',
    },

]
class departManageList extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('部门管理'),
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

        })
        this.state = {
            dataSource: ds.cloneWithRows(datas),
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

        let block_content = datas.map((element, index) => {
            let block_childrens = [];
            let block_parent =
                <TouchableOpacity onPress={(item) => this.onLookView('View', item)}>
                    <View row spread flex-1 marginT-22>
                        <View row centerV>
                            <View style={styles.block_dot} bg-blue30 marginR-10 />
                            <Text dark10 text70 numberOfLines={1}>{element.department}</Text>
                        </View>
                        <Text text80 dark40>{element.state}</Text>
                    </View>
                </TouchableOpacity>

            element.children.data.map((obj, i) => {
                block_childrens.push(
                    <TouchableOpacity onPress={(item) => this.onLookView('View', item)}>
                        <View row spread flex-1 marginT-22>
                            <View row centerV marginL-40>
                                <View style={styles.block_dot} bg-blue30 marginR-10 />
                                <Text dark10 text70 numberOfLines={1}>{obj.department}</Text>
                            </View>
                            <Text text80 dark40>{element.state}</Text>
                        </View>
                    </TouchableOpacity>

                )
            })

            return (
                <View>
                    {block_parent}
                    {block_childrens}
                </View>
            )


        })

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container} paddingH-13 >
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {block_content}
                    {block_space}
                </ScrollView>

                {/* 编辑模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditDepartInfo editMode={'Create'} currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
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
    block_dot: {
        height: 4,
        width: 4,
    },
    list_wrap: {
        backgroundColor: 'transparent'
    },
    block_space:{
        height:23
    }

});


module.exports = departManageList;
