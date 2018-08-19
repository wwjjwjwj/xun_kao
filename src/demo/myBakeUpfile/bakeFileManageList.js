/*
 * @flow
 * @providesModule bakeFileManageList
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
import YSEmptyData from 'YSEmptyData';
import AddBakeFile from './addbakeFile';


const orders = [{
    titleName: '调整消息界面',
    createDate: '2018.06.16 18:00'
},
{
    titleName: '删除为永久删除',
    createDate: '2018.06.16 18:00'
},
{
    titleName: '备忘录展示按创建时间排序',
    createDate: '2018.06.16 18:00'
}
]

class bakeFileManageList extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        //顶部按钮事件处理

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            currentDataModel: null,
            editMode: 'Manage',//Edit,Create,View,Delete,Manage
            dataSource: ds.cloneWithRows(orders),
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
            case 'Create':
                this.setState({ editMode: 'Create' })
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

    renderRow(row, id) {
        return (
            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={70}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                onPress={()=>this.props.navigation.navigate('bakeFileDetail')}
                useNativeDriver
            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part >
                        <Text dark10 text70 numberOfLines={1}>{row.titleName}</Text>
                        <TouchableOpacity><Image source={Assets.icons.del} /></TouchableOpacity>
                    </ListItem.Part>

                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <Text text80 dark40 numberOfLines={1}>{row.createDate}</Text>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        );
    }
    render() {

        let block_listView = null
        if (orders.length > 0) {
            block_listView = <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
            />
        } else {
            block_listView = <YSEmptyData first_title={YSI18n.get('暂无备忘录')} />
        }

        let block_bottom_add = <View center style={styles.block_add}>
            <TouchableOpacity onPress={() => this.setState({ editMode: 'Create' })}>
                <Image source={Assets.icons.add} />
            </TouchableOpacity>
        </View>


        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}>
                {block_listView}
                {block_bottom_add}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'slide'}>
                    <View bg-white flex>
                        <AddBakeFile editMode={'Create'} currentDataModel={this.state.currentDataModel} viewCallback={this.viewCallback} />
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

    block_add: {
        height: 47,
        backgroundColor: '#fafafa',
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
    }


});

module.exports = bakeFileManageList;
