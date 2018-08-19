/*
 * @flow
 * @providesModule bakeFileDetail
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import { WingBlank, WhiteSpace } from 'antd-mobile-rn';

class bakeFileDetail extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            currentDataModel: null,
        };

    };

    render() {
        let block_title = <WingBlank size='lg'>
            <Text text60 dark10 marginT-30>
                调整消息界面
            </Text>
        </WingBlank>
        let block_whiteSpace =<WhiteSpace size="lg" />
        let block_content = <WingBlank size='lg'>
            <Text text70 dark10>
                内容为文字内容，详情页面也可进行删除处理。。。
            </Text>
        </WingBlank>

        let block_bottom_remove = <View center style={styles.block_add}>
            <TouchableOpacity>
                <Image source={Assets.icons.remove} />
            </TouchableOpacity>
        </View>

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.container}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >   
                    
                    {block_title}
                    {block_whiteSpace}
                    {block_content}
                </ScrollView>
                {block_bottom_remove}
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
        paddingHorizontal: 16,
    },

    block_add: {
        height: 47,
        backgroundColor: '#fafafa',
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
    }


});

module.exports = bakeFileDetail;
