/*
翻页
 @providesModule YSpageControl
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

class YSpageControl extends React.Component {

    constructor(props: Props) {
        super(props);
        //组件初始化状态
        this.state = {
            pageIndex: 1,
            totalPages: 1,
        };
    };

    //计算总页数
    calcTotalPages = () => {
        var totalPages = this.props.data_list_total % this.props.pageSize > 0 ? Math.ceil(this.props.data_list_total / this.props.pageSize) : (this.props.data_list_total / this.props.pageSize);
        return Math.round(totalPages);
    }
    //页号改变
    pageChange = (step) => {
        let pageIndex = 1;
        //有余数则页码+1
        let totalPages = this.calcTotalPages();
        //上一页
        if (step < 0) {
            if (this.props.pageIndex == 1) {
                pageIndex = 1;
            }
            else {
                pageIndex = this.props.pageIndex - 1;//页数-1
            }
            //触发翻页事件
            this.props.onPageIndexChange(pageIndex, this.props.pageSize);
        }
        //下一页
        if (step > 0) {
            if (this.props.pageIndex < totalPages) {
                pageIndex = this.props.pageIndex + 1;
            }
            else {
                pageIndex = totalPages;//页数-1
            }
            //触发翻页事件
            this.props.onPageIndexChange(pageIndex, this.props.pageSize);
        }
        this.setState({ pageIndex, totalPages })
    }
    render() {
        let totalPages = this.calcTotalPages();
        let block_button_prev = <Button
            disabled={this.props.pageIndex <= 1}
            backgroundColor={YSColors.AppMainColor}
            size='large'
            color={YSColors.AppMainColor}
            outline
            outlineColor={YSColors.AppMainColor}
            outlineWidth={1}
            text60
            borderRadius={9}
            label={YSI18n.get('Pre')}
            onPress={() => this.pageChange(-1)} />

        let block_button_next = <Button
            disabled={this.props.pageIndex >= totalPages}
            backgroundColor={YSColors.AppMainColor}
            size='large'
            outline
            outlineWidth={1}
            outlineColor={YSColors.AppMainColor}
            color={YSColors.AppMainColor}
            text60
            borderRadius={9}
            label={YSI18n.get('Next')}
            onPress={() => this.pageChange(1)} />


        let totalInfo = YSI18n.get('Total').replace('${total}', this.props.data_list_total);
        let block_pageNo = <View column centerH>
            <Text text60 dark10 marginB-s1 >{`${this.props.pageIndex}`}/<Text dark50 text60>{`${totalPages}`}</Text></Text>
            <Text text90 dark60>{totalInfo}</Text>
        </View>

        return (<View row spread padding-15 centerV>
            {block_button_prev}
            {block_pageNo}
            {block_button_next}
        </View>
        )


    }
}

var styles = StyleSheet.create({

});

module.exports = YSpageControl;
