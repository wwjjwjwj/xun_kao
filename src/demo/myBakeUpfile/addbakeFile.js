'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { TextInput, RadioButton, RadioGroup, TextArea, Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { Picker } from 'antd-mobile-rn';
import { district, provinceLite } from '../../home/data/index';

class addbakeFile extends React.Component {
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

        let block_content = <View paddingT-s6  >
            <View row centerV style={styles.field_wrap}>
                <View style={styles.Wing_blank}></View>
                <View flex-1 style={styles.box_middle}>
                    <TextInput
                        floatingPlaceholder
                        placeholder={YSI18n.get('标题')}
                        helperText={YSI18n.get('请输入标题')}
                        maxLength={20}
                        value={''}
                    />
                </View>
                <View style={styles.Wing_blank}></View>
            </View>

            <Text marginB-16 text90 dark40 marginL-12>
                {YSI18n.get('内容')}
            </Text>

            <TextArea floatingPlaceholder placeholderTextColor={'#999'} text70 placeholder={YSI18n.get('备忘事项')} />

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


module.exports = addbakeFile;
