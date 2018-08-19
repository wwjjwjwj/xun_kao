/*
 * 课程详情
 * @flow
 * @providesModule CourseDetail
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
import CourseEdit from './course_edit';

class CourseDetail extends React.Component {
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
                <View><YSdetailField label={YSI18n.get('课程编号')} value={d.courseSpecialty} /></View>
                <View><YSdetailField label={YSI18n.get('课程名称')} value={d.courseName} /></View>
                <View><YSdetailField label={YSI18n.get('课程类型')} value={d.courseType == 1 ? '授权课程' : '开放课程'} /></View>
                <View><YSdetailField label={YSI18n.get('当前状态')} value={d.Status == 1 ? '启用' : '停用'} /></View>
            </View>

        );
    }

    viewCallback = (dataModel) => {
        if (dataModel) {
            //如果需要更新，则刷新当前明细信息
            if(dataModel.is_deleted){
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
                        <CourseEdit
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


module.exports = CourseDetail;
