/*
 * @flow
 * @providesModule YSAppSettings
 */

'use strict';

import {
  View,
  Image,
  Platform,
  Text,
  Modal,
  Easing,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';

import YSFontSizes from 'YSFontSizes';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSI18n from 'YSI18n';

const StyleSheet = require('./YSStyleSheet');
const IMG_CONTENT = [
  require('../assets/img_camer_setting.png'),
  //require('../assets/img_micro_setting.png'),
  //require('../assets/img_messge_setting.png'),
]
const IMG_CLOSEBUTTON = require('../assets/img_close_button.png');

export type Props = {
  callback?: any;
};
export type State = {
  moveDistance: Animated;
  animate_opacity: Animated;

}

class YSAppSettings extends React.Component {
  props: Props;
  static props: {


  }
  constructor(props: Props) {
    super(props);

    this.state = {
      animate_opacity: new Animated.Value(0),
    }

  }
  componentDidMount() {
    this.moveDistance();
  };
  moveDistance() {
    Animated.sequence([
      Animated.timing(this.state.animate_opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
      }),
    ]).start();
  }

  render() {

    let block_button = null;
    if (Platform.OS == 'ios') {
      block_button = <View style={styles.block_buttonWrap}>
        <TouchableOpacity style={styles.touch_button} onPress={() => this.props.callback()}>
          <Text style={styles.text_ok}>{YSI18n.get("马上设置")}</Text>
        </TouchableOpacity>
      </View>
    } else {
      block_button = <View style={styles.block_buttonWrap_android}>
        <TouchableOpacity style={styles.touch_button_android} onPress={() => this.props.callback()}>
          <Text style={styles.text_ok_android}>{YSI18n.get("马上设置")}</Text>
        </TouchableOpacity>
      </View>
    }

    let block_close = <View style={styles.block_close_wrap}>
      <TouchableOpacity activeOpacity={1} onPress={() => this.props.hideDialog()}><Image source={IMG_CLOSEBUTTON} style={styles.img_closebutton} /></TouchableOpacity>
    </View>

    if (Platform.OS == 'ios') {
      return (
        <Animated.View style={[styles.block_container, { opacity: this.state.animate_opacity }]}>
          <TouchableWithoutFeedback onPress={() => this.props.hideDialog()}>
            <View style={styles.modal_mask} />
          </TouchableWithoutFeedback>
          <View style={styles.block_dialogConten_wrap}>
            {this.props.type == 1 && <Image source={IMG_CONTENT[0]} style={styles.img_content} />}
            {this.props.type == 1 && <Text style={styles.text_header}>{YSI18n.get("相机权限未打开")}</Text>}
            {this.props.type == 1 && <Text style={styles.text_small}>{YSI18n.get("去“设置”允许E考官访问相机")}</Text>}
            {block_button}
          </View>
          {block_close}
        </Animated.View >
      )
    } else {
      return (
        <Animated.View style={[styles.block_container, { opacity: this.state.animate_opacity }]}>
          <TouchableWithoutFeedback onPress={() => this.props.hideDialog()}>
            <View style={styles.modal_mask} />
          </TouchableWithoutFeedback>
          <View style={styles.block_dialogConten_wrap}>
            {this.props.type == 1 && <Text style={styles.text_header_android}>{YSI18n.get("相机权限未打开")}</Text>}
            {this.props.type == 1 && <Text style={styles.text_small_android}>{YSI18n.get("您好,您的相机权限未打开,请前往手机“设置”允许E考官访问相机.")}</Text>}
            {block_button}
          </View>
        </Animated.View >
      )
    }

  }
}
;
var styles = StyleSheet.create({
  block_container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_mask: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  block_dialogConten_wrap: {
    width: 326 * YSWHs.scale_rx,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: YSColors.whiteBackground,
    borderRadius: 8 * YSWHs.scale_rx,
  },
  text_header: {
    fontSize: YSFontSizes.listheader,
    color: '#333',
    marginBottom: 16 * YSWHs.scale_rx,
    marginTop: 36 * YSWHs.scale_rx,
    backgroundColor: 'transparent'
  },
  text_header_android: {
    fontSize: 20*YSWHs.scale_rx,
    color: '#333',
    marginBottom: 38 * YSWHs.scale_rx,
    marginTop: 36 * YSWHs.scale_rx,
    backgroundColor: 'transparent'
  },
  block_dialogConten: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 80,
  },
  block_buttonWrap: {
    height: 46 * YSWHs.scale_rx,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 24 * YSWHs.scale_rx,
    paddingRight: 24 * YSWHs.scale_rx,
    marginBottom: 24 * YSWHs.scale_rx,
  },
  block_buttonWrap_android: {
    height: 46 * YSWHs.scale_rx,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: YSColors.listborder,
  },
  touch_button: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: YSColors.AppMainColor,
    borderRadius: 999,
  },
  touch_button_android: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f0f2',
    borderBottomLeftRadius: 8 * YSWHs.scale_rx,
    borderBottomRightRadius: 8 * YSWHs.scale_rx,
  },
  text_small: {
    fontSize: YSFontSizes.normal,
    color: YSColors.default,
    marginBottom: 24 * YSWHs.scale_rx,
    backgroundColor: 'transparent'
  },
  text_small_android: {
    fontSize: YSFontSizes.normal,
    color: YSColors.default,
    marginBottom: 38 * YSWHs.scale_rx,
    backgroundColor: 'transparent',
    marginHorizontal:64*YSWHs.scale_rx,
    textAlign:'justify',
    lineHeight:Math.round(24*YSWHs.scale_rx),
  },
  text_ok: {
    fontSize: YSFontSizes.listheader,
    color: YSColors.lightText,
    backgroundColor: 'transparent'
  },
  text_ok_android: {
    fontSize: YSFontSizes.listheader,
    color: YSColors.listcontent,
    backgroundColor: 'transparent'
  },
  img_content: {
    marginTop: 40 * YSWHs.scale_rx,
    width: 195 * YSWHs.scale_rx,
    height: 205 * YSWHs.scale_rx,
    resizeMode: 'contain',
  },
  block_close_wrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img_closebutton: {
    height: 60 * YSWHs.scale_rx,
    width: 60 * YSWHs.scale_rx,
    resizeMode: 'contain',
  }


});



module.exports = YSAppSettings;
