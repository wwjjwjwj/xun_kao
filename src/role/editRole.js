'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import YSToast from 'YSToast';
import { Tree } from '../common/YSTree'


//基本字典接口方法引入
import { loadDictionary } from '../actions/dictionary';
//组件实例模板方法引入
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
//工具类方法引入
import YSI18n from 'YSI18n';
import { getDictionaryTitle, dataBind } from 'Util';

//业务接口方法引入
import { getRoleList, saveRoleInfo, deleteRoleInfo, getRoleFunList } from '../actions/role';

class EditRole extends React.Component {
    constructor(props: Props) {
        super(props);

        let { RoleName, Description, Status = 1 } = props.dataModel;
        this.state = {
            RoleName, Description, Status,//修改数据项
            roleFuns: [],
            showTree: false,
            selectedKeys: [],
            expandedKeys: [],
        };

        //扩展方法用于本组件实例
        this.loadBizDictionary = loadBizDictionary.bind(this);
        this.initFormValid = initFormValid.bind(this);
        this.getFormValid = getFormValid.bind(this);
        this.getTextInputValidator = getTextInputValidator.bind(this);
    };

    componentWillMount() {
        //载入需要的字典项
        this.loadBizDictionary(['dic_Status']);

        //表单验证初始化
        this.initFormValid(["RoleName", "Description"]);

        //加载角色权限数据
        if (this.props.editMode === 'Edit') {
            this.props.getRoleFunList(this.props.dataModel.RoleID).then((response) => {
                let firstChooseTree = [];
                response.data.data_list.map((a) => {
                    var key = a.split('_')[0];
                    firstChooseTree = [...firstChooseTree.filter(b => b !== key), key];
                })
                let selectedKeys = [...firstChooseTree, ...response.data.data_list];
                this.setState({ showTree: true, selectedKeys, roleFuns: selectedKeys })
            });
        }
        else {//新增情况下
            this.setState({ showTree: true })
        }
    }

    //针对当前树形组件转换功能菜单树数据结构
    convertTreeJson = () => {
        let treeNodes = [];
        this.props.AllMenus.map((item) => {
            if (item.key !== 'Home') {
                treeNodes.push({
                    key: item.key,
                    label: item.name,
                    children: (item.child || []).map((a) => {
                        return {
                            key: a.key,
                            label: a.name,
                        }
                    })
                })
            }
        })
        return treeNodes;
    }

    //取消
    onCancel = () => {
        this.props.viewCallback()
    }
    //保存
    onSave = () => {
        //校验失败则返回
        if (!this.getFormValid(["RoleName", "Description"])) {
            return;
        }
        //隐藏键盘
        dismissKeyboard();
        let { Toast } = this;
        //提前角色授权功能（排除功能组影响)
        let Functions = this.state.selectedKeys.filter(a => a.indexOf('_') != -1);
        let { RoleName, Description, Status } = this.state;
        //合并数据集
        let dataModel = { ...this.props.dataModel, RoleName, Description, Status, Functions };
        Toast.loading(YSI18n.get('Posting'));
        this.props.saveRoleInfo(dataModel)
            //api调用成功
            .then((response) => {
                //返回后刷新数据
                this.props.viewCallback(dataModel, this.props.editMode)
            })
            //api调用失败,提示错误信息
            .catch((response) => {
                Toast.fail(response.message);
            });
    }

    //删除
    onDelete = () => {
        Alert.alert(
            //title
            YSI18n.get('DeleteConfirmTitle'),
            //content
            YSI18n.get('DeleteConfirmContent'),
            [
                //cancel
                {
                    text: YSI18n.get('Cancel'),
                    onPress: () => {
                        console.log('Cancel Pressed')
                    },
                    style: 'cancel'
                },
                //ok
                {
                    text: YSI18n.get('OK'),
                    onPress: () => {
                        let { Toast } = this;
                        Toast.loading(YSI18n.get('Posting'));
                        this.props.deleteRoleInfo(this.props.dataModel.RoleID)
                            //api调用成功
                            .then((response) => {
                                Toast.success(YSI18n.get('PostSuccess'));
                                //返回后刷新数据
                                this.props.viewCallback(this.props.dataModel, 'Delete')
                            })
                            //api调用失败,提示错误信息
                            .catch((response) => {
                                Toast.fail(response.message);
                            });
                    }
                },
            ],
            { cancelable: false }
        )
    }

    renderRadioButton(value, text) {
        return (
            <View row centerV marginB-5 >
                <RadioButton value={value} />
                <Text marginL-15 marginR-50>{text}</Text>
            </View>
        );
    }


    renderList() {
        //表单验证器
        const roleNameValidator = this.getTextInputValidator('RoleName', true)
        const descriptionValidator = this.getTextInputValidator('Description', false, (text) => {
            return (text.length <= 150);//文字数量
        })

        let treeNodes = this.convertTreeJson();

        return (
            <View paddingT-s6  >
                <View row centerV style={[styles.field_wrap]} >
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...roleNameValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('RoleName')}
                            helperText={YSI18n.get('PleaseInput')}
                            maxLength={20}
                            value={this.state.RoleName}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV marginB-32 style={styles.field_wrap}>
                    <View style={styles.Wing_blank}>{false && <Text red10 text70>*</Text>}</View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...descriptionValidator}
                            multiline
                            floatingPlaceholder
                            placeholder={YSI18n.get('RoleDescription')}
                            helperText={YSI18n.get('PleaseInput')}
                            maxLength={150}
                            value={this.state.Description}
                            style={{ marginTop: 14 }}
                            showCharacterCounter
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <RadioGroup value={dataBind(this.state.Status)} onValueChange={value => {
                            let { Status } = this.state;
                            Status = value;
                            this.setState({ Status })
                        }}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('RoleStatus')}
                            </Text>
                            <View row >
                                {this.state.dic_Status.map((item, index) => {
                                    return this.renderRadioButton(item.value, item.title)
                                })
                                }
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                {this.state.showTree && <View row centerV >
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <Text marginB-10 text90 dark40 >
                            {YSI18n.get('RoleFuns')}
                        </Text>

                        <Tree
                            nodeStyle={{ fontSize: 16, color: YSColors.default_color }}
                            checkable={true}
                            defaultSelectedKeys={this.state.roleFuns}
                            defaultExpandAll
                            onSelect={value => {
                                this.setState({ selectedKeys: value })
                            }}
                            onExpand={value => this.setState({ expandedKeys: value })}
                            treeData={treeNodes}
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                }
            </View >

        );
    }

    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>

        let block_button_del = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            outline
            text60
            marginB-s4
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('Delete')}
            onPress={this.onDelete} />

        return (
            <View flex bg-white>
                <YSToast ref={(toast) => this.Toast = toast} />
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={this.onCancel}
                    onDone={this.onSave}
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={YSI18n.get('Save')}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4>
                        {this.renderList()}
                        {this.props.editMode === 'Edit' && block_button_del}
                    </View>
                </KeyboardAwareScrollView>
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    hasborderline: {
        borderBottomWidth: 1,
        borderColor: Colors.dark70
    },
    whitespace: {
        height: 33,
    },
    button_wrap: {
        width: '100%',
        marginTop: 30
    },
    noborder: {
        borderBottomWidth: 0,
    },
    button_reset: {
        position: 'absolute',
        right: 0,
        top: 5,
    },
    img_user: {
        width: 92,
        height: 92,
        resizeMode: 'cover',
        borderRadius: 9

    },
    Wing_blank: {
        width: 13,
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
    ico_dropdown: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        position: 'absolute',
        top: 5,
        right: 0,
    },
    disableColor: {
        color: Colors.dark40,
    },
    modalTitle: {
        fontSize: 17,
        color: Colors.dark10,
    },
    tree_wrap: {
        height: 100,

    }
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
        saveRoleInfo: bindActionCreators(saveRoleInfo, dispatch),
        deleteRoleInfo: bindActionCreators(deleteRoleInfo, dispatch),
        getRoleFunList: bindActionCreators(getRoleFunList, dispatch),
    };
}
//redux 组件 封装
module.exports = connect(mapStateToProps, mapDispatchToProps)(EditRole);