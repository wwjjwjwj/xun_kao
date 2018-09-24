/**
 * Created by Administrator on 4/14/2017.
 * @providesModule Introduction
 * @flow
 */
'use strict';

import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    View,
    Text,
    Platform,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import {Button, Toast, WhiteSpace, WingBlank} from 'antd-mobile-rn';

import {appVersion} from './env';
import {connect} from 'react-redux';
import {ViewIntroduction, skipAd} from './actions/user';

import React from 'react';
import Swiper from 'react-native-swiper';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSColors from 'YSColors';
import YSI18n from 'YSI18n';
import { Constants } from 'react-native-ui-lib';
//const IMGuide1x = require('../assets/guide01-iphone.jpg');
//const IMGuide3x = require('../assets/guide03-iphone.jpg');

const IMGuide1x = require('./assets/img_guide_1.png');
const IMGuide3x = require('./assets/img_guide_2.png');
const StyleSheet = require('./common/YSStyleSheet');

class Introduction extends React.Component {
    componentDidMount() {
    };

    componentWillUnmount() {
        //clearInterval(this.timer);
        //clearTimeout(this.timer2);
    };

    loadGuidImage=(index)=>{
        //iphonex 适配
        /*if(Constants.isIphoneX){
            switch (index){
                case 1:
                    return require('../assets/guide01-iphonex.jpg');
                case 2:
                    return require('../assets/guide02-iphonex.jpg');
                case 3:
                    return require('../assets/guide03-iphonex.jpg');
            }
        }
        else{*/
            switch (index){
                case 1:
                    //return require('../assets/guide01-iphone.jpg');
                    return require('./assets/img_guide_1.png');
                case 3:
                    //return require('../assets/guide03-iphone.jpg');
                    return require('./assets/img_guide_2.png');
            }
        //}
    }
    gotoLogin(){
      //this.props.dispatch(ViewIntroduction(curentAppVersion))
      this.props.dispatch(skipAd())
    }
    render() {
        let curentAppVersion = appVersion;
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <Swiper style={styles.wrapper} loop={false}
                        dot={<View style={styles.dotstyle}/>}
                        activeDot={<View style={styles.activeDotStyle}/>} showsButtons={false}>
                    <View style={styles.slide1}>
                        <Image
                            style={styles.image} source={this.loadGuidImage(1)}>
                        </Image>
                    </View>
                    <View style={styles.slide3}>
                        <ImageBackground
                            style={[styles.image, styles.image_wrap]} source={this.loadGuidImage(3)}>
                            <View style={styles.button_wrap}>
                                <Button
                                    style={styles.border_button}
                                    onClick={() => {
                                        this.gotoLogin();
                                    }}>登录</Button>
                            </View>
                        </ImageBackground>
                    </View>
                </Swiper>
            </View>
        );
    }
};

var styles = StyleSheet.create({
    animated: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    slide1: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    slide2: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    slide3: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    skip: {
        position: 'absolute',
        bottom: 70,
        backgroundColor: 'rgba(255,255,255,0.5)',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 35,
        paddingRight: 35,
        borderColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttontext: {
        color: '#666',
        fontSize: 14
    },
    image: {
        resizeMode: 'contain',
        flex: 1,
        width: '100%',
        height: YSWHs.height,
    },
    border_button: {
        ios: {
            height: 100 * YSWHs.scale_rx,
            width: 100 * YSWHs.scale_rx,
            borderRadius: 99,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center'
        },
        ipad: {
            height: 160 * YSWHs.scale_rx,
            width: 160 * YSWHs.scale_rx,
            borderRadius: 99,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center'
        },
        android: {
            borderRadius: 99,
            backgroundColor: 'rgba(255,255,255,0.9)',
            height: 100 * YSWHs.scale_rx,
            width: 100 * YSWHs.scale_rx,
            alignItems: 'center',

        }
    },
    text_caption: {
        ios: {
            fontSize: 30 * YSWHs.scale_rx
        },
        android: {
            fontSize: 30 * YSWHs.scale_rx
        },
        ipad: {
            fontSize: 45 * YSWHs.scale_rx,
        },

    },
    button_wrap: {
        ios: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        ipad: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'

        },
        android: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

        },

    },
    image_wrap: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    dotstyle: {
        ios: {
            backgroundColor: 'rgba(153,153,153,.5)',
            width: 6,
            height: 6,
            borderRadius: 8,
            marginLeft: 7,
            marginRight: 7,
            marginTop: 37 * YSWHs.scale_rx,
            marginBottom: 17 * YSWHs.scale_rx,
        },
        ipad: {
            backgroundColor: 'rgba(153,153,153,.5)',
            width: 6,
            height: 6,
            borderRadius: 8,
            marginLeft: 7,
            marginRight: 7,
            marginTop: 37 * YSWHs.scale_rx,
            marginBottom: 37 * YSWHs.scale_rx,
        },
        android: {
            backgroundColor: 'rgba(153,153,153,.5)',
            width: 6,
            height: 6,
            borderRadius: 8,
            marginLeft: 7,
            marginRight: 7,
            marginTop: 37 * YSWHs.scale_rx,
            marginBottom: 17 * YSWHs.scale_rx,
        }

    },
    activeDotStyle: {
        ios: {
            backgroundColor: 'rgba(153,153,153,1)',
            width: 24,
            height: 6,
            borderRadius: 8,
            marginLeft: 7,
            marginRight: 7,
            marginTop: 37 * YSWHs.scale_rx,
            marginBottom: 17 * YSWHs.scale_rx,
        },
        ipad: {
            backgroundColor: 'rgba(153,153,153,1)',
            width: 24,
            height: 6,
            borderRadius: 8,
            marginLeft: 7,
            marginRight: 7,
            marginTop: 37 * YSWHs.scale_rx,
            marginBottom: 37 * YSWHs.scale_rx,
        },
        android: {
            backgroundColor: 'rgba(153,153,153,1)',
            width: 24,
            height: 6,
            borderRadius: 8,
            marginLeft: 7,
            marginRight: 7,
            marginTop: 37 * YSWHs.scale_rx,
            marginBottom: 17 * YSWHs.scale_rx,
        }
    }

});

module.exports = connect()(Introduction);
