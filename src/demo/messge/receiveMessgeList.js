
'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import { Tabs } from 'antd-mobile-rn';


const orders = [
    {
        "name": "王彪",
        "offer": '产品经理',
        "date": '上午8:00',
        "phone": '18678789000'
    },
    {
        "name": "王彪",
        "offer": '产品经理',
        "date": '下午2:00',
        "phone": '18678789000'
    },
    {
        "name": "王彪",
        "offer": '产品经理',
        "date": '昨天',
        "phone": '18678789000'
    },

]

class receiveMessgeList extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            dataSource: ds.cloneWithRows(orders),
            activeIndex: 0,
        };

    };


    renderRow2(row, id) {

        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={60}
                onPress={(item) => this.onLookView('View', item)}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver

            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part containerStyle={{}}>
                        <View row flex-1 centerV>
                            <Text dark30 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                            <Text dark50 text60 numberOfLines={1}>{row.offer}</Text>
                        </View>
                        <Text dark60 text70 style={{ marginTop: 2 }}>{row.date}</Text>
                    </ListItem.Part>
                </ListItem.Part>

            </ListItem>

        );
    }
    renderRow1(row, id) {

        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={60}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver

            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part containerStyle={{}}>
                        <View row flex-1 centerV>
                            <Text dark30 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                            <Text dark50 text60 numberOfLines={1}>{row.offer}</Text>
                        </View>
                        <Text dark60 text70 style={{ marginTop: 2 }}>{row.phone}</Text>
                    </ListItem.Part>
                </ListItem.Part>

            </ListItem>

        );
    }

    render() {
        const tabs = [
            { title: YSI18n.get('未阅读') },
            { title: YSI18n.get('已阅读') },
        ];



        let block_listView1 = <View>
            <View style={styles.block_header} marginT-15 centerV paddingL-16>
                <Text dark50 text70 style={styles.text_header}>总部（18人）</Text>
            </View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow1(row, rowId)}
            />
        </View>

        let block_listView2 =<View>
            <View style={styles.block_header} marginT-15 centerV paddingL-16>
                <Text dark50 text70 style={styles.text_header}>总部（18人）</Text>
            </View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(row, sectionId, rowId) => this.renderRow2(row, rowId)}
            />
        </View>

        let block_tabbar = <Tabs tabs={tabs}
            initalPage={0}
        >
            {block_listView1}
            {block_listView2}

        </Tabs>


        return (
            <View style={styles.container}>
                {block_tabbar}
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

    tabar_wrap: {
        borderWidth: 1,
        borderColor: YSColors.AppMainColor,
        height: 24 * YSWHs.scale_rx,
        borderRadius: 8,
        marginTop: 12,

    },
    touch_button: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touch_button_selected_right: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: YSColors.AppMainColor,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
    },
    touch_button_selected: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: YSColors.AppMainColor,
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
    },
    text_touch_button_selected: {
        color: Colors.white
    },
    text_touch_button: {
        color: Colors.blue30,
        fontSize: 13,
    },
    block_header: {
        height: 37,
        borderTopWidth: 1,
        borderColor: ThemeManager.dividerColor,
        backgroundColor: YSColors.default_bjcolor
    }
});

module.exports = receiveMessgeList;
