/*
 * @flow
 * @providesModule notice_edit
 */

'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, View, Text, Typography, BorderRadiuses, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { ActionSheet } from 'antd-mobile-rn';
import ImagePicker from 'react-native-image-crop-picker';
import { serverURL, getToken } from '../env';
import YSToast from 'YSToast';
//上传组件
var RNUploader = require('NativeModules').RNUploader;

import SelectDepartment from './notice_department';
import SelectAuditPerson from './notice_AuditPerson';
import { dataBind } from 'Util';
//业务接口方法引入
import { notice_Save } from '../actions/notice';


const initDatas =
{
    NoticeID: '00000000-0000-0000-0000-000000000000',
    ReceiveType: 0,//接收人类型：1全员;2员工3部门；4盟校；5全部盟校；6家长；
    ReceiveParamText: '',//接收人
    ReceiveParam: '',//接受人参数按“，”分割的id
    ExamineUsers: '',//审核人参数按“，”分割的id
    Title: '',
    isTop: 1,
    TopNum: 0,
    Content: '',
    Status: 1
}
const initReceive = {
    ReceiveType: 0,
    ReceiveParamText: '',
    ReceiveParam: '',
}
const initAudit = {
    ExamineUsers: '',//审核人参数按“，”分割的id
    ExamineUsersText: '',//审核人姓名
}

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class notice_edit extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.initFormValid = initFormValid.bind(this);
        this.getFormValid = getFormValid.bind(this);
        this.state = {
            visible: false,
            ModeType: 'Edit',//Edit,Receive,Audit
            showActionSheet: false,
            isTop: 1,
            enableSend: false,
            selectModelData: {
                ReceiveType: 0,
                selectItem: []
            },
            selectAuditData: {
                selectItem: []
            },
            noticeData: initDatas,
            ReceiveData: initReceive,
            AuditData: initAudit,
            uploadFiles: [],
        };
    };

    componentWillMount() {
        //表单验证初始化
        this.initFormValid(["Title", "Content"]);
        if (this.props.currentDataModel.NoticeID) {
            let noticeData = this.props.currentDataModel;
            let receiveParamText = [];
            let selectItem = [];
            switch (this.props.currentDataModel.ReceiveType) {
                case 1:
                case 5:
                case 6:
                    selectItem = [{ selectedKey: 'root', selectedLabel: '全部选中' }];
                    break;
                case 2:
                case 3:
                case 4:
                    receiveParamText = this.props.currentDataModel.ReceiveParamText.split(',');
                    this.props.currentDataModel.ReceiveParam.split(',').map((item, index) => {
                        selectItem = [...selectItem, { selectedKey: item, selectedLabel: receiveParamText[index] }];
                    });
                    break;
            }
            let selectModelData = {
                ReceiveType: this.props.currentDataModel.ReceiveType,
                selectItem: selectItem
            };
            selectItem = [];
            let examineUsersText = this.props.currentDataModel.ExamineUsersText.split(',');
            this.props.currentDataModel.ExamineUsers.split(',').map((item, index) => {
                selectItem = [...selectItem, { selectedKey: item, selectedLabel: examineUsersText[index] }];
            })
            let selectAuditData = {
                selectItem: selectItem
            }
            let ReceiveData = {
                ReceiveType: this.props.currentDataModel.ReceiveType,
                ReceiveParamText: this.props.currentDataModel.ReceiveParamText,
                ReceiveParam: this.props.currentDataModel.ReceiveParam
            }
            let AuditData = {
                ExamineUsers: this.props.currentDataModel.ExamineUsers,
                ExamineUsersText: this.props.currentDataModel.ExamineUsersText
            }
            let uploadFiles = this.props.currentDataModel.NoticeFileList;

            this.setState({
                noticeData, selectModelData, selectAuditData, ReceiveData, AuditData, uploadFiles,
                Content: this.props.currentDataModel.Content, Title: this.props.currentDataModel.Title,
                TopNum: this.props.currentDataModel.TopNum, TitleError: false, ContentError: false,isTop: this.props.currentDataModel.IsTop
            });
        }

    }
    //保存
    onSave = (status) => {
        let { Toast } = this;
        //校验失败则返回
        if (!this.getFormValid(["Title", "Content"])) {
            return;
        }
        //校验接收人、审核人
        if (!this.state.ReceiveData.ReceiveType || this.state.ReceiveData.ReceiveType == 0) {
            Toast.fail(YSI18n.get('请选择接收人'));
            return;
        }
        if (!this.state.AuditData.ExamineUsers || this.state.AuditData.ExamineUsers.length <= 0) {
            Toast.fail(YSI18n.get('请选择审核人'));
            return;
        }
        if (this.state.isTop == 1 && !this.state.TopNum) {
            Toast.fail(YSI18n.get('请填写置顶天数'));
            return;
        }
        //隐藏键盘
        dismissKeyboard();
        //合并数据
        let noticeData = this.state.noticeData;
        let { ReceiveType, ReceiveParam, ReceiveParamText } = this.state.ReceiveData;
        let { ExamineUsers } = this.state.AuditData;
        let { isTop, Title, TopNum, Content } = this.state;
        noticeData = { ...noticeData, ReceiveType, ReceiveParam, ReceiveParamText, ExamineUsers, isTop, Title, TopNum, Content, Status: status };

        let noticeFiles = [];
        this.state.uploadFiles.map((item, index) => {
            noticeFiles = [...noticeFiles, { FilePath: item.attachment_info.FilePath, FileName: item.attachment_info.FileName, OrderNum: index + 1 }];
        })

        let dataModel = { NoticeInfo: noticeData, NoticeFiles: noticeFiles };
        this.props.notice_Save(dataModel)
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
        const titleValidator = this.getTextInputValidator('Title', false, (text) => {
            return (text.length > 2);
        })
        const contentValidator = this.getTextInputValidator('Content', false, (text) => {
            return (text.length > 2);
        })
        const topNumValidator = this.getTextInputValidator('TopNum', false, (text) => {
            if (this.state.isTop == 1) {
                return (text.length > 0);
            } else {
                return true;
            }
        })


        let noticeData = this.state.noticeData;
        let receiveData = this.state.ReceiveData;
        let auditdata = this.state.AuditData;
        let receiveParamText = receiveData.ReceiveParamText;
        switch (receiveData.ReceiveType) {
            case 2:
                receiveParamText = YSI18n.get('EmployeesText').replace('${receiveParamText}', receiveParamText)
                break;
            case 3:
                receiveParamText = YSI18n.get('DepartmentText').replace('${receiveParamText}', receiveParamText)
                break;
            case 4:
                receiveParamText = YSI18n.get('SchoolText').replace('${receiveParamText}', receiveParamText)
                break
        }

        return (
            <View paddingT-s6  >
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('Recipient')} value={receiveParamText} />
                        <TouchableOpacity style={[styles.touch_img_right, { top: 22 }]} onPress={() => this.onEditLookView('Receive', this.state.selectModelData)}>
                            <Image source={Assets.icons.small_add} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <YSdetailField label={YSI18n.get('auditor')} value={auditdata.ExamineUsersText} />
                        <TouchableOpacity style={[styles.touch_img_right, { top: 22 }]}
                            onPress={() => this.onAuditLookView('Audit', this.state.selectAuditData)}>
                            <Image source={Assets.icons.small_add} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
                <View row centerV style={styles.field_wrap}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...titleValidator}
                            floatingPlaceholder
                            placeholder={YSI18n.get('Title')}
                            helperText={YSI18n.get('PleaseTitle')}
                            maxLength={20}
                            value={noticeData.Title}
                        />
                        <TouchableOpacity style={styles.touch_img_right}>
                            <Image source={Assets.icons.link_color} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                <View row centerV style={[styles.field_wrap, { height: 70 }]}>
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={[styles.box_middle, styles.hasborderline]}>
                        <RadioGroup value={this.state.isTop} onValueChange={value => this.setState({ isTop: value })}>
                            <Text marginB-16 text90 dark40 >
                                {YSI18n.get('IsTop')}
                            </Text>
                            <View row >
                                {this.renderRadioButton(1, YSI18n.get('dic_YesNo_1'))}
                                {this.renderRadioButton(0, YSI18n.get('dic_YesNo_0'))}
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>

                {this.state.isTop== 1 && <View centerV row marginV-16 style={[styles.field_wrap]} >
                    <View style={styles.Wing_blank}></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...topNumValidator}
                            multiline
                            floatingPlaceholder
                            placeholder={YSI18n.get('TopNum')}
                            helperText={YSI18n.get('PleaseInput')}
                            value={noticeData.TopNum.toString()}

                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>}
                <View centerV row marginV-16 style={[styles.field_wrap]}>
                    <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                    <View flex-1 style={styles.box_middle}>
                        <TextInput
                            {...contentValidator}
                            multiline
                            floatingPlaceholder
                            placeholder={YSI18n.get('Content')}
                            helperText={YSI18n.get('PleaseInput')}
                            value={noticeData.Content}
                            style={{ marginTop: 10 }}
                            showCharacterCounter
                        />
                    </View>
                    <View style={styles.Wing_blank}></View>
                </View>
            </View >

        );
    }

    renderProfile() {
        let uploadFiles = this.state.uploadFiles;
        let uploadFiles_view = uploadFiles.map(item => {
            return (
                <View marginH-5 marginB-10 style={{ width: (YSWHs.width_window) / 2 - 32, }}>
                    <TouchableOpacity style={{ height: YSWHs.width_window / 3.4 }}>
                        <Image source={{ uri: item.image_url }} width={'100%'} height={'100%'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.img_close} onPress={() => {
                        this.setState({ uploadFiles: this.state.uploadFiles.filter(a => a.biz_id != item.biz_id) });
                    }}>
                        <Image source={Assets.icons.close} />
                    </TouchableOpacity>
                </View>
            );
        })
        return <View row cener marginH-5 marginB-10 style={{ flexWrap: 'wrap' }}>
            {uploadFiles_view}
            <View marginH-5 marginB-10 cell center style={{ width: (YSWHs.width_window) / 2 - 32 }}>
                <TouchableOpacity style={styles.touch_add} onPress={() => this.showActionSheetPhoto()}>
                    <Image source={Assets.icons.add_file} />
                </TouchableOpacity>
            </View>
        </View>
    }

    showActionSheet = () => {
        const BUTTONS = [YSI18n.get('Savedraft'), YSI18n.get('Cancel')];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
            wrapProps,
        },
            (buttonIndex) => {
                if (buttonIndex == 0) {
                    this.onSave(1);
                } else {
                    this.props.viewCallback()
                }
            });
    }
    showActionSheetPhoto = () => {
        const BUTTONS = [YSI18n.get('Photograph'), YSI18n.get('Photoalbum'), YSI18n.get('Cancel')];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
            wrapProps,
        },
            (buttonIndex) => {
                // this.props.viewCallback()
                //this.setState({ clicked: BUTTONS[buttonIndex] });
                let that = this;
                if (buttonIndex == 0) {
                    //拍照
                    ImagePicker.openCamera({
                    }).then(image => {
                        //批量上传
                        that.doUploadV2([image]);
                    });

                }
                else if (buttonIndex == 1) {
                    //多选上传图片
                    ImagePicker.openPicker({
                        mediaType: "photo",
                        multiple: true
                    }).then(images => {
                        //alert(JSON.stringify(images))             
                        console.log('images->' + JSON.stringify(images));
                        //批量上传
                        that.doUploadV2(images);
                    }).catch(err => {
                        //用户取消
                        console.log('images-err->' + err)
                    });
                }
            });
    }
    //上传附件
    doUploadV2(chooseFiles) {
        var getFileInfo = function (selectedFileInfo) {
            let defaultFileName = selectedFileInfo.path.substr(selectedFileInfo.path.lastIndexOf('/') + 1);
            return {
                filename: defaultFileName,
                filepath: selectedFileInfo.path, // image from camera roll/assets library
                filetype: selectedFileInfo.mime || 'video/mp4',
            }
        }
        //批量上传的文件
        let batchUploadFiles = chooseFiles.map((a, index) => {
            let fileInfo = getFileInfo(a);
            return [{
                name: `file[${index}]`,
                filename: fileInfo.filename,
                filepath: fileInfo.filepath,  // image from camera roll/assets library
                filetype: fileInfo.filetype,
            }];
        });

        let uploadFileIndex = 0;
        let isUploading = false;
        //循环上传
        this.batchUploadTimer = setInterval(() => {
            let { Toast } = this;
            //上传完成后退出
            if (uploadFileIndex + 1 >= batchUploadFiles.length) {
                clearInterval(this.batchUploadTimer);
            }
            //如果在上传中，则跳过
            if (isUploading) {
                return;
            }
            else if (uploadFileIndex < batchUploadFiles.length) {
                uploadFileIndex++;
                isUploading = true;//正在上传
            }
            Toast.show(`(${uploadFileIndex}/${batchUploadFiles.length})上传中...`);
            let files = batchUploadFiles[uploadFileIndex - 1];
            let opts = {
                url: serverURL + 'Notice/UploadNoticeFiles',
                files: files,
                method: 'POST',                             // optional: POST or PUT
                headers: { 'Accept': 'application/json', token: getToken() },  // optional
                params: {},                   // optional
            };
            RNUploader.upload(opts, (err, response) => {
                if (err) {
                    this.setState({ showUploadProgressInfo: false, uploadProgressInfo: '' });
                    Toast.show(`(${uploadFileIndex}/${batchUploadFiles.length})${jsonResult.message}`)
                    //上传过程失败操作
                    setTimeout(() => {
                        isUploading = false;
                    }, 1000);
                    return;
                }
                //解析上传反馈内容
                let responseString = response.data;
                let jsonResult = JSON.parse(responseString);
                if (!jsonResult.result) {
                    //服务端反馈上传失败                     
                    this.setState({ showUploadProgressInfo: false, uploadProgressInfo: '' });
                    Toast.show(`(${uploadFileIndex}/${batchUploadFiles.length})${jsonResult.message}`)

                    setTimeout(() => {
                        isUploading = false;
                    }, 1000);
                    return;
                }
                else {
                    //设置数据
                    //let studentDetail = this.props.navigation.state.params.studentDetail;
                    // studentDetail.attachments_khdp.push(jsonResult.attachment_info);
                    // this.setState({ showUploadProgressInfo: false, uploadProgressInfo: '', attachmentChangeTime: new Date() });
                    // const action = {
                    //     type: 'POST_TEACHER_ATTACHMENT_CHANGE',
                    //     data: {
                    //         teachScheduleID: studentDetail.teach_schedule_id,
                    //         teachRecordId: studentDetail.teach_record_id,
                    //         attachmentInfo: jsonResult.attachment_info,
                    //         deleteIndex: -1
                    //     }
                    // };
                    // this.props.dispatch(action);
                    let uploadFiles = this.state.uploadFiles;
                    uploadFiles = [...uploadFiles, jsonResult];
                    this.setState({ uploadFiles: uploadFiles });
                    //上传成功操作                    
                    setTimeout(() => {
                        isUploading = false;
                    }, 1000);
                }
            });
        }, 1000);
    }
    //浏览视图
    onEditLookView = (op, dataModel) => {
        let receiveData = initReceive;
        if (dataModel) {
            receiveData.ReceiveType = dataModel.ReceiveType;
            let keys = [];
            let labels = [];
            switch (receiveData.ReceiveType) {
                case 1:
                    receiveData.ReceiveParamText = YSI18n.get('HeadAll');
                    receiveData.ReceiveParam = '';
                    break;
                case 3:
                    dataModel.selectItem.map(item => {
                        labels = [...labels, item.selectedLabel];
                        keys = [...keys, item.selectedKey];
                    });
                    receiveData.ReceiveParamText = dataModel.selectItem.length == 0 ? '' : labels.join(',');
                    receiveData.ReceiveParam = keys.join(',');
                    break;
                case 2:
                    dataModel.selectItem.map(item => {
                        labels = [...labels, item.selectedLabel];
                        keys = [...keys, item.selectedKey];
                    })
                    receiveData.ReceiveParamText = dataModel.selectItem.length == 0 ? '' : labels.join(',');
                    receiveData.ReceiveParam = keys.join(',');
                    break;
                case 4:
                    dataModel.selectItem.map(item => {
                        labels = [...labels, item.selectedLabel];
                        keys = [...keys, item.selectedKey];
                    })
                    receiveData.ReceiveParamText = dataModel.selectItem.length == 0 ? '' : labels.join(',');
                    receiveData.ReceiveParam = keys.join(',');
                    break;
                case 5:
                    receiveData.ReceiveParamText = YSI18n.get('SchoolAll');
                    receiveData.ReceiveParam = '';
                    break;
                case 6:
                    if (dataModel.selectItem.length == 0) {
                        receiveData.ReceiveParamText = '';
                        receiveData.ReceiveType = 0;
                    }
                    else {
                        receiveData.ReceiveParamText = YSI18n.get('ParentsAll');
                    }
                    receiveData.ReceiveParam = '';
                    break;
            }
        }
        this.setState({
            ModeType: op,//编辑模式
            ReceiveData: receiveData,//编辑对象
            selectModelData: dataModel
        });
    };
    //审核人视图
    onAuditLookView = (op, dataModel) => {
        console.log(dataModel);
        console.log(op);
        let auditData = initAudit;
        if (dataModel) {
            let keys = [];
            let labels = [];
            dataModel.selectItem.map(item => {
                labels = [...labels, item.selectedLabel];
                keys = [...keys, item.selectedKey];
            })
            auditData.ExamineUsersText = dataModel.selectItem.length == 0 ? '' : labels.join(',');
            auditData.ExamineUsers = keys.join(',');
        }
        this.setState({
            ModeType: op,//编辑模式
            AuditData: auditData,//编辑对象
            selectAuditData: dataModel
        });
    };
    //视图回调
    viewEditCallback = () => {
        this.setState({ ModeType: 'Edit' });
    }
    //接收人类型：1全员;2员工3部门；4盟校；5全部盟校；6家长；
    getActiveIndex = () => {
        switch (this.state.selectModelData.ReceiveType) {
            case 1:
            case 3:
                return 0;
            case 2:
                return 1;
            case 4:
            case 5:
                return 2;
            case 6:
                return 3;
        }
    }
    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>
        return (
            <View flex bg-white>
                <YSToast ref={(toast) => this.Toast = toast} />
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.showActionSheet()
                    }}
                    onDone={() => {
                        this.onSave(2);
                    }}
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={YSI18n.get('Post')}
                    doneButtonProps={{ color: Colors.blue30 }}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4>
                        {this.renderList()}
                        {this.renderProfile()}
                    </View>
                </KeyboardAwareScrollView>
                {/* 添加接收人  */}
                <Modal onRequestClose={this.viewEditCallback} visible={this.state.ModeType === 'Receive'} animationType={'slide'}>
                    <View bg-white flex>
                        <SelectDepartment ModeType={'Receive'}
                            ReceiveData={this.state.selectModelData}
                            activeIndex={this.getActiveIndex()}
                            viewEditCallback={(dataModel) => {
                                if (dataModel) {
                                    this.onEditLookView('Edit', dataModel)
                                }
                                else {
                                    this.viewEditCallback('Edit')
                                }
                            }
                            }
                        />
                    </View>
                </Modal>

                {/* 添加审核人  */}
                <Modal onRequestClose={this.viewEditCallback} visible={this.state.ModeType === 'Audit'} animationType={'slide'}>
                    <View bg-white flex>
                        <SelectAuditPerson ModeType={'Audit'}
                            AuditData={this.state.selectAuditData}
                            viewEditCallback={(dataModel) => {
                                if (dataModel) {
                                    this.onAuditLookView('Edit', dataModel)
                                }
                                else {
                                    this.viewEditCallback('Edit')
                                }
                            }
                            }
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
    touch_img_right: {
        position: 'absolute',
        top: 25,
        right: 0,
    },
    touch_add: {
        backgroundColor: YSColors.default_bjcolor,
        height: YSWHs.width_window / 3.4,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.dark70,
    },
    img_close: {
        position: 'absolute',
        top: 0,
        left: 0,
    }


});

function select(store) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //departmentListQuery: bindActionCreators(departmentListQuery, dispatch),
        notice_Save: bindActionCreators(notice_Save, dispatch)
    };
}
module.exports = connect(select, mapDispatchToProps)(notice_edit);
