/**
 * Created by Administrator on 4/14/2017.
 * @providesModule My
 * @flow
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  Platform,
  NativeModules,
  ScrollView,
  NativeAppEventEmitter,
  Linking
} from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { List, WhiteSpace, DatePicker, Picker } from 'antd-mobile-rn';
import { Constants, Modal, View, Text, Typography, BorderRadiuses, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSI18n from 'YSI18n';
import { ListStyle, CustomLoginListStyle } from '../common/ComponetStyle'
import { district, provinceLite } from './data/index';

const Sex = [
  {
    "value": '01',
    "label": '男',
  },
  {
    "value": '02',
    "label": '女',
  },

]
const Country = [
  {
    "value": '01',
    "label": '中国',
  },
  {
    "value": '02',
    "label": '美国',
  },
  {
    "value": '03',
    "label": '法国',
  },
  {
    "value": '04',
    "label": '德国',
  },
  {
    "value": '05',
    "label": '英国',
  },
  {
    "value": '06',
    "label": '日本',
  },
]

const Item = List.Item;
const Brief = Item.Brief;

class My extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'Me',
      bidrthday: '2017-12-12',
      name: '顾小青'
    };
  }

  render() {
 
    let block_content = <View flex>
      <WhiteSpace size='lg' />
      <View row spread centerV style={styles.list_body}>
        <Text dark10 style={{ fontSize: 17 }}>
          {YSI18n.get('头像')}
        </Text>
        <View row center >
          <Image width={45} height={45} style={styles.img_thumb} source={{ uri: 'https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128' }} />
          <Image width={30} height={30} source={Assets.icons.extra} style={{ opacity: 0.6, }} />
        </View>
      </View>

      <WhiteSpace size='lg' />
      <List>
        <Item
          extra={'顾小青'}
          arrow="horizontal"
          multipleLine
          onClick={() => { this.props.navigation.navigate('editInputText', { title: YSI18n.get('姓名'), value: this.state.name }) }}
        >
          {YSI18n.get('姓名')}
        </Item>
        <Picker
          title={YSI18n.get('性别')}
          extra="请选择性别"
          data={Sex}
          cols={1}
          value={this.state.sex}
          onChange={v => this.setState({ sex: v })}
          onOk={v => this.setState({ sex: v })}
        >
          <Item arrow="horizontal">
            {YSI18n.get('性别')}
          </Item>
        </Picker>
        <DatePicker
          mode="date"
          extra={this.state.bidrthday || YSI18n.get('请选择生日')}
          value={this.state.date}
          onChange={date => this.setState({ date })}
          onOk={date => this.setState({ date })}
        >
          <Item arrow="horizontal">{YSI18n.get('生日')}</Item>
        </DatePicker>

        <Item
          extra={'68000102'}
          arrow=""
          multipleLine
        >
          {YSI18n.get('ID（账号）')}
        </Item>
      </List>
     
      <WhiteSpace size='lg'  style={styles.border}/>
     
    </View>

    return <View style={styles.container}>
    
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {block_content}
      </ScrollView>
    </View>
  };
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: YSColors.default_bjcolor,
  },
  img_thumb: {
    borderRadius: 4,
    resizeMode: 'cover',

  },
  block_navigator: {
    paddingTop: Constants.isIphoneX ? 29 : 0,
    height: Constants.isIphoneX ? 81 : 56,
    borderBottomWidth: 1,
    borderColor: Colors.dark70,
    backgroundColor: Colors.white
  },
  list_body: {
    backgroundColor: YSColors.whiteBackground,
    paddingLeft: 16,
    paddingRight: 5,
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: ThemeManager.dividerColor
  },
  border:{
    borderTopWidth:1,
    borderColor:ThemeManager.dividerColor,
  }

})


module.exports = (My);
