'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { RadioButton, TextArea, RadioGroup, Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import { WingBlank, WhiteSpace, } from 'antd-mobile-rn';
import YSWebView from 'YSWebView';
import { serverURL } from '../../env'

const datas = [
    {
        name: 'lenon',
        comment: '评论内容。评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
        thumb: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        time: '1分钟前'
    },
    {
        name: 'lenon',
        comment: '评论内容。评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
        thumb: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        time: '1分钟前'
    },
    {
        name: 'lenon',
        comment: '评论内容。评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
        thumb: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5',
        time: '1分钟前'
    },

]
class newsDetail extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {

        }

    };



    render() {

        let block_newsTitle = <Text text50 dark10 marginT-20 marginB-12>李绵军校长为大家分享一个故事</Text>
        let block_author = <View row centerV marginB-20>
            <Image source={{ uri: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5' }} width={45} height={45} style={styles.img_user} />
            <View marginL-13>
                <Text text70 dark10 marginB-6>作者姓名</Text>
                <Text dark60>5分钟前 所属部门</Text>
            </View>
        </View>

        let detailUrl = 'http://news.163.com/18/0811/13/DOUC6BMI000189FH.html';
        let block_html = <YSWebView url={detailUrl} />

        let block_comment = <View row center bg-dark90 style={styles.border_top}>
            <View style={[styles.textarea_wrap]}><TextArea placeholder={YSI18n.get('写评论…')} /></View>
            <View style={{ height: '100%', }}>
                <Image source={Assets.icons.comment_g} style={{ marginRight: 20 }} />
                <View style={styles.bage}><Badge label={77} size='small' backgroundColor={'#FE3824'} /></View>
            </View>
            {false && <Image source={Assets.icons.attention_1} />}
            {true && <Image source={Assets.icons.attention_2} />}
        </View>

        let block_list_item = datas.map((item, index) => {
            return (
                <View row marginT-25>
                    <Image source={{ uri: item.thumb }} width={45} height={45} style={styles.img_user} />
                    <View flex-1 marginL-10>
                        <View row spread marginB-8>
                            <Text dark40 text80>{item.name}</Text>
                            {true && <TouchableOpacity ><View row bottom><Image source={Assets.icons.commend_normal} /><Text dark60 text90>{YSI18n.get('赞')}</Text></View></TouchableOpacity>}
                            {false && <TouchableOpacity ><View row bottom><Image source={Assets.icons.commend_active} /><Text blue30 text90>{11}</Text></View></TouchableOpacity>}
                        </View>
                        <Text text70 dark10 marginB-10>{item.comment}</Text>
                        <Text text80 dark60>{item.time}</Text>
                    </View>
                </View>
            )
        })


        return (
            <View flex bg-white styles={styles.container}>
                <ScrollView style={styles.container}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    <WingBlank>
                        {block_newsTitle}
                        {block_author}
                        {block_html}
                    </WingBlank>
                    <View style={styles.block_list_wrap}>
                        <WingBlank>
                            {block_list_item}
                        </WingBlank>
                        <WhiteSpace size='lg' />
                    </View>
                </ScrollView>
                {block_comment}
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    img_user: {
        borderRadius: 99,
    },
    textarea_wrap: {
        borderWidth: 1,
        borderColor: ThemeManager.dividerColor,
        borderRadius: 15,
        paddingHorizontal: 10,
        width: YSWHs.width_window * 0.53,
        height: 36,
        backgroundColor: '#E6E6E6',
        marginRight: 32
    },
    border_top: {
        borderTopWidth: 1,
        height: 49,
        borderColor: ThemeManager.dividerColor,
    },
    bage: {
        position: 'absolute',
        top: 5,
        right: 15,
    },
    block_list_wrap: {
        backgroundColor: YSColors.default_bjcolor,
    }

});


module.exports = newsDetail;
