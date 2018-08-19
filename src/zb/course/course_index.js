/*
 * 课程首页
 * @flow
 * @providesModule CourseIndex
 */

'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { ListItem, Avatar, Modal, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import { Toast } from 'antd-mobile-rn';
import YSpage from 'YSpageControl';

//编辑模式
import CourseEdit from './course_edit';
//业务处理
import { courseListQuery } from '../../actions/course';

class CourseIndex extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('课程管理'),
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
    constructor(props) {
        super(props);
        props.navigation.setParams({
            onAdd: () => {
                //新增
                this.onLookView('Create', {})
            },

        });
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            data_list: [],
            onEdit: false,
            updating: false,
            currentDataModel: null,
            editMode: 'Manage',//Edit,Create,View,Delete,Manage
        };
        (this: any).getData = this.getData.bind(this);
    }

    getData() {
        var that = this;
        this.props.courseListQuery()
            //api调用成功
            .then((response) => {
                if (response.result) {
                    var _list = response.data.data_list;

                    this.setState({
                        data_list: _list,
                        dataSource: ds.cloneWithRows(_list),
                    });
                }
            })
            //api调用失败,提示登录名或密码错误
            .catch((response) => {
                Toast.fail(response.message || YSI18n.get('loginFailed'));
            })
    }

    componentWillMount() {
        this.getData();
    }

    //浏览视图
    onLookView = (op, item) => {
        this.setState({
            editMode: op,//编辑模式
            currentDataModel: item,//编辑对象
        });
        switch (op) {
            case 'View':
                this.props.navigation.navigate('CourseDetail', { currentDataModel: item });
                break;
        }
    };
    //视图回调
    viewCallback = (dataModel) => {
        if (dataModel) {
            //如果需要更新，则刷新
            if (dataModel.is_changed) {
                this.getData();
            }
        }
        this.setState({ editMode: 'Manage' });
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
                containerStyle={styles.list_wrap}
            >
                <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <View row flex-1 centerV>
                            <View style={styles.block_dot} bg-blue30 marginR-10 />
                            <Text dark10 text70 numberOfLines={1}>{row.courseSpecialty} {row.courseName}</Text>
                        </View>
                        <Text dark60 text80 style={{ marginTop: 2 }}>{row.status == 1 ? YSI18n.get('启用') : YSI18n.get('停用')}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('类型')}： {row.courseType == 1 ? YSI18n.get('授权课程') : YSI18n.get('开放课程')}</Text>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        );
    }

    render() {

        var that = this;
        let block_content = <ListView
            dataSource={this.state.dataSource}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />
        // var block_content = this.state.data_list.map((data, index) => {
        //   return <TouchableOpacity onPress={() => this.onLookView('View', data)}>
        //         <View row spread flex-1 marginT-22>
        //             <View row centerV>
        //                 <View style={styles.block_dot} bg-blue30 marginR-10 />
        //                 <Text dark10 text70 numberOfLines={1}>{data.courseSpecialty} {data.courseName}</Text>
        //             </View>
        //             <Text text80 dark40>{data.status == 1 ? '启用' : '停用'}</Text>
        //         </View>
        //         <View row spread flex-1 marginT-22>
        //             <View row centerV>
        //                 <Text dark10 text80 numberOfLines={1}>课程类型： {data.courseType == 1 ? "授权课程" : "开放课程"}</Text>
        //             </View>
        //         </View>
        //     </TouchableOpacity>
        // });
        if (!this.state.data_list.length) {
            block_content = <View marginT-22 flex centerH>
                    <Text dark60 text70 numberOfLines={1}>暂无数据</Text>
            </View>
        }

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container} >
                {block_content}
                {/* 编辑模式 */}
                <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <CourseEdit
                            editMode={'Create'}
                            currentDataModel={{}}
                            viewCallback={this.viewCallback}
                        />
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
    block_dot: {
        height: 4,
        width: 4,
    },
    list_wrap: {
        backgroundColor: 'transparent'
    },
    block_space: {
        height: 23
    }

});

function select(store) {
    var account = "";
    if (store.user && store.user.login_name) {
        account = store.user.login_name
    }
    return {
        account: account,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        courseListQuery: bindActionCreators(courseListQuery, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(CourseIndex);
