'use strict'; 'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
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
import { InputItem, Toast, List, WingBlank, Flex, WhiteSpace, TabBar, Card, Grid } from 'antd-mobile-rn';
import { CustomCardStyle1, CustomCardStyle2 } from '../common/ComponetStyle';
import { Constants, View, Text, Button, Image, Colors } from 'react-native-ui-lib';
import Carousel from 'react-native-snap-carousel';
import YSI18n from 'YSI18n';
import { formatMsgTime } from '../common/Util';


//业务处理
import { information_Home_list } from '../actions/zixun';

const img_title = [
  require('../../assets/activity-home.png'),
  require('../../assets/information.png'),
]
let data = Array.from(new Array(2)).map((_val, i) => ({
  icon: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5',
  text: `活动标题，最多显示两行${i}`,
}));

const sliderWidth = YSWHs.width_window;
const sliderHeight = Math.round(163 * YSWHs.scale_rx);
const itemHeight = Math.round(163 * YSWHs.scale_rx);

const horizontalMargin = Math.round(2.5 * YSWHs.scale_rx);
const slideWidth = Math.round(349 * YSWHs.scale_rx);
const itemWidth = slideWidth + horizontalMargin * 2;
const currentCourseLevelIndex = 1;
class News extends React.Component {

  constructor() {
    super();
    this._renderItem = this._renderItem.bind(this);
    this.state = {
      selectedTab: 'News',
      data: [
        { url: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5', title: '1' },
        { url: 'http://img.shijue.me/d1e92808168d4696b019b32dd30081dd_d.jpg!dp5', title: '2' },
        { url: 'http://img.shijue.me/6ab94e9a712a4dee997120f65ee87ef6_d.jpg!dp5', title: '3' }
      ],

      slideIndex: 1
    };
  }


  componentWillMount() {
    this.props.information_Home_list(1, 1, 10);
  }


  _renderItem({ item, index }) {
    return (
      <View style={styles.slide} >
        <TouchableOpacity style={styles.slideInnerContainer} activeOpacity={1}>
          <Image
            source={{ uri: item.url }}
            style={styles.carouse_img}
          />
        </TouchableOpacity>
      </View>
    )

  }

  render() {
    let block_navigator = <View style={styles.block_navigator} row center>
      <Text blue30 text70>{YSI18n.get('news_full')}</Text>
    </View>
    let block_dot = this.state.data.map((ele, index) => {
      return (<View style={this.state.slideIndex == index ? styles.activtyDotStyle : styles.dotstyle} key={index}></View>)
    })
    let block_carousel = <View style={styles.block_carousel}>
      <Carousel ref={(carousel) => {
        this._carousel = carousel;
      }}
        data={this.state.data}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        autoplay={true}
        loop={true}
        enableSnap={true}
        swipeThreshold={2}
        firstItem={currentCourseLevelIndex}
        enableMomentum={true}
        activeSlideAlignment={'center'}
        carouselHorizontalPadding={0}
        showsHorizontalScrollIndicator={false}
        snapOnAndroid={true}
        renderItem={this._renderItem}
        removeClippedSubviews={false}
        onSnapToItem={(index) => {
          this.setState({ slideIndex: index })
        }}
      >

      </Carousel >
      <View row center style={styles.dot_wrap}>{block_dot}</View>
    </View >


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

    let block_datalist_view = this.props.informationList.map((item, index) => {
      let block_followed_view = item.isCollect == 0 ? null :
        <TouchableOpacity onPress={() => this.parent()} style={{ borderWidth: 1, borderColor: YSColors.AppMainColor, marginRight: 10 }}>
          <Text blue30 >{YSI18n.get('followed')}</Text>
        </TouchableOpacity>
      switch (item.coverType) {
        case 0:
        case 1:
          let block_Files_view1 = item.coverType == 1 && item.covers.length > 0 ?
            <Image source={{ uri: item.covers[0].coverPath }} style={styles.img_recmmend} /> : null;
          //<Image source={{ uri: 'http://img.shijue.me/23e27d0eb92940128161ee80915b9364_d.jpg!dp5' }} style={styles.img_recmmend} />:null;

          return (<Card.Body key={index}>
            <View row spread >
              <View centerV flex-1 paddingH-15>
                <Text style={styles.text_newsTitle} marginB-30>{item.title}</Text>
                <View row centerV>
                  {block_followed_view}
                  <Text>{item.infoAuthor} {item.evaluationCount}{YSI18n.get('evaluationtext')} {formatMsgTime(item.publishDate)}</Text>
                </View>
              </View>
              {block_Files_view1}
            </View>
          </Card.Body>
          );
          break;
        case 2:
          let block_Files_view2 = item.covers.map((a, aindex) => {
            return (
              <Image key={'file_' + aindex} source={{ uri: a.coverPath }} style={styles.img_recmmend} />
            );
          });
          return (
            <Card.Body key={index}>
              <WingBlank><Text style={styles.text_newsTitle}>{item.title}</Text></WingBlank>
              <WhiteSpace />
              <Flex justify='between'>
                {block_Files_view2}
              </Flex>
              <WhiteSpace />
              <WhiteSpace />
              <WingBlank>
                <View row centerV>
                  {block_followed_view}
                  <Text style={styles.text_author}>{item.infoAuthor} {item.evaluationCount}{YSI18n.get('evaluationtext')} {formatMsgTime(item.publishDate)}</Text>
                </View>
              </WingBlank>
            </Card.Body>
          );
          break;
      }
    })
    let block_recomend = <Card styles={CustomCardStyle2} full={true}>
      <Card.Header
        title="资讯推荐"
        thumbStyle={{ width: 43, height: 43 }}
        thumb={<Image source={img_title[1]} />}
        extra={<TouchableOpacity style={styles.all}><Text>{YSI18n.get('All')} ></Text></TouchableOpacity>}
      />
      {block_datalist_view}
    </Card>
    let block_buttonMore = <WingBlank><Button
      backgroundColor={YSColors.AppMainColor}
      size='large'
      text60
      borderRadius={9}
      style={{ width: '100%', height: 48 }}
      label={YSI18n.get('更多资讯')}
      onPress={() => this.onMore()} />
    </WingBlank>

    let whitespace = <WhiteSpace style={styles.whitespace} />

    return <View style={styles.container}>
      {block_navigator}
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >

        {block_carousel}

        {block_activity}
        {whitespace}
        {block_recomend}
        {/* {block_news}
        {block_news_2} */}
        {whitespace}
        {whitespace}
        {block_buttonMore}
        {whitespace}
        {whitespace}
      </ScrollView></View>
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: YSColors.default_bjcolor
  },
  block_carousel: {
    backgroundColor: YSColors.default_bjcolor,
    paddingVertical: 13
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
  text_author: {
    fontSize: YSFontSizes.content,
    color: YSColors.graytext,
  },
  spaceCarousel: {
    paddingVertical: 12,
    backgroundColor: YSColors.default_bjcolor,
    overflow: 'hidden',
  },
  carouse_img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,

  },
  block_navigator: {
    paddingTop: Constants.isIphoneX ? 29 : 0,
    height: Constants.isIphoneX ? 81 : 56,
    borderBottomWidth: 1,
    borderColor: Colors.dark70,
    backgroundColor: Colors.white
  },
  slideInnerContainer: {
    flexDirection: 'column',
    width: slideWidth,
    height: 163 * YSWHs.scale_rx,
    backgroundColor: 'transparent',

    flex: 1,

  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    paddingHorizontal: horizontalMargin,
  },
  dot_wrap: {
    position: 'absolute',
    bottom: 33,
    width: '100%',
    height: 3,
    left: 0,
  },
  activtyDotStyle: {
    width: 16,
    height: 3,
    marginHorizontal: 3,
    backgroundColor: Colors.white,
  },
  dotstyle: {
    width: 16,
    height: 3,
    marginHorizontal: 3,
    backgroundColor: Colors.white,
    opacity: 0.5,
  }
})

function select(store) {
  return {
    informationList: store.zixun.Zixun_InformationList.data_list,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    information_Home_list: bindActionCreators(information_Home_list, dispatch),
  };
}
module.exports = connect(select, mapDispatchToProps)(News);