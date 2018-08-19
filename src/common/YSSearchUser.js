/*
 * @flow
 * @providesModule YSSearchUser
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
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'
import { DatePicker, List } from 'antd-mobile-rn';
import CheckBox from 'YSCheckBox';
import {defaultPageSize} from '../env';

import { userQuery } from '../actions/user';

class YSSearchUser extends React.Component {
    state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
          condition: {
            pageIndex: 1,
            pageSize: defaultPageSize,
            name: '',
            type: 0,
          },
          data_list: [],
          user_choosed: [],
        };
        this.getTextInputValidator = getTextInputValidator.bind(this);
    };

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
            >
                <ListItem.Part left>
                    <CheckBox
                      //ref={(c)=>this.initCheckBoxData(c)}
                      label=""
                      checked={row.isChecked}
                      value={row.uid}
                      style={styles.check}
                      onChange={(checked) => {
                        //---start
                        var cs = this.state.user_choosed;
                        var isExist = false;
                        for(var i = 0; i < cs.length; i++){
                          if(cs[i] == row.uid){
                            isExist = true;
                            if(!checked){
                              cs.splice(i, 1);
                            }
                            break;
                          }
                        }
                        if(!isExist && checked){
                          cs.push(row.uid);
                        }
                        //---end
                        u.isChecked = checked
                        this.setState({
                          user_choosed: cs
                        });
                      }}
                    />

                </ListItem.Part>
                <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                    <Avatar
                        size={54}
                        imageSource={row.icon ? { uri: row.icon } : null}
                        label={row.name}
                        labelColor={Colors.white}
                        backgroundColor={'#837F7F'}
                        containerStyle={{ marginHorizontal: 13, }}
                    />
                    </ListItem.Part>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <Text dark10 text70 numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>{row.name} </Text>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        );
    }

    render() {
        let block_whitespace = <View style={styles.whitespace} ></View>
        let block_button_search = <Button
            backgroundColor={YSColors.AppMainColor}
            size='large'
            text60
            marginB-s4
            style={styles.button_wrap}
            borderRadius={9}
            label={YSI18n.get('搜索')}
            onPress={() => this.props.search(this.state)} />

        let block_listView = <ListView
            dataSource={ds.cloneWithRows(this.state.data_list)}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />
        return (
            <View flex bg-white>
                <Modal.TopBar
                    title={YSI18n.get(this.props.editMode)}
                    titleStyle={styles.modalTitle}
                    onCancel={() => {
                        this.props.viewCallback()
                    }}

                    cancelButtonProps={{ iconStyle: { tintColor: Colors.blue30 } }}
                    doneLabel={null}
                />

                <View style={{ borderBottomWidth: 1, borderColor: Colors.dark70 }}></View>

                {block_listView}

                <YSToast ref={(toast) => this.Toast = toast} />
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
    }
});

function select(store){
  return {

  }
}

function mapDispatchToProps(dispatch) {
    return {
        searchUser: bindActionCreators(courseTeamDelete, dispatch)
    };
}
module.exports = connect(select, mapDispatchToProps)(YSSearchUser);
