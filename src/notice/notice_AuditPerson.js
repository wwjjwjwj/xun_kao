
'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Constants, Carousel, PageControl, Card, Modal, View, Text, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import AlphabetListView from 'react-native-alphabetlistview'
import { SearchInput } from 'react-native-search-input';
import { Checkbox } from 'antd-mobile-rn';
import { CheckboxStyle1 } from '../common/ComponetStyle';
const AgreeItem = Checkbox.AgreeItem;

//业务处理
import { notice_UserList_zb } from '../actions/notice';

class SectionHeader extends React.Component {
    render() {
        var textStyle = {
            textAlign: 'left',
            color: Colors.dark10,
            fontSize: 16,
            marginLeft: 18
        };

        var viewStyle = {
            backgroundColor: YSColors.default_bjcolor
        };
        return (
            <View style={viewStyle}>
                <Text style={textStyle}>{this.props.title}</Text>
            </View>
        );
    }
}

class SectionItem extends React.Component {
    render() {
        return (
            <Text style={{ color: Colors.dark30, lineHeight: 24 }}>{this.props.title}</Text>
        );
    }
}

class Cell extends React.Component {


    render() {
        var cell_wrap = {
            height: 54,
            borderBottomWidth: 1,
            borderColor: Colors.dark80,
            marginHorizontal: 16
        }
        this.state = { Checkbox: this.props.item.checked || false }

        return (
            <View style={cell_wrap} row centerV>
                <AgreeItem data-seed="logId" onChange={e => {
                    console.log('checkbox', e);
                    this.props.onSelect(this.props, e.target.checked);
                }} styles={CheckboxStyle1} defaultChecked={this.props.item.checked || false} >
                    {this.props.item.name}
                </AgreeItem>
            </View>
        );
    }
}



class notice_AuditPerson extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            userList: this.props.AuditData.selectItem || []
        };

    };

    componentWillMount() {
        this.onsearch('');
    }
    onsearch(realname) {
        this.props.notice_UserList_zb({ realName: realname, PageIndex: 1, PageSize: 9999 });
    }
    onselect(props, checked) {
        // let data_list = this.props.notice_UserList.data_list;
        // let section= data_list.find(item=>item.key==props.sectionId);
        // let user =section.users[props.index];
        //this.props.onCallback(props.item, checked);
        let userList = this.state.userList;
        if (checked) {
            userList = [...userList, { selectedKey: props.item.uid, selectedLabel: props.item.name }];
        } else {
            userList = userList.filter(item => item.selectedKey != props.item.uid);
        }
        this.setState({ userList: userList });
    }
    onsave() {
        let auditData = { selectItem: [] };
        auditData.selectItem = this.state.userList;
        this.props.viewEditCallback(auditData);
    }
    render() {
        let data_list = this.props.notice_UserList;
        //let data_list_value=[];

        let data_list_value = {};
        let auditData = this.props.AuditData;
        data_list.map(item => {
            //加选中状态
            let datavaluelist = [];
            item.users.map(a => {
                if (auditData.selectItem.find(b => b.selectedKey == a.uid)) {
                    a = { ...a, checked: true };
                }
                datavaluelist = [...datavaluelist, a];
            })
            var key = item.key;
            data_list_value[key] = datavaluelist;
            //data_list_value=[...data_list_value,map[key]]
        })
        return (<View flex bg-white>
            <Modal.TopBar
                title={YSI18n.get('auditor')}
                titleStyle={styles.modalTitle}
                onCancel={() => {
                    this.props.viewEditCallback()
                }}
                onDone={() => {
                    this.onsave()
                }}
                cancelIcon={null}
                cancelLabel={YSI18n.get('Cancel')}
                doneLabel={YSI18n.get('Save')}
                doneButtonProps={{ color: Colors.blue30 }}
            />
            <View style={styles.inputStyle} >
                <SearchInput ref="search_box" backgroundColor={'transparent'} cancelTitle={YSI18n.get('Cancel')} titleCancelColor={Colors.blue30} placeholder={YSI18n.get('Search')} inputHeight={30}
                    onSearch={(text) => {
                        this.onsearch(text);
                    }}
                    onCancel={() => {
                        this.onsearch('');
                    }}
                /></View>
            <View style={{ height: YSWHs.height_window - 120 }}>
                <AlphabetListView
                    data={data_list_value}
                    cell={Cell}
                    cellHeight={54}
                    sectionListItem={SectionItem}
                    sectionHeader={SectionHeader}
                    sectionHeaderHeight={21}
                    onCellSelect={(props, checked) => {
                        console.log('props', props);
                        this.onselect(props, checked);
                    }}
                />
            </View>
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
    inputStyle: {
        paddingHorizontal: 11,
        height: 44,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: ThemeManager.dividerColor,
        marginBottom: 2,
    },

});

function select(store) {
    return {
        notice_UserList: store.notice.Notice_UserList_zb.data_list
    }
}

function mapDispatchToProps(dispatch) {
    return {
        notice_UserList_zb: bindActionCreators(notice_UserList_zb, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(notice_AuditPerson);

