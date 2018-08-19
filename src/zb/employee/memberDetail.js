/*
 * @flow
 * @providesModule memberDetail
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Constants, Carousel, PageControl, Card, Modal, View, Text, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';

//编辑模式
import EditMemberInfo from './editMemberInfo';
const datas = [
    {
        surname: "李小青",
        name: '小青',
        role: "总经理",
        sex: '1',
        depart: "信息化部门",
        state: '在职',
        mobile: '18673679789',
        email: 'guxq@shenmo.com',
        entry: '2018-06-06',
        password: '******',
        id: '20170601001',
        thumbnail: "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
    },


]
class memberDetail extends React.Component {
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
    renderUser() {
        return (
            <View row centerV padding-s5 >
                <Image style={styles.img_user} source={{ uri: datas[0].thumbnail }} />
                <View>
                    <View row centerV marginB-s4>
                        <Text text60 dark10 marginR-s2>顾小青</Text>
                        <Image source={datas[0].sex == 1 ? Assets.sex.ico1 : Assets.sex.ico2} />
                    </View>
                    <Text text80 dark10>ID：20170601001</Text>
                </View>
            </View>
        )
    }
    renderList() {
        return (
            <View paddingT-s4 marginH-s4>
                <View><YSdetailField label={YSI18n.get('部门')} value={datas[0].depart} /></View>
                <View><YSdetailField label={YSI18n.get('职务')} value={datas[0].role} /></View>
                <View><YSdetailField label={YSI18n.get('手机')} value={datas[0].mobile} /></View>
                <View><YSdetailField label={YSI18n.get('邮箱')} value={datas[0].email} /></View>
                <View><YSdetailField label={YSI18n.get('密码')} value={datas[0].password} /></View>
                <View><YSdetailField label={YSI18n.get('入职')} value={datas[0].entry} /></View>
                <View><YSdetailField label={YSI18n.get('状态')} value={datas[0].state} /></View>
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
                    {this.renderUser()}
                    {block_space}
                    {this.renderList()}
                </ScrollView>
                {/* 编辑模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Edit'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditMemberInfo editMode={'Edit'} viewCallback={this.viewCallback} />
                    </View>
                </Modal>
            </View>

        );
    }
}
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


module.exports = memberDetail;
