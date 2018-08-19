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

class perfectDetail extends React.Component {
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

        const idValidator = this.getTextInputValidator('id', false, (text) => {
            return (text.length >= 6);//编号
        })
        const accountValidator = this.getTextInputValidator('accounter', false, (text) => {
            return (text.length >= 6);//帐号
        })
        const passwordValidator = this.getTextInputValidator('password', false, (text) => {
            return (text.length >= 6);//密码
        })

        let block_button_save = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            text60
            marginB-s4
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('保存')}
            onPress={() => this.onsave()} />

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
                    <YSdetailField label={YSI18n.get('名称')} value={'泰安山盟校'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('国家')} value={'中国'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('省市')} value={'山东省　泰安市'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('地址')} value={'泰山区神墨大厦'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('校长')} value={'赵小'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}><Text red10 text70>*</Text></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        {...accountValidator}
                        floatingPlaceholder
                        placeholder={YSI18n.get('帐号')}
                        helperText={YSI18n.get('请输入帐号')}
                        maxLength={20}
                        value={'SHN2001334'}
                    />
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
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('手机')} value={'14500394231'} textstyle={styles.disableColor} />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <YSdetailField label={YSI18n.get('邮箱')} value={'1232444@qq.com'} textstyle={styles.disableColor} />
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

                    <TouchableOpacity activeOpacity={1}>
                        <Image source={{ uri: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5' }} style={styles.img_user} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>

        return (
            <View flex bg-white >
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4 marginB-16>
                        {block_content}
                        {block_button_save}
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


});


module.exports = perfectDetail;
