/*
详情
 @providesModule YSdetailField
 @flow
 */

'use strict';

import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import YSColors from 'YSColors';
import YSWHs from './YSWHs';
import YSFontSizes from './YSFontSizes';
import YSI18n from 'YSI18n';
import { ListItem, Avatar, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';

class YSdetailField extends React.Component {
    static props: {
        label: '',
        value: '',
        numberlines:1
    };



    render() {

        return (
            <View style={[styles.hasborderline,this.props.containerStyle]} marginB-s5 >
                <Text dark40 text90 numberOfLines={1} marginB-s2  style={this.props.labelstyle}>{this.props.label}:</Text>
                <Text dark10 text70  marginB-s3 numberOfLines={1} style={this.props.textstyle}>{this.props.value || ' '}</Text>
            </View>
        )

    }
}

var styles = StyleSheet.create({
    hasborderline: {
        borderBottomWidth: 1,
        borderColor: Colors.dark70,
    }
});

module.exports = YSdetailField;
