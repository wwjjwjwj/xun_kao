/*
 * @flow
 * @providesModule YSLoaderScreen
 */

'use strict';
import React from 'react';
import { StyleSheet, ActivityIndicator } from "react-native";
import { LoaderScreen, ListItem, Avatar, Modal, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, Image, Assets } from 'react-native-ui-lib';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';

class YSLoaderScreen extends React.Component {
    render() {
        let { loading, data_list, tips } = this.props;
        loading = loading || false;
        if (loading === true) {
            return <LoaderScreen
                color={Colors.blue30}
                message={tips || YSI18n.get('Loading')}
                overlay
            />
        }
        else {
            return null
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlayContainer_Empty: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.rgba(Colors.white, 0.85),
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.rgba(Colors.white, 0.85),
        zIndex: 100
    },
    img_content: {
        width: 162,
        resizeMode: 'contain',
        marginBottom: 18 * YSWHs.scale_rx,
    },
});
module.exports = YSLoaderScreen;
