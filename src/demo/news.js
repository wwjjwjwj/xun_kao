/**
 * Created by Administrator on 4/14/2017.
 * @providesModule News
 * @flow
 */

'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  NativeModules,
  TouchableOpacity,
  NativeAppEventEmitter,
  Linking
} from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { Button, InputItem, Toast, List, WingBlank, Flex, WhiteSpace, TabBar, Card, Grid } from 'antd-mobile-rn';
import { CustomCardStyle1, CustomCardStyle2 } from '../common/ComponetStyle';
import YSI18n from 'YSI18n';

const img_title = [
  require('../../assets/activity-home.png'),
  require('../../assets/information.png'),
]
let data = Array.from(new Array(2)).map((_val, i) => ({
  icon: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5',
  text: `活动标题，最多显示两行${i}`,
}));

class News extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'News',
    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }



  render() {
    let block_carousel = <View style={styles.block_carousel}></View>
    let block_activity = <Card styles={CustomCardStyle1} full={true}>
      <Card.Header
        title="神墨活动"
        thumbStyle={{ width: 43, height: 43 }}
        thumb={<Image source={img_title[0]} />}
        extra={<TouchableOpacity style={styles.all}><Text>全部 ></Text></TouchableOpacity>}
      />
      <Card.Body>
        <Grid
          data={data}
          hasLine={false}
          columnNum={2}
          renderItem={(el, index) => {
            return <Flex direction='column' justify='start' align='center' style={index == 0 ? styles.left_block : styles.right_block}>
              <Image source={{ uri: el.icon }} style={styles.img_activity} />
              <WhiteSpace />
              <Text>{el.text}</Text>
            </Flex>
          }}
          itemStyle={styles.itemstyle}
        />
      </Card.Body>
    </Card>

    let block_recomend = <Card styles={CustomCardStyle2} full={true}>
      <Card.Header
        title="资讯推荐"
        thumbStyle={{ width: 43, height: 43 }}
        thumb={<Image source={img_title[1]} />}
        extra={<TouchableOpacity style={styles.all}><Text>全部 ></Text></TouchableOpacity>}
      />
      <Card.Body>
        <WingBlank><Text style={styles.text_newsTitle}>神墨第三届新加坡珠心算国际比赛成功举行</Text></WingBlank>
        <WhiteSpace />
        <Flex justify='between'>
          <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />
          <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />
          <Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />
        </Flex>
         <WhiteSpace />
        <WingBlank><Text style={styles.text_author}>作者 666评论 小时前</Text></WingBlank>
      </Card.Body>
    </Card>

    let whitespace = <WhiteSpace style={styles.whitespace} />

    return <ScrollView
      style={styles.container}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {block_carousel}
      {block_activity}
      {whitespace}
      {block_recomend}
    </ScrollView>
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: YSColors.whiteBackground
  },
  block_carousel: {
    backgroundColor: YSColors.default_bjcolor,
    height: 188,
  },
  whitespace: {
    backgroundColor: YSColors.default_bjcolor,
    height: 10,
  },
  all: {
    alignSelf: 'flex-end'
  },
  left_block: {
    paddingRight: 5,
    height: '100%',
  },
  right_block: {
    paddingLeft: 5,
    height: '100%',
  },
  img_activity: {
    width: '100%',
    height: Math.round((YSWHs.width_window / 2 - 10) / 1.85),
    resizeMode: 'cover'
  },
  itemstyle: {
    height: YSWHs.width_window / 375 * 141
  },
  img_recmmend: {
    width: Math.round((YSWHs.width_window - 15) / 3),
    height: Math.round((YSWHs.width_window - 15) / 3 / 1.43),
    resizeMode: 'cover'
  },
  text_newsTitle: {
    fontSize: YSFontSizes.lg,
    color: YSColors.default_color,
  },
  text_author:{
    fontSize:YSFontSizes.content,
    color:YSColors.graytext,
  }

})


module.exports = (News);
