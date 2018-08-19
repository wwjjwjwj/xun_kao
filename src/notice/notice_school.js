/*
 * @flow
 * @providesModule notice_school
 */

'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Checkbox, Modal, ListItem, Avatar, View, TabBar, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import { SearchInput } from 'react-native-search-input';
import YSpage from 'YSpageControl';
//组件实例模板方法引入
import { loadBizDictionary, onSearch, onPageIndexChange, onShowSizeChange } from 'ComponentExt';
//业务处理
import { notice_OrganizationList_mx } from '../actions/notice';

const orders = [
    {
        "title": "济南盟校（张铮）",
    },
    {
        "title": "天津盟校（赵薇）",
    },
    {
        "title": "呼伦贝尔盟校（李丽）",
    },
    {
        "title": "临沂盟校（李花花）",
    },

]
class notice_school extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            Checkbox: false,
            showlistview:false,
        };
        this.dataCheckedList = [];
    };

    componentDidMount() {
        this.onsearch('');
    }
    onsearch(orgName) {

        let that = this;
        this.props.notice_OrganizationList_mx({ organizationName: orgName, PageIndex: 1, PageSize: 9999 }).then((response) => {
            let receiveData = that.props.ReceiveData;
            if (receiveData.ReceiveType == 5) {
                if (receiveData.selectItem.find(item => item.selectedKey == 'root')) {
                    that.setState({ value2: true });
                    that.dataCheckedList = [{ id: 'root', checked: true }];
                } else {
                    that.setState({ value2: false });
                    that.dataCheckedList = [{ id: 'root', checked: false }];
                }
            }
            response.data.data_list.map(item => {
                let checked = false;
                if (receiveData.selectItem.find(b => b.selectedKey == item.OrganizationID)) {
                    checked = true;
                }
                that.dataCheckedList = [...that.dataCheckedList, { id: item.OrganizationID, checked: checked }];
            });
            that.setState({showlistview:true});
        });
    }


    renderRow(row, id) {
        console.log(this.dataCheckedList);
        let name_view = row.OrganizationName;
        name_view += row.OrgAdminRealName == '' ? '' : '(' + row.OrgAdminRealName + ')';
        let datachecked = this.dataCheckedList.find(item => item.id == row.OrganizationID)
        let idchecked = datachecked ? datachecked.checked : false;
        return (

            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={54}
                onPress={itemvalue => {
                    let obj = this.dataCheckedList.find(item => item.id == row.OrganizationID);
                    obj.checked = !obj.checked;
                    this.dataCheckedList = [...this.dataCheckedList.filter(item => item.id != obj.id), obj]
                    console.log(this.dataCheckedList);
                    this.setState({ Checkbox: obj.checked });
                    this.props.onCallback(row, obj.checked);
                }}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver
            >
                <ListItem.Part middle column containerStyle={[styles.border]}>
                    <ListItem.Part >
                        <View centerV row>
                            <Checkbox
                                value={idchecked}
                                // onValueChange={itemvalue => {
                                //     let obj = this.dataCheckedList.find(item => item.id == row.OrganizationID);
                                //     obj.checked = itemvalue;
                                //     this.dataCheckedList = [...this.dataCheckedList.filter(item => item.id != obj.id), obj]
                                //     this.setState({ Checkbox: itemvalue });
                                //     this.props.onCallback(row, itemvalue);
                                // }}
                                borderRadius={2}
                                size={18}
                                color={Colors.blue30}
                                iconColor={Colors.white}
                                style={{ marginRight: 10 }}
                            />
                            <Text dark10 text70 numberOfLines={1}>{name_view}</Text>
                        </View>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>

        );
    }

    render() {

        let dataSource = this.props.notice_MxList;
        let block_checkall = <View row centerV style={[styles.block_checkALL, styles.border]}>
            <Checkbox
                value={this.state.value2}
                // onChange={(event) => {
                //     //取消选盟校
                //     let list = [];
                //     this.dataCheckedList.map(item => {
                //         list = [...list, { id: item.id, checked: false }];
                //     });
                //     this.dataCheckedList = list;
                //     this.setState({ value2:event.target.checked });
                //     this.props.onCallback({ OrganizationID: 'root', OrganizationName: '全部' }, event.target.checked);
                // }}
                borderRadius={2}
                size={18}
                color={Colors.blue30}
                iconColor={Colors.white}
                style={{ marginRight: 10 }}
            />
            <TouchableOpacity onPress={() => {
                //取消选盟校
                let list = [];
                this.dataCheckedList.map(item => {
                    list = [...list, { id: item.id, checked: false }];
                });
                this.dataCheckedList = list;
                this.setState({ value2: !this.state.value2 });
                this.props.onCallback({ OrganizationID: 'root', OrganizationName: YSI18n.get('All') }, !this.state.value2);
            }}><Text dark10 text70 numberOfLines={1}>{YSI18n.get('All')}</Text></TouchableOpacity>
        </View>

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        let datalist = ds.cloneWithRows(dataSource)
        let block_listView = this.state.showlistview? <ListView
            dataSource={datalist}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />:null

        let block_space = <View style={styles.block_space}></View>

        return (
            <View style={styles.container}>
                <View style={styles.inputStyle} ><SearchInput ref="search_box" backgroundColor={'transparent'} 
                cancelTitle={YSI18n.get('Cancel')} titleCancelColor={Colors.blue30} placeholder={YSI18n.get('Search')} inputHeight={30}
                    onSearch={(text) => {
                        this.onsearch(text);
                    }}
                    onCancel={() => {
                        this.onsearch('');
                    }}
                /></View>
                {block_checkall}
                {block_listView}
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


function select(store) {
    return {
        notice_MxList: store.notice.Notice_OrganizationList_mx.data_list
    }
}

function mapDispatchToProps(dispatch) {
    return {
        notice_OrganizationList_mx: bindActionCreators(notice_OrganizationList_mx, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(notice_school);

