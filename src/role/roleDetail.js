'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';

import { Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';

import { Tree } from '../common/YSTree'
//基本字典接口方法引入
import { loadDictionary } from '../actions/dictionary';
//组件实例模板方法引入
import { loadBizDictionary } from 'ComponentExt';

//工具类方法引入
import YSI18n from 'YSI18n';
import { getDictionaryTitle } from 'Util';

//业务接口方法引入
import { getRoleFunList } from '../actions/role';

//编辑模式
import EditRole from './editRole';

class RoleDetail extends React.Component {
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
        let { dataModel } = props.navigation.state.params;
        this.state = {
            editMode: 'View',
            dataModel,
            showTree: false,
            roleFuns: [],
        }


        //扩展方法用于本组件实例
        this.loadBizDictionary = loadBizDictionary.bind(this);

        //导航头部事件注册
        props.navigation.setParams({
            onEdit: () => {
                this.setState({ editMode: 'Edit' })
            }
        });
    }

    componentWillMount() {
        //载入需要的字典项
        this.loadBizDictionary(['dic_Status']);

        //加载角色权限数据
        this.props.getRoleFunList(this.state.dataModel.RoleID).then((response) => {
            let firstChooseTree = [];
            response.data.data_list.map((a) => {
                var key = a.split('_')[0];
                firstChooseTree = [...firstChooseTree.filter(b => b !== key), key];
            })
            this.setState({ showTree: true, roleFuns: [...firstChooseTree, ...response.data.data_list] })
        });
    }


    viewCallback = (dataModel, editMode) => {
        //删除操作
        if (editMode === 'Delete') {
            let { viewCallback } = this.props.navigation.state.params;
            if (viewCallback) {
                viewCallback({}, 'Delete');//强制刷新
            }
            this.setState({ editMode: 'View' });
            this.props.navigation.goBack();
        }
        //修改或直接返回操作
        else {
            if (dataModel) {
                //列表刷新
                let { viewCallback } = this.props.navigation.state.params;
                if (viewCallback) {
                    viewCallback(dataModel, 'Edit');//更新刷新
                }
                //如果需要更新，则刷新当前明细信息
                this.setState({ dataModel, roleFuns: dataModel.Functions })
            }
            this.setState({ editMode: 'View' });
        }

    }
    //针对当前树形组件转换功能菜单树数据结构
    convertTreeJson = () => {
        let treeNodes = [];
        let { roleFuns } = this.state;
        this.props.AllMenus.map((item) => {
            if (item.key !== 'Home') {
                //如果没有找到授权功能，功能组不添加
                if (!roleFuns.find(a => a.indexOf(item.key + '_') != -1)) {
                    return;
                }
                treeNodes.push({
                    key: item.key,
                    label: item.name,
                    children: (item.child || []).map((a) => {
                        //如果没有找到授权功能，功能添加
                        if (!roleFuns.find(b => b == a.key)) {
                            return null;
                        }
                        return {
                            key: a.key,
                            label: a.name,
                        }
                    }).filter(a => a != null)
                })
            }
        })
        return treeNodes;
    }


    renderList() {
        let treeNodes = this.convertTreeJson();
        return (
            <View paddingT-s6 marginH-s4>
                <View><YSdetailField label={YSI18n.get('RoleName')} value={this.state.dataModel.RoleName} /></View>
                <View><YSdetailField label={YSI18n.get('RoleDescription')} value={this.state.dataModel.Description} /></View>
                <View><YSdetailField label={YSI18n.get('RoleStatus')} value={getDictionaryTitle(this.state.dic_Status, this.state.dataModel.Status)} /></View>
                <View><YSdetailField label={YSI18n.get('RolePersons')} value={`${this.state.dataModel.Persons}`} /></View>
                {this.state.showTree && <View row centerV >
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <Text marginB-10 text90 dark40 >
                            {YSI18n.get('RoleFuns')}
                        </Text>

                        <Tree
                            nodeStyle={{ fontSize: 16, color: YSColors.default_color }}
                            checkable={false}
                            defaultExpandAll
                            onExpand={value => this.setState({ expandedKeys: value })}
                            treeData={treeNodes}
                        />

                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                }
            </View>

        );
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
                        <EditRole editMode={'Edit'}
                            dataModel={this.state.dataModel}
                            viewCallback={this.viewCallback} />
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
    },
    Wing_blank: {
        width: 0,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    field_wrap: {
        height: 92,
    },
    box_middle: {
        height: '100%',
    },
});

const mapStateToProps = (state) => {
    //基本字典数据
    let { Dictionarys } = state.dic;
    let { items } = state.menu;
    return { Dictionarys, AllMenus: items };
};

function mapDispatchToProps(dispatch) {
    return {
        //基本字典接口
        loadDictionary: bindActionCreators(loadDictionary, dispatch),

        //各业务接口
        getRoleFunList: bindActionCreators(getRoleFunList, dispatch),
    };
}
//redux 组件 封装
module.exports = connect(mapStateToProps, mapDispatchToProps)(RoleDetail);