/*
 * @flow
 * @providesModule notice_detail
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile-rn';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Constants, Carousel, PageControl, Card, Modal, View, Text, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';


//业务处理
import { notice_ByID } from '../actions/notice';

class notice_detail extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            imgUrl: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5',
            myWidth: undefined,
            myHeight: undefined,
            noticeDetail: {}
        }


    };
    _onLoadEnd() {
        Image.getSize(this.state.imgUrl, (width, height) => {
            let screenWidth = YSWHs.width_window;
            let proportion = width / height
            let myWidth = Math.min(width, screenWidth)
            let myHeight = myWidth / proportion
            this.setState({ myWidth: myWidth, myHeight: myHeight })
        })
    }

    componentDidMount() {
        let noticeid = this.props.navigation.state.params.noticeID;
        //Toast.loading(YSI18n.get('Posting'));
        this.props.notice_ByID(noticeid)
            //api调用成功
            .then((response) => {
                //Toast.success(YSI18n.get('PostSuccess'));
                //返回后刷新数据
                this.setState({ noticeDetail: response.data.data })
            })
            //api调用失败,提示错误信息
            .catch((response) => {
                Toast.fail(response.message);
            });
    }
    render() {
        let noticeDetail = this.state.noticeDetail;
        let noticeFile = noticeDetail.NoticeFileList;
        let block_header = <View>
            <Text dark10 text40 marginB-10>{noticeDetail.Title}</Text>
            <Text dark40 text70 marginB-13>{YSI18n.get('Recipient')}：<Text dark50 text70>{noticeDetail.ReceiveParamText}</Text></Text>
        </View>
        let block_news = <Text dark30 text70 style={{ lineHeight: 26, textAlign: 'justify' }}>
            {noticeDetail.Content}
        </Text>

        let block_profile_img = noticeFile ? noticeFile.map((item, index) => {
            return (<View>
                <View marginV-13 key={'file_' + index}>
                    <Image onLoadEnd={() => this._onLoadEnd()} source={{ uri: item.image_url }} width={this.state.myWidth} height={this.state.myWidth} />
                </View>
                <Text text70 dark40>{item.FileName}</Text>
            </View>
            )
        }) : null

        let block_footer = <View paddingT-16 marginB-58>
            <View row marginB-10><Button link label={YSI18n.get('read')+':' + noticeDetail.ReceiveReadSum + '/' + noticeDetail.ReceiveSum} text70 marginR-4 onPress={
                () => this.props.navigation.navigate('noticeManage_read', { noticeID: noticeDetail.NoticeID })
            } />
            </View>
            <Text marginB-10 text70 dark40>{YSI18n.get('creator')}:{noticeDetail.CreateRealName} {YSI18n.get('createdate')}:{noticeDetail.CreatedDate}</Text>
            {noticeDetail.Status > 2 && <Text text70 dark40>{YSI18n.get('auditor')}:{noticeDetail.PublishRealName} {YSI18n.get('auditdate')}:{noticeDetail.PublishDate}</Text>}
        </View>

        return (
            <View flex bg-white>
                <ScrollView contentContainerStyle={styles.container} >
                    <View marginH-13 marginT-30>
                        {block_header}
                        <View style={styles.block_content} paddingT-20 paddingB-30>
                            {block_news}
                            {block_profile_img}
                        </View>
                        {block_footer}
                    </View>
                </ScrollView>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,

    },
    img_user: {
        borderRadius: BorderRadiuses.br30,
        width: 70,
        height: 70,
        resizeMode: 'cover',
        marginRight: 15
    },
    grayspace: {
        height: 13,
    },
    block_content: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: ThemeManager.dividerColor,
    }
});

function select(store) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        notice_ByID: bindActionCreators(notice_ByID, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(notice_detail);

