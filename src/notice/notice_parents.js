/*
 * @flow
 * @providesModule notice_parents
 */

'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Checkbox, Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import { SearchInput } from 'react-native-search-input';

const orders = [
    {
        "title": "张铮",
    },
    {
        "title": "赵薇",
    },
    {
        "title": "李丽",
    },
    {
        "title": "李花花",
    },

]
class notice_parents extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            Checkbox: false
        };

    };

    componentWillMount() {
        let receiveData = this.props.ReceiveData;
        if(receiveData.selectItem.find(item=>item.selectedKey=='root') && receiveData.ReceiveType==6){
            this.setState({value2:true})
        }else{
            this.setState({value2:false})
        }
    }

    renderRow(row, id) {

        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={54}
                onPress={(item) => this.setState({ Checkbox })}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver

            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part >
                        <View centerV row>
                            <Checkbox
                                value={this.state.Checkbox}
                                onValueChange={value2 => this.setState({ Checkbox })}
                                borderRadius={2}
                                size={18}
                                color={Colors.blue30}
                                iconColor={Colors.white}
                                style={{ marginRight: 10 }}
                            />
                            <Text dark10 text70 numberOfLines={1}>{row.title}</Text>
                        </View>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>

        );
    }

    render() {
        let block_checkall = <View row centerV style={[styles.block_checkALL, styles.border]}>
            <Checkbox
                value={this.state.value2}
                borderRadius={2}
                size={18}
                color={Colors.blue30}
                iconColor={Colors.white}
                style={{ marginRight: 10 }}
            />
            <TouchableOpacity onPress={() => {
                this.setState({ value2: !this.state.value2 });
                this.props.onCallback({ key: 'root', label: YSI18n.get('All') }, !this.state.value2);
            }}><Text dark10 text70 numberOfLines={1}>{YSI18n.get('All')}</Text></TouchableOpacity>
        </View>

        // let block_listView = <ListView
        //     dataSource={this.state.dataSource}
        //     //renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        // />

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}>
                {/* <View style={styles.inputStyle} ><SearchInput ref="search_box" backgroundColor={'transparent'} cancelTitle={YSI18n.get('取消')} titleCancelColor={Colors.blue30} placeholder={YSI18n.get('搜索')} inputHeight={30} /></View> */}
                {block_checkall}
                {/* {block_listView} */}
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    block_space: {
        height: 18
    },
    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
        paddingHorizontal: 16,
    },
    block_checkALL: {
        height: 54,
    },
    inputStyle: {
        paddingHorizontal: 11,
        height: 44,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: ThemeManager.dividerColor,
        marginBottom: 2,
    }
});

module.exports = notice_parents;
