'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import News from './news';
import Workbench from './workbench';
import My from './my';
import Menus from '../demo/menus';

const tab_me_normal = require('../../assets/tab_me_normal.png');
const tab_me_active = require('../../assets/tab_me_active.png');
const tab_news_normal = require('../../assets/tab_news_normal.png');
const tab_news_active = require('../../assets/tab_news_active.png');
const tab_workbench_normal = require('../../assets/tab_workbench_normal.png');
const tab_workbench_active = require('../../assets/tab_workbench_active.png');
const tab_class_normal = require('../../assets/tab_class_normal.png');
const tab_class_active = require('../../assets/tab_class_active.png');

import { getUserMenus } from '../actions/user';

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'news',
    };
  }

  componentWillMount() {
  }

  componentDidMount() {

  }
  renderContent(pageText: any) {
    let block_page = null;
    //避免非可见模式下被加载
    if (this.state.selectedTab != pageText) {
      return null;
    }
    switch (pageText) {
      case 'news':
        block_page = <News navigation={this.props.navigation} />
        break;
      case 'workbench':
        block_page = <Workbench navigation={this.props.navigation} />
        break;
      case 'me':
        block_page = <My navigation={this.props.navigation} />
        break;
      case 'class':
        block_page = <View navigation={this.props.navigation} />
        break;
      case 'demo':
        block_page = <Menus navigation={this.props.navigation} />
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
      unselectedTintColor={unselectedTintColor}
      tintColor={tintColor}
      barTintColor={barTintColor}
    >
      <TabBar.Item
        icon={tab_news_normal}
        selectedIcon={tab_news_active}
        title={YSI18n.get('news')}
        badge={2}
        selected={this.state.selectedTab === 'news'}
        onPress={() => this.onChangeTab('news')}
      >
        {this.renderContent('news')}
      </TabBar.Item>

      <TabBar.Item
        icon={tab_workbench_normal}
        selectedIcon={tab_workbench_active}
        title={YSI18n.get('workbench')}
        selected={this.state.selectedTab === 'workbench'}
        onPress={() => this.onChangeTab('workbench')}
      >
        {this.renderContent('workbench')}
      </TabBar.Item>
      <TabBar.Item
        title={YSI18n.get('课表')}
        icon={tab_class_normal}
        selectedIcon={tab_class_active}
        selected={this.state.selectedTab === 'class'}
        onPress={() => this.onChangeTab('class')}
      >
        {this.renderContent('class')}
      </TabBar.Item>
      <TabBar.Item
        title={YSI18n.get('my')}
        icon={tab_me_normal}
        selectedIcon={tab_me_active}
        selected={this.state.selectedTab === 'me'}
        onPress={() => this.onChangeTab('me')}
      >
        {this.renderContent('me')}
      </TabBar.Item>

      <TabBar.Item
        title="功能导航"
        icon={tab_me_normal}
        selectedIcon={tab_me_active}
        selected={this.state.selectedTab === 'demo'}
        onPress={() => this.onChangeTab('demo')}
      >
        {this.renderContent('demo')}
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
    backgroundColor: YSColors.whiteBackground,
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
    getUserMenus: bindActionCreators(getUserMenus, dispatch),
  };
}
//redux 组件 封装
module.exports = connect(mapStateToProps, mapDispatchToProps)(Index);