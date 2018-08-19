/*
 * 教师详情
 * @flow
 * @providesModule TeacherDetail
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Avatar, Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
//编辑模式
import TeacherEdit from './teacher_edit';

class TeacherDetail extends React.Component {
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
                this.setState({
                  editMode: 'Edit',
                })
            }
        });
        this.state = {
            editMode: 'View',
            currentDataModel: props.navigation.state.params.currentDataModel,
        }
    };
    renderList() {
        var d = this.state.currentDataModel;
        return (
            <View paddingT-s6 marginH-s4>
                <View>
                  <Avatar
                    size={54}
                    imageSource={d.user.icon ? { uri: d.user.icon } : null}
                    label={d.user.name}
                    labelColor={Colors.white}
                    backgroundColor={'#837F7F'}
                    containerStyle={{ marginHorizontal: 13, }}
                  />
                </View>
                <View><YSdetailField value={d.user.name}/></View>
                <View><YSdetailField label={YSI18n.get('描述')} value={d.teacher.Description}/></View>
                <View><YSdetailField label={YSI18n.get('身份证号')} value={d.teacher.IDCard}/></View>
                <View><YSdetailField label={YSI18n.get('学历')} value={d.teacher.Education}/></View>
                <View><YSdetailField label={YSI18n.get('账号')} value={d.user.username}/></View>
                <View><YSdetailField label={YSI18n.get('密码')} value={"*****"}/></View>
                <View><YSdetailField label={YSI18n.get('手机号')} value={d.user.mobilePhone}/></View>
                <View><YSdetailField label={YSI18n.get('邮箱')} value={d.user.email}/></View>
                <View><YSdetailField label={YSI18n.get('银行卡号')} value={d.teacher.BankCardNum}/></View>
                <View><YSdetailField label={YSI18n.get('入职时间')} value={d.teacher.EntryDate}/></View>
                <View><YSdetailField label={YSI18n.get('角色')} value={"无"}/></View>
                <View><YSdetailField label={YSI18n.get('状态')} value={d.teacher.Status == 1 ? '在职' : '离职'}/></View>
            </View>

        );
    }

    viewCallback = (dataModel) => {
        if (dataModel) {
            //如果需要更新，则刷新当前明细信息
            if(dataModel.is_changed){
              this.props.navigation.goBack();
            }
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
                        <TeacherEdit
                          editMode={'Edit'}
                          viewCallback={this.viewCallback}
                          currentDataModel={this.state.currentDataModel}
                        />
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


module.exports = TeacherDetail;
