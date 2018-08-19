
'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Constants, Carousel, PageControl, Card, Modal, View, Text, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';



class messgeDetailAudit extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            imgUrl: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5',
            myWidth: undefined,
            myHeight: undefined,
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

    render() {

        let block_header = <View>
            <Text dark10 text40 marginB-10>致盟校校长的一封信</Text>
            <Text dark40 text70 marginB-13>接收人：<Text dark50 text70>总部(5人)</Text></Text>
        </View>
        let block_news = <Text dark30 text70 style={{ lineHeight: 26, textAlign: 'justify' }}>
            各位盟校校长，你们好！ 在这个无比神圣且激动人心的时刻，特别通知大家，啦啦啦啦。。。 此处不做字数限制。
        </Text>
        let block_profile_img = <View>
            <View marginV-13>
                <Image onLoadEnd={() => this._onLoadEnd()} source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} width={this.state.myWidth} height={this.state.myWidth} />
            </View>
            <Text text70 dark40>附件名称</Text>
        </View>
        let block_footer = <View paddingT-16 marginB-58>
            <View row marginB-10><Button link label={YSI18n.get('阅读：') + '8/200'} text70 marginR-4 onPress={
                () => this.props.navigation.navigate('receiveMessgeList')
            } />
            </View>
            <Text marginB-10 text70 dark40>创建人：张三 创建时间：2018-04-05</Text>
            <Text text70 dark40>审核人：李四 审核时间：2018-04-06</Text>
        </View>

        let block_button_group = <View row center>
            <View flex-1><Button size="large" label={YSI18n.get('通过')} borderRadius={0} /></View>
            <View flex-1><Button size="large" backgroundColor={'#74001A'} style={{ backgroundColor: '#F6E8EB' }} outline label={YSI18n.get('不通过')} borderRadius={0} /></View>
        </View>

        return (
            <View flex bg-white>
                <View flex>
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
                {block_button_group}
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


module.exports = messgeDetailAudit;
