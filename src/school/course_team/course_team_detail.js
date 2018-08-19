/*
 * 课程详情
 * @flow
 * @providesModule CourseTeamDetail
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
import CourseTeamEdit from './course_team_edit';

class CourseTeamDetail extends React.Component {
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
            all_course_list: props.navigation.state.params.all_course_list
        }

    };
    renderList() {
        var d = this.state.currentDataModel;
        return (
            <View paddingT-s6 marginH-s4>
                <View><YSdetailField label={YSI18n.get('盟校名称')} value={d.organization.OrganizationName} /></View>
                <View><YSdetailField label={YSI18n.get('授权课程')} value={d.auth_courses.map(c => c.course.courseName + " ")} /></View>
                <View>
                  <Text>{d.auth_courses[0].CreatedUserRealName}创建于{d.auth_courses[0].CreatedDateStr}</Text>
                </View>
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
                        <CourseTeamEdit
                          editMode={'Edit'}
                          viewCallback={this.viewCallback}
                          currentDataModel={this.state.currentDataModel}
                          all_course_list={this.state.all_course_list}
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


module.exports = CourseTeamDetail;
