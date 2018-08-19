/**
 * Created by Administrator on 4/14/2017.
 * @providesModule Me
 * @flow
 */

'use strict';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  NativeModules,
  NativeAppEventEmitter,
  Linking
} from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { Button, InputItem, Toast, List, WingBlank, Flex, WhiteSpace, TabBar } from 'antd-mobile-rn';
import YSI18n from 'YSI18n';


const Item = List.Item;
const Brief = Item.Brief;

class Me extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'Me',
    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }



  render() {
    let block_content = <View>
      <List>
        <Item
          extra={<Image style={styles.img_thumb} source={{uri:'https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128'}}/>}
          arrow="horizontal"
          multipleLine
          onClick={() => { }}
        >
          头像
        </Item>
      </List>
    </View>

    return <View style={styles.container}>
      {block_content}
    </View>
  };
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  img_thumb:{
    borderRadius:4,
  }
})


module.exports = (Me);
