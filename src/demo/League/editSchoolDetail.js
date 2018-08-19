'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { TextInput, RadioButton, RadioGroup, Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { Picker } from 'antd-mobile-rn';
import { district, provinceLite } from '../../home/data/index';
const Country = [
    {
        "value": '01',
        "label": '中国',
    },
    {
        "value": '02',
        "label": '美国',
    },
    {
        "value": '03',
        "label": '法国',
    },
    {
        "value": '04',
        "label": '德国',
    },
    {
        "value": '05',
        "label": '英国',
    },
    {
        "value": '06',
        "label": '日本',
    },
]
class editSchoolDetail extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        this.state = {
            state: '启用'
        }

    };

    renderRadioButton(value, text) {
        return (
            <View row centerV marginB-5 >
                <RadioButton value={value} />
                <Text marginL-15 marginR-50>{text}</Text>
            </View>
        );
    }

    render() {
        const CustomChildren = props => (
            <Text text70 dark10>{props.extra}</Text>
        );

        const idValidator = this.getTextInputValidator('id', false, (text) => {
            return (text.length >= 6);//编号
        })

        const mobileValidator = this.getTextInputValidator('mobile', false, (text) => {
            return (text.length >= 11);//手机号
        })

        const passwordValidator = this.getTextInputValidator('password', false, (text) => {
            return (text.length >= 6);//密码
        })

        const emailValidator = this.getTextInputValidator('email', false, (text) => {
            return (text.length >= 6);//邮箱
        })


        let block_button_del = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            text60
            marginB-s4
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('删除')}
            onPress={() => this.ondel()} />

        let block_content = <View paddingT-s6  >
            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        {...idValidator}
                        floatingPlaceholder
                        placeholder={YSI18n.get('编号')}
                        helperText={YSI18n.get('请输入编号')}
                        maxLength={20}
                        value={'20001'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        floatingPlaceholder
                        placeholder={YSI18n.get('名称')}
                        helperText={YSI18n.get('请输入名称')}
                        maxLength={20}
                        value={'泰安盟校'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={[styles.field_wrap, { height: 68 }]} marginB-24>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={[styles.box_middle, styles.border]}>

                    <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ showCountry: true })}>
                        <Image source={Assets.icons.dropdown} style={styles.chervon} />
                        <Text text90 dark40 marginB-20>
                            {YSI18n.get('国家/地区')}
                        </Text>
                        <Picker
                            visible={this.state.showCountry}
                            title={YSI18n.get('国家/地区')}
                            extra="请选择国家/地区"
                            data={Country}
                            cols={1}
                            value={this.state.country}
                            onChange={v => this.setState({ country: v, showCountry: false })}
                            onOk={v => { this.setState({ country: v, showCountry: false }) }}
                            onDismiss={v => this.setState({ showCountry: false })}
                        >
                            <CustomChildren>{YSI18n.get('请选择国家/地区')}</CustomChildren>
                        </Picker>
                    </TouchableOpacity>
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={[styles.field_wrap, { height: 68 }]} marginB-24>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={[styles.box_middle, styles.border]}>

                    <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ showdisct: true })}>
                        <Image source={Assets.icons.dropdown} style={styles.chervon} />
                        <Text text90 dark40 marginB-20>
                            {YSI18n.get('省市')}
                        </Text>
                        <Picker
                            visible={this.state.showdisct}
                            title={YSI18n.get('省市')}
                            extra="请选择省市"
                            data={district}
                            value={this.state.district}
                            onChange={v => this.setState({ district: v, showdisct: false })}
                            onOk={v => { this.setState({ district: v, showdisct: false }) }}
                            onDismiss={v => this.setState({ showdisct: false })}
                        >
                            <CustomChildren>{YSI18n.get('省市')}</CustomChildren>
                        </Picker>
                    </TouchableOpacity>
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        floatingPlaceholder
                        placeholder={YSI18n.get('地址')}
                        helperText={YSI18n.get('请输入地址')}
                        maxLength={20}
                        value={'泰山区神墨大厦'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        floatingPlaceholder
                        placeholder={YSI18n.get('校长')}
                        helperText={YSI18n.get('请输入校长')}
                        maxLength={20}
                        value={'赵小'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>


            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('帐号')} value={'SN200012'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        {...passwordValidator}
                        floatingPlaceholder
                        placeholder={YSI18n.get('密码')}
                        helperText={YSI18n.get('请输入密码')}
                        maxLength={20}
                        value={'123456'}
                    />
                </View>
                <Button
                    backgroundColor={YSColors.AppMainColor}
                    size='small'
                    outline
                    text70
                    style={styles.button_reset}
                    borderRadius={9}
                    label={YSI18n.get('重置')}
                    onPress={() => this.props.reset()} />
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        {...mobileValidator}
                        floatingPlaceholder
                        placeholder={YSI18n.get('手机')}
                        helperText={YSI18n.get('请输入手机')}
                        maxLength={20}
                        value={'13600299394'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        {...emailValidator}
                        floatingPlaceholder
                        placeholder={YSI18n.get('邮箱')}
                        helperText={YSI18n.get('请输入邮箱')}
                        maxLength={20}
                        value={'eee@qq.com'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('加盟时间')} value={'2018-12-21'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('级别')} value={'二级'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <RadioGroup value={this.state.state} onValueChange={value => this.setState({ state: value })}>
                        <Text marginB-16 text90 dark40 >
                            {YSI18n.get('状态')}
                        </Text>
                        <View row >
                            {this.renderRadioButton('启用', '启用')}
                            {this.renderRadioButton('停用', '停用')}
                        </View>
                    </RadioGroup>
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View marginB-60 centerV row style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle} >
                    <Text text90 dark40 marginB-20>
                        {YSI18n.get('头像')}
                    </Text>
                    {/* 添加头像 */}
                    <TouchableOpacity activeOpacity={1}>
                        <Image source={Assets.icons.addUserPhoto} style={styles.img_add} />
                    </TouchableOpacity>

                    {/* 编辑时的头像显示 */}
                    {/* <TouchableOpacity activeOpacity={1}>
                        <Image source={{ uri: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5' }} style={styles.img_user} />
                    </TouchableOpacity> */}
                </View>
            </View>

        </View>

        return (
            <View flex bg-white >
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewCallback()
                    }}
                    onDone={() => {
                        let dataModel = {};
                        this.props.viewCallback(dataModel)
                    }}
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={YSI18n.get('Save')}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4 marginB-16>
                        {block_content}
                        {block_button_del}
                    </View>
                </KeyboardAwareScrollView>
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    grayspace: {
        height: 11,
        backgroundColor: YSColors.default_bjcolor,
    },
    border: {
        borderBottomWidth: 1,
        borderColor: ThemeManager.dividerColor,
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
    whitespace: {
        height: 33,
    },
    disableColor: {
        color: Colors.dark40,
    },
    img_user: {
        width: 92,
        height: 92,
        resizeMode: 'cover',
        borderRadius: 9
    },
    chervon: {
        position: 'absolute',
        right: 0,
        top: 45,
        width: 15,
        height: 15,
        resizeMode: 'contain',
        opacity: 0.7
    },
    button_reset: {
        position: 'absolute',
        right: 10,
        top: 17,
    },


});


module.exports = editSchoolDetail;
