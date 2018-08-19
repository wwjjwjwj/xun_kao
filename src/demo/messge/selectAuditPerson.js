
'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { Checkbox, Constants, Carousel, PageControl, Card, Modal, View, Text, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import AlphabetListView from 'react-native-alphabetlistview'
import { SearchInput } from 'react-native-search-input';


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
        this.state = { Checkbox: false }

        return (
            <View style={cell_wrap} row centerV>
                <Checkbox
                    value={this.state.Checkbox}
                    onValueChange={value2 => this.setState({ Checkbox })}
                    borderRadius={2}
                    size={18}
                    color={Colors.blue30}
                    iconColor={Colors.white}
                    style={{ marginRight: 10 }}
                />
                <TouchableOpacity><Text text70>{this.props.item}</Text></TouchableOpacity>
            </View>
        );
    }
}



class selectAuditPerson extends React.Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            data: {
                A: ['爱钦', '爱钦', 'are here'],
                B: ['白知县', '白皓宇', '别鸿'],
                C: ['some', 'entries', 'are here'],
                D: ['some', 'entries', 'are here'],
                E: ['some', 'entries', 'are here'],
                F: ['some', 'entries', 'are here'],
                G: ['some', 'entries', 'are here'],
                H: ['some', 'entries', 'are here'],
                I: ['some', 'entries', 'are here'],
                J: ['some', 'entries', 'are here'],
                K: ['some', 'entries', 'are here'],
                L: ['some', 'entries', 'are here'],
                M: ['some', 'entries', 'are here'],
                N: ['some', 'entries', 'are here'],
                O: ['some', 'entries', 'are here'],
                P: ['some', 'entries', 'are here'],
                Q: ['some', 'entries', 'are here'],
                R: ['some', 'entries', 'are here'],
                S: ['some', 'entries', 'are here'],
                T: ['some', 'entries', 'are here'],
                U: ['some', 'entries', 'are here'],
                V: ['some', 'entries', 'are here'],
                W: ['some', 'entries', 'are here'],
                X: ['some', 'entries', 'are here'],
                Y: ['some', 'entries', 'are here'],
                Z: ['zzd', 'entries', 'are here'],
            }
        };

    };



    render() {
        return (<View flex bg-white>
            <Modal.TopBar
                title={YSI18n.get('审核人')}
                titleStyle={styles.modalTitle}
                onCancel={() => {
                     this.props.viewCallback()
                }}
                onDone={() => {
                    let dataModel = {};
                    if (this.state.enableSend) {
                        this.props.viewCallback(dataModel)
                    }

                }}
                cancelIcon={null}
                cancelLabel={YSI18n.get('Cancel')}
                doneLabel={YSI18n.get('保存')}
                doneButtonProps={this.state.enableSend ? { color: Colors.blue30 } : { color: Colors.dark60 }}
            />
            <View style={styles.inputStyle} ><SearchInput ref="search_box" backgroundColor={'transparent'} cancelTitle={YSI18n.get('取消')} titleCancelColor={Colors.blue30} placeholder={YSI18n.get('搜索')} inputHeight={30} /></View>
            <View style={{ height: YSWHs.height_window - 120 }}>
                <AlphabetListView
                    data={this.state.data}
                    cell={Cell}
                    cellHeight={54}
                    sectionListItem={SectionItem}
                    sectionHeader={SectionHeader}
                    sectionHeaderHeight={21}
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


module.exports = selectAuditPerson;
