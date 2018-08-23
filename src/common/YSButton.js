/*
 通用按钮
 @providesModule YSButton
 @flow
 */

'use strict';

import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import React from 'react';
import YSColors from 'YSColors';
import YSWHs from './YSWHs';
import YSFontSizes from './YSFontSizes';

class YSButton extends React.Component {
    static props: {
        type: 'primary' | 'secondary' | 'bordered';
        icon?: number;
        caption: string;
        style?: any;
        disable: boolean;
        onPress: () => mixed;
        text_style?: string;
    };

    static defaultProps = {
        type: 'primary',
        disable: false,
    };

    render() {
        const caption = this.props.caption.toUpperCase();
        let icon;
        if (this.props.icon) {
            icon = <Image source={this.props.icon} style={styles.icon}/>;
        }
        let content;

            var border = this.props.type === 'bordered' && styles.border;
            content = (
                <View style={[styles.button, border, this.props.style]}>
                    {icon}
                    <Text style={[styles.caption, styles.secondaryCaption, this.props.text_style]}>
                        {caption}
                    </Text>
                </View>
            );
        let block_button;

        if (!this.props.disable) {
            block_button = <TouchableOpacity
                accessibilityTraits="button"
                onPress={this.props.onPress}
                activeOpacity={1}
                style={[styles.container, this.props.style]}>
                {content}
            </TouchableOpacity>
        } else {
            block_button = <TouchableOpacity
                accessibilityTraits="button"
                activeOpacity={1}
                style={[styles.container,  styles.disalbe_button,this.props.style,]}>
                {content}
            </TouchableOpacity>
        }

        return block_button;
    }
}

var styles = StyleSheet.create({
    container: {
        height: YSWHs.buttonHeight,
        //borderRadius: YSWHs.scale_rx* 9,
        //backgroundColor: YSColors.AppMainColor,
        width:'100%',

        borderRadius: 99,
        backgroundColor: '#4B9FFF'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    border: {
        borderWidth: 1,
        borderColor: YSColors.lightText,
    },
    linearButton: {
        backgroundColor: 'transparent',
    },
    primary_wrap: {
        height: YSWHs.buttonHeight,
        borderRadius: YSWHs.buttonHeight / 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    primary_button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginRight: YSWHs.iconMarginRight,
    },
    caption: {
        letterSpacing: YSWHs.letterSpacing,
        fontSize: 16*YSWHs.scale_rx,
    },
    linearCaption: {
        color: 'white',
    },
    primary_caption: {
        color: 'white',

    },
    secondaryCaption: {
        color: YSColors.lightText,
    },
    disalbe_button: {
        backgroundColor: YSColors.disableButton,
    },
});

module.exports = YSButton;
