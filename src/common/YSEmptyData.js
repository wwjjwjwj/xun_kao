/*
* @flow
* @providesModule YSEmptyData
*/

'use strict';

import {
  TouchableOpacity,
  View,
  Image,
  Text,
  findNodeHandle,
  StyleSheet
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import Util from 'Util';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSColors from 'YSColors';
import YSI18n from 'YSI18n';
import { BlurView } from 'react-native-blur';
import { Assets } from 'react-native-ui-lib';


export type Props = {
  dispatch: (action: any) => Promise<*>;
style ?: any;
progress: number;
showType: String;   //'total' or 'today' or ''
};


class YSEmptyData extends React.Component {
  constructor(props: Props) {
    super(props);


  }


  render() {
    return (
      <View style={styles.empty_wrap}>
        <Image style={styles.img_content} source={this.props.img_empty || Assets.icons.empty} />
        <Text style={[styles.text_personname,this.props.textStyle]}>{this.props.first_title || YSI18n.get('no_data')}</Text>
        {this.props.second_title && <Text style={[styles.text_secondTitle,this.props.textStyle]}>{this.props.second_title}</Text>}
      </View>
    );
  };
};

var styles = StyleSheet.create({

  empty_wrap: {
    flex: 1,
    width: YSWHs.width_window,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: YSWHs.height_window - YSWHs.header_height,
  },
  shadow_wrap: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: YSColors.shadowopcity
  },
  img_content: {
    width: 162,
    resizeMode: 'contain',
    marginBottom: 18 * YSWHs.scale_rx,
  },
  text_personname: {
    fontSize:  12 * YSWHs.scale_rx,
    color: YSColors.personame,
    marginBottom: 8 * YSWHs.scale_rx,
    backgroundColor: 'transparent'
  },
  text_secondTitle: {
    backgroundColor: 'transparent',
    color: YSColors.personame,
    fontSize: 16 * YSWHs.scale_rx,
  }


})

module.exports = YSEmptyData;
