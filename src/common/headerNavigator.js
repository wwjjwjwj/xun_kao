/*
 * @flow
 * @providesModule headerNavigator
 */

'use strict';

import {
    Platform,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Assets } from 'react-native-ui-lib';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';

const StyleSheet = require('./YSStyleSheet');

class headerNavigator extends React.Component {
    static props: {
        is_first: false,
    }
    goBack() {
        this.props.navigation.goBack(null);
        return;
    }
    render() {

        let block_back = null

        if (!this.props.is_first) {
            block_back = <TouchableOpacity style={styles.block_header_left} onPress={() => this.goBack()}>
                <Image source={!this.props.purple ? Assets.login.icon_back_white: Assets.login.icon_back} style={styles.img_back} />
            </TouchableOpacity>
        }


        return (
            <View style={[styles.block_header, this.props.tabWhiteBackground ? styles.block_white_header : '']}>
                <View style={styles.block_header_left}>
                    {block_back}
                </View>
                <View style={styles.block_header_center}><Text style={[styles.text_title, this.props.style_text_title?styles.black_title:'']}>{this.props.headerTitle}</Text></View>
                <View style={styles.block_header_right}></View>
            </View>
        )
    }
}
;
var styles = StyleSheet.create({
    block_header: {
        position: 'absolute',
        left: 0,
        width: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        ios: {
            alignItems: 'flex-end',
            height: YSWHs.header_ios_height
        },
        android: {
            alignItems: 'center',
            height: YSWHs.header_android_height
        },
        justifyContent: 'center',
        top: 0,


    },
    block_header_left: {
        width: 50,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    block_header_center: {
        flex: 1,
    },
    block_header_right: {
        width: 50,
    },
    text_title: {
        fontSize: Platform.OS === 'ios' ? 17 : 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: YSColors.lightText,

        ios: {
            marginBottom: 13,
        }

    },
    img_back: {
        ios: {
            top: 9,
        },
    },
    block_white_header: {
        backgroundColor: YSColors.whiteBackground,
    },
    black_title:{
        color:YSColors.listcontent
    }

});
module.exports = headerNavigator;
