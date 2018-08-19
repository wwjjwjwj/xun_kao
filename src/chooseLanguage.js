'use strict';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity, Image, ScrollView
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';

import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSColors from 'YSColors';
import YSI18n from 'YSI18n';
import Util from 'Util';
import IMG_RIGHT_ARROW from '../assets/choose_active.png';
import { ChooseLanguage } from './actions/user';
const SupportLanguages = [
    { title: '简体中文', value: 'zh' },
    { title: 'English', value: 'en' }];
class ChooseLanguages extends React.Component {
    constructor(props) {
        super();
        props.navigation.setParams({ btn_click: this.onSave })
    }

    onSave = () => {
        this.props.dispatch(ChooseLanguage(this.state.currentLanguage));
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 500)
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('Languages'),
            headerRight: (
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.state.params.btn_click()
                }}>
                    <Text style={{ color: YSColors.AppMainColor, fontSize: YSFontSizes.normal }}>{YSI18n.get('finish')}</Text>
                </TouchableOpacity>

            ),
        }
    }

    componentWillMount() {
        this.setState({ currentLanguage: this.props.currentLanguage });
    }

    chooseLanguage(item) {
        this.setState({ currentLanguage: item.value });
    }

    render() {

        return <ScrollView style={styles.body}>
            <View style={styles.container}>
                {
                    SupportLanguages.map((item, index) => {
                        if (index + 1 < SupportLanguages.length)
                            var split = <View style={styles.split}></View>
                        else
                            var split = null;
                        return (<View>
                            <TouchableOpacity style={styles.blockUDTop} activeOpacity={0.6}
                                onPress={() => this.chooseLanguage(item)}>
                                <Text style={styles.blockCenter}>{item.title}</Text>
                                {item.value == this.state.currentLanguage ?
                                    <Image style={styles.blockRight} source={IMG_RIGHT_ARROW} /> : null}
                            </TouchableOpacity>
                            {split}
                        </View>);
                    })
                }
            </View>
        </ScrollView>
    };
}

var styles = StyleSheet.create(
    {
        body: {
            backgroundColor: YSColors.bodybj,
        },
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderColor: YSColors.listborder,
        },
        blockUDTop: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: YSWHs.my_blockUDDown,
            paddingLeft: YSWHs.block_margin,
        },
        blockCenter: {
            flex: 4,
            alignSelf: 'center',
            fontSize: YSFontSizes.medium,

        },
        blockRight: {
            alignSelf: 'center',
            resizeMode: 'contain',
            width: YSWHs.rightArrow,
            marginRight: YSWHs.block_margin,
        },
        split: {
            height: 1,
            flex: 1,
            backgroundColor: YSColors.listborder,


        }

    })

function select(store) {
    return {
        currentLanguage: store.user.language || 'zh',
    }
}

module.exports = connect(select)(ChooseLanguages);
