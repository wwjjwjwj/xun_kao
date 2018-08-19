/*
 * @flow
 * @providesModule roleDetail
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
//编辑模式
import EditRole from './editRole';

const datas = [
    {
        "name": "教务管理",
        "description": '文字输入，角色描述，字数太多？正常显示即可，自动折行，调整距离设备的间距。',
        "funDescription": '1、系统管理：用户权限管理、操作用户管理； 2、教师信息管理：授课教师管理',
        "state": '启用',

    },
]

class roleDetail extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.state.params.onEdit()
                }}>
                    <Image source={Assets.icons.edit} />
                </TouchableOpacity>
            ),
        }
    }
    constructor(props: Props) {
        super(props);
        props.navigation.setParams({
            onEdit: () => {
                this.setState({ editMode: 'Edit' })
            }
        });
        this.state = {
            editMode: 'View'
        }

    };
    renderList() {
        return (
            <View paddingT-s6 marginH-s4>
                <View><YSdetailField label={YSI18n.get('角色名称')} value={datas[0].name} /></View>
                <View><YSdetailField label={YSI18n.get('角色描述')} value={datas[0].description} /></View>
                <View><YSdetailField label={YSI18n.get('当前状态')} value={datas[0].state} 人 /></View>
                <View><YSdetailField label={YSI18n.get('功能权限')} value={datas[0].funDescription} /></View>
            </View>

        );
    }

    viewCallback = (dataModel) => {
        if (dataModel) {
            //如果需要更新，则刷新当前明细信息
        }
        this.setState({ editMode: 'View' });
    }

    render() {
        let block_space = <View style={styles.grayspace} bg-dark80 ></View>

        return (
            <View flex bg-white>
                <ScrollView contentContainerStyle={styles.container}>
                    {this.renderList()}
                </ScrollView>
                {/* 编辑模式 */}
                 <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Edit'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditRole editMode={'Edit'} viewCallback={this.viewCallback} />
                    </View>
                </Modal> 
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    img_user: {
        borderRadius: BorderRadiuses.br30,
        width: 70,
        height: 70,
        resizeMode: 'cover',
        marginRight: 15
    },
    grayspace: {
        height: 13,
    }

});


module.exports = roleDetail;
