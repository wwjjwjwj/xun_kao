/*
 * @flow
 * @providesModule YSLoading
 */

'use strict';

import {
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    StyleSheet,
    ActivityIndicator,
    Modal,
    Platform,
    Image,
} from 'react-native';
import React from 'react';
const { width, height } = Dimensions.get('window')
import loadingImage from '../../assets/loading.gif'
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';

class YSLoading extends React.Component {


    render() {
        const { opacity, backgroundColor } = this.props;
        let loading_type = this.props.loading_type || 0;
        if (loading_type === 0) {
            return (<View>
                <View style={[styles.loadingView, {
                    opacity: opacity || 1,
                    backgroundColor: backgroundColor || '#f5f5f5'
                }]}>
                    <View style={styles.loading_wrap}>
                        <Image style={styles.loadingImage} source={loadingImage} />
                        <Text style={styles.text_tip}>{YSI18n.get('Trying_to_load')}</Text>
                    </View>
                </View>
            </View>

            )
        } else {
            let block_text = null;
            if (this.props.loading_Text && this.props.loading_Text.length > 0) {
                block_text = <Text style={styles.text_tip}>{this.props.loading_Text}</Text>
            }
            return (
                <View style={styles.loadingView}>
                    <View style={styles.loading_wrap}>
                        <View style={styles.shadow_wrap}>
                            <ActivityIndicator
                                size={'large'}
                                color={'#fff'}
                                animating={true}
                                style={[styles.centering, { backgroundColor: 'transparent' }]}
                            />
                            {block_text}
                        </View>
                    </View>
                </View>

            )
        }


    }
}
;
var styles = StyleSheet.create({
    loading_wrap: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute',
        zIndex: Platform.OS === 'ios' ? 1 : 0,

    },
    loadingImage: {
        width: 150 * YSWHs.scale_rx,
        height: 180 * YSWHs.scale_rx,
        resizeMode: 'contain',
        marginTop: -120 * YSWHs.scale_rx
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',

    },
    text_tip: {
        fontSize: YSFontSizes.normal,
        color: YSColors.datetimeText,
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8 * YSWHs.scale_rx,

    },
    shadow_wrap: {
        backgroundColor: "rgba(0,0,0,0.8)",
        width: YSWHs.loading_shadow,
        height: YSWHs.loading_shadow,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: YSWHs.loading_Radius,
    }
});
module.exports = YSLoading;
