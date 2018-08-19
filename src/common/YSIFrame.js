
import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    RefreshControl,
    Input,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import YSWebView from '../common/YSWebView';

class YSIFrame extends React.Component {
    static navigationOptions = ({ navigation }) => {
        if (navigation.state.params.iframeInfo.showHeader) {
            return {
                title: navigation.state.params.iframeInfo.title//`Chat with ${navigation.state.params.user}`,
            };
        }
        else {
            return { header: null };
        }
    };

    render() {
        let url = this.props.navigation.state.params.iframeInfo.url;
        if (this.props.navigation.state.params.iframeInfo.showHeader) {
            return (
                <YSWebView url={url} />
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.closeBtn} activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
                        <Image style={styles.img_closebtn} source={require('./img/CLOSE.png')}/>
                    </TouchableOpacity>
                    <YSWebView url={url} />
                </View>
            );
        }
    }
};
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop:Platform.OS=='ios'?20:0,
        backgroundColor:'white',
    },
    closeBtn:{
        position:'absolute',
        right:5,
        top:Platform.OS=='ios'?30:20,
        zIndex:1,
    },
    img_closebtn:{
        width:30,
        height:30,

        resizeMode:'contain',
    }
})
module.exports = YSIFrame;
