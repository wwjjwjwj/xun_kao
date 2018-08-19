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
import { DatePicker } from 'antd-mobile-rn';
import { district, provinceLite } from '../../home/data/index';

class searchForm extends React.Component {
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
        const CustomChildren = ({ extra, onClick, children }) => (
            <View onClick={onClick} style={[styles.hasborderline]}>
                <Text text70 dark10 marginB-10>{extra}</Text>
            </View>
        );
        let block_content = <View paddingT-s6  >
            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        floatingPlaceholder
                        placeholder={YSI18n.get('盟校名称')}
                        helperText={YSI18n.get('请输入盟校名称')}
                        maxLength={20}
                        value={'泰安盟校'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        floatingPlaceholder
                        placeholder={YSI18n.get('盟校级别')}
                        helperText={YSI18n.get('请输入盟校级别')}
                        maxLength={20}
                        value={'一级'}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row marginB-30 centerV style={[styles.field_wrap, { height: 66 }]}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={[styles.box_middle, styles.border]}>
                    <Text marginB-16 text90 dark40 >
                        {YSI18n.get('开始时间')}
                    </Text>
                    <View row centerV>
                        <View>
                            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ showdate1: true })}>
                                <DatePicker
                                    visible={this.state.showdate1}
                                    mode="date"
                                    extra={YSI18n.get('选择查找开始日期')}
                                    value={this.state.date_1}
                                    onOk={date => this.setState({ date_1: date, showdate1: false })}
                                    onDismiss={() => this.setState({ showdate1: false })}
                                    onChange={date => this.setState({ date_1: date })}
                                >
                                    <CustomChildren />
                                </DatePicker>
                            </TouchableOpacity>
                        </View>
                        <View marginH-10><Text>~</Text></View>
                        <View>
                            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ showdate2: true })}>
                                <DatePicker
                                    visible={this.state.showdate2}
                                    mode="date"
                                    extra={YSI18n.get('选择查找截止日期')}
                                    value={this.state.date_2}
                                    onOk={date => this.setState({ date_2: date, showdate2: false })}
                                    onDismiss={() => this.setState({ showdate2: false })}
                                    onChange={date => this.setState({ date_2: date })}
                                >
                                    <CustomChildren />
                                </DatePicker>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <View row marginB-30 centerV style={[styles.field_wrap, { height: 66 }]}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={[styles.box_middle, styles.border]}>
                    <Text marginB-16 text90 dark40 >
                        {YSI18n.get('结束时间')}
                    </Text>
                    <View row centerV>
                        <View>
                            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ showdate3: true })}>
                                <DatePicker
                                    visible={this.state.showdate3}
                                    mode="date"
                                    extra={YSI18n.get('选择查找开始日期')}
                                    value={this.state.date_3}
                                    onOk={date => this.setState({ date_3: date, showdate3: false })}
                                    onDismiss={() => this.setState({ showdate3: false })}
                                    onChange={date => this.setState({ date_3: date })}
                                >
                                    <CustomChildren />
                                </DatePicker>
                            </TouchableOpacity>
                        </View>
                        <View marginH-10><Text>~</Text></View>
                        <View>
                            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.setState({ showdate4: true })}>
                                <DatePicker
                                    visible={this.state.showdate4}
                                    mode="date"
                                    extra={YSI18n.get('选择查找截止日期')}
                                    value={this.state.date_4}
                                    onOk={date => this.setState({ date_4: date, showdate4: false })}
                                    onDismiss={() => this.setState({ showdate4: false })}
                                    onChange={date => this.setState({ date_4: date })}
                                >
                                    <CustomChildren />
                                </DatePicker>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.Wing_blank}></View>
            </View>
            <View row centerV style={[styles.field_wrap, { height: 72 }]}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={[styles.box_middle, styles.border]}>
                    <RadioGroup value={this.state.state} onValueChange={value => this.setState({ state: value })}>
                        <Text marginB-16 text90 dark40 >
                            {YSI18n.get('状态')}
                        </Text>
                        <View row >
                            {this.renderRadioButton('全部', '全部')}
                            {this.renderRadioButton('启用', '启用')}
                            {this.renderRadioButton('停用', '停用')}
                        </View>
                    </RadioGroup>
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

        </View>
        let block_button_search = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            text60
            marginT-s6
            marginH-10
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('搜索')}
            onPress={() => this.onSearch()} />
        return (
            <View flex bg-white >
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewCallback()
                    }}
                  
                    cancelIcon={null}
                    cancelLabel={YSI18n.get('Cancel')}
                    doneLabel={''}
                />
                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View marginH-s4 marginB-16>
                        {block_content}
                        {block_button_search}
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


module.exports = searchForm;
