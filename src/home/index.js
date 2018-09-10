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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, InputItem, Toast, List,
  WingBlank, Flex, WhiteSpace, TabBar
} from 'antd-mobile-rn';
import { Assets, Image
} from 'react-native-ui-lib';

import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';

import Home from './home';
import SignedByCard from './signed_by_card';
import ExamTakePhoto from './exam_take_photo';
import SignedStat from './signed_stat';
import SignedByOther from './signed_by_other';

import My from './my';
import _Modal from './modal';

import { getUserMenus } from '../actions/user';

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'home',
      //selectedTab: 'examTakePhoto',
      //selectedTab: 'signedStat',
      //selectedTab: 'signedByOther',
    };
  }
  componentDidMount() { }
  componentWillMount() { }
  renderContent(pageText: any) {
    let block_page = null;
    //避免非可见模式下被加载
    if (this.state.selectedTab != pageText) {
      return null;
    }
    switch (pageText) {
      case 'home':
        block_page = <Home navigation={this.props.navigation} />
        break;
      case 'signedByCard':
        block_page = <SignedByCard navigation={this.props.navigation} />
        break;
      case 'examTakePhoto':
        block_page = <ExamTakePhoto navigation={this.props.navigation} />
        break;
      case 'signedStat':
        block_page = <SignedStat navigation={this.props.navigation} />
        break;
      case 'signedByOther':
        block_page = <SignedByOther navigation={this.props.navigation} />
        break;

      case 'me':
        block_page = <My navigation={this.props.navigation} />
        break;
    }

    return (
      <View style={styles.container}>
        {block_page}
      </View>
    );
  }

  onChangeTab(tabName: any) {
    if (tabName === 'workbench') {
      //载入我的功能菜单（刷新）
      this.props.getUserMenus()
    }
    this.setState({
      selectedTab: tabName,
    });
  }

  render() {
    const barTintColor = YSColors.whiteBackground;
    const unselectedTintColor = YSColors.unselectedTintColor
    const tintColor = YSColors.AppMainColor

    let block_content = <TabBar
      //unselectedTintColor={unselectedTintColor}
      //tintColor={tintColor}
      //barTintColor={barTintColor}
    >
      <TabBar.Item
        icon={Assets.home.icon_home}
        selectedIcon={Assets.home.icon_home_focus}
        title={YSI18n.get('首页')}
        //badge={2}
        selected={this.state.selectedTab === 'home'}
        onPress={() => this.onChangeTab('home')}
      >
        {this.renderContent('home')}
      </TabBar.Item>
      <TabBar.Item
        icon={Assets.home.icon_signed_card}
        selectedIcon={Assets.home.icon_signed_card_focus}
        title={YSI18n.get('刷卡签到')}
        selected={this.state.selectedTab === 'signedByCard'}
        onPress={() => this.onChangeTab('signedByCard')}
      >
        {this.renderContent('signedByCard')}
      </TabBar.Item>
      <TabBar.Item
        title={YSI18n.get('考试拍照')}
        icon={Assets.home.icon_takephoto}
        selectedIcon={Assets.home.icon_takephoto_focus}
        selected={this.state.selectedTab === 'examTakePhoto'}
        onPress={() => this.onChangeTab('examTakePhoto')}
      >
        {this.renderContent('examTakePhoto')}
      </TabBar.Item>
      <TabBar.Item
        title={YSI18n.get('签到统计')}
        icon={Assets.home.icon_signed_query}
        selectedIcon={Assets.home.icon_signed_query_focus}
        selected={this.state.selectedTab === 'signedStat'}
        onPress={() => this.onChangeTab('signedStat')}
      >
        {this.renderContent('signedStat')}
      </TabBar.Item>
      <TabBar.Item
        title={YSI18n.get('其他签到')}
        icon={Assets.home.icon_signed_other}
        selectedIcon={Assets.home.icon_signed_other_focus}
        selected={this.state.selectedTab === 'signedByOther'}
        onPress={() => this.onChangeTab('signedByOther')}
      >
        {this.renderContent('signedByOther')}
      </TabBar.Item>

    </TabBar>

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
    backgroundColor: YSColors.home.bg,
  },
})


const mapStateToProps = (state) => {
  return {
    locale: state.user.locale || global.locale,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    //各业务接口
    //getUserMenus: bindActionCreators(getUserMenus, dispatch),
  };
}
//redux 组件 封装
module.exports = connect(mapStateToProps, mapDispatchToProps)(Index);
