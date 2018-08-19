'use strict';

import React from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { RadioButton, RadioGroup, Card, View, Text, BorderRadiuses, Modal, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
import YSdetailField from 'YSdetailField';


class leagueSchoolDetail extends React.Component {
    state: State;
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <View row>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.params.onEdit()
                    }}>
                        <Image source={Assets.icons.edit} />
                    </TouchableOpacity>
                </View>

            ),
        }
    }
    constructor(props: Props) {
        super(props);
        props.navigation.setParams({
            onEdit: () => {
                //编辑
                this.onLookView('Edit', {})
            },
        })
        this.state = {
            state: '启用'
        }

    };

    renderRadioButton(value, text) {
        return (
            <View row centerV marginB-5 >
                <RadioButton value={value} />
                <Text marginL-15 marginR-50>{text}</Text>
            </View>
        );
    }

    render() {
        let block_largePhoto = <View center>
            <Image source={{ uri: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5' }} width={YSWHs.width_window} height={YSWHs.width_window / 1.7} />
            <Text text70 dark40 marginV-13>刘涛</Text>
            <Text text60 dark10 marginB-13>泰安泰山盟校</Text>
        </View>
        let block_space = <View style={styles.grayspace} bg-dark80 ></View>

        let block_field = <View marginT-20>
            <View><YSdetailField label={YSI18n.get('盟校级别')} value={'一级'} containerStyle={styles.field_Wrap} /></View>
            <View><YSdetailField label={YSI18n.get('开始时间')} value={'2018-06-06'} containerStyle={styles.field_Wrap} /></View>
            <View><YSdetailField label={YSI18n.get('截止时间')} value={'2018-07-06'} containerStyle={styles.field_Wrap} /></View>
        </View>
        let block_state = <View paddingH-16 paddingB-12 style={styles.border}>
            <RadioGroup value={this.state.state} onValueChange={value => this.setState({ state: value })}>
                <Text marginB-16 text90 dark40 >
                    {YSI18n.get('当前状态')}
                </Text>
                <View row >
                    {this.renderRadioButton('全部', '全部')}
                    {this.renderRadioButton('启用', '启用')}
                    {this.renderRadioButton('停用', '停用')}
                </View>
            </RadioGroup>
        </View>


        return (
            <View flex bg-white styles={styles.container}>
                <ScrollView>
                    {block_largePhoto}
                    {block_space}
                    {block_field}
                    {block_state}
                </ScrollView>
            </View>

        );
    }


};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    grayspace: {
        height: 11,
        backgroundColor: YSColors.default_bjcolor,
    },
    field_Wrap: {
        paddingHorizontal: 16
    },
    border: {
        borderBottomWidth: 1,
        borderColor: ThemeManager.dividerColor,
    }


});


module.exports = leagueSchoolDetail;
