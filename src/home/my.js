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
  TouchableOpacity,
  Linking
} from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { Constants, Modal, View, Text, Typography, BorderRadiuses, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';
import YSI18n from 'YSI18n';
import { InputItem, Toast, List, WingBlank, Flex, WhiteSpace, TabBar, Card, Grid } from 'antd-mobile-rn';
import { CustomCardStyle1, CustomCardStyle2 } from '../common/ComponetStyle';
const datas = [
  {
    surname: "李小青",
    name: '小青',
    role: "总经理",
    sex: '1',
    depart: "信息化部门",
    state: '在职',
    mobile: '18673679789',
    email: 'guxq@shenmo.com',
    entry: '2018-06-06',
    password: '******',
    id: '20170601001',
    thumbnail: "https://static.wixstatic.com/media/d911269bdf7972c9a59ba30440cb3789.jpg_128"
  },


]

class My extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  renderNavigation() {
    return <View style={styles.block_navigator} row center>
      <View style={{ width: 40 }} />
      <View center flex-1>
        <Text blue30 text70>{YSI18n.get('我的')}</Text>
      </View>
      <View style={{ width: 40 }}><TouchableOpacity onPress={() => this.props.navigation.navigate('setting')}>
        <Image source={Assets.icons.setting} />
      </TouchableOpacity></View>
    </View>
  }

  renderUser() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('myInformation')}>
        <View row centerV padding-s5 bg-white>
          <Image style={styles.img_user} source={{ uri: datas[0].thumbnail }} />
          <View row centerV flex-1>
            <View flex-1>
              <View row centerV marginB-s4>
                <Text text60 dark10 marginR-s2>顾小青</Text>
                <Image source={datas[0].sex == 1 ? Assets.sex.ico1 : Assets.sex.ico2} />
              </View>
              <Text text80 dark10>ID：20170601001</Text>
            </View>
            <Image source={Assets.icons.extra} width={25} height={25} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderComment() {
    return (
      <Card styles={CustomCardStyle2} full={true}>
        <Card.Header
          title={YSI18n.get('我评论的资讯')}
          thumbStyle={{ width: 43, height: 43 }}
          thumb={<Image source={Assets.icons.comment} />}
          extra={<View style={styles.all} row centerV >
            <Button link label={YSI18n.get('全部')} dark40 onPress={() => { this.onAll() }} />
            <Image source={Assets.icons.extra} width={25} height={25} />
          </View>}
        />
        <Card.Body>
          <WingBlank>
            <Text style={styles.text_newsTitle}>神墨第三届新加坡珠心算国际比赛成功举行</Text>
          </WingBlank>
          <WhiteSpace />
          <WingBlank>
            <Flex justify='between'>
              <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />
              <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />
              <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />
            </Flex>
          </WingBlank>
          <WhiteSpace />
          <WingBlank><Text style={styles.text_author}>作者 666评论 小时前</Text></WingBlank>
          <WhiteSpace />
        </Card.Body>
      </Card>
    )
  }
  renderActivity() {
    return (
      <Card styles={CustomCardStyle1} full={true}>
        <Card.Header
          title={YSI18n.get('我参与的活动')}
          thumbStyle={{ width: 43, height: 43 }}
          thumb={<Image source={Assets.icons.activity} />}
          extra={<View style={styles.all} row centerV >
            <Button link label={YSI18n.get('全部')} dark40 onPress={() => { this.onAll() }} />
            <Image source={Assets.icons.extra} width={25} height={25} />
          </View>}
        />
        <Card.Body>
          <WingBlank>
            <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} width={YSWHs.width_window - 30} height={(YSWHs.width_window - 30) / 1.7} />
          </WingBlank>
          <WhiteSpace />

        </Card.Body>
      </Card>
    )
  }

  render() {
    return <View style={styles.container}>
      {this.renderNavigation()}
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <WhiteSpace size='lg' />
        {this.renderUser()}
        <WhiteSpace size='lg' />
        {this.renderComment()}
        <WhiteSpace size='lg' />
        {this.renderActivity()}
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

  block_navigator: {
    paddingTop: Constants.isIphoneX ? 29 : 0,
    height: Constants.isIphoneX ? 81 : 56,
    borderBottomWidth: 1,
    borderColor: Colors.dark70,
    backgroundColor: Colors.white
  },

  img_user: {
    borderRadius: BorderRadiuses.br30,
    width: 70,
    height: 70,
    resizeMode: 'cover',
    marginRight: 15
  },
  img_recmmend: {
    width: Math.round((YSWHs.width_window - 38) / 3),
    height: Math.round((YSWHs.width_window - 38) / 3 / 1.43),
    resizeMode: 'cover'
  },
  text_newsTitle: {
    fontSize: YSFontSizes.lg,
    color: YSColors.default_color,
  },
  text_author: {
    fontSize: YSFontSizes.content,
    color: YSColors.graytext,
  },
  all: {
    alignSelf: 'flex-end'
  },

})


module.exports = (My);
