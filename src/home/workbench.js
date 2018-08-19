'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSI18n from 'YSI18n';
import YSFontSizes from 'YSFontSizes';
import { Grid } from 'antd-mobile-rn';
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';

import { getMenuIcon } from '../appFunMenu'

class Workbench extends React.Component {

  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    let block_header = <View bg-blue30 row center style={{ height: 64 }}><Text white text60>{YSI18n.get("workbench")}</Text></View>

    //顶部固定功能
    const dataBars = [
      getMenuIcon({ key: 'WorkLog' }),
      getMenuIcon({ key: 'FileCollection' }),
      getMenuIcon({ key: 'Memo' }),
      getMenuIcon({ key: 'Notice' }),
    ]
    let block_topbar = <View bg-blue30 marginB-10>
      <Grid data={dataBars} columnNum={4} hasLine={false}
        onClick={(el: Object, index: number) => {
          let menuInfoIcon = getMenuIcon(el);
          //路由到功能入口
          this.props.navigation.navigate(menuInfoIcon.routeName);
        }}
        renderItem={menuInfo => (
          <View flex center >
            <Image source={menuInfo.icon} style={styles.img_topbar} />
            <Text white text80>{YSI18n.get(menuInfo.name)}</Text>
          </View>
        )}
      />
    </View>

    //app上能看到的功能菜单
    let appMenus = this.props.AllMenus.filter(a => a.visible);
    //其它功能组
    let otherFunctions = [
      getMenuIcon({ key: 'FileSystem_List' }),//默认文件资料对所有人开放
    ];

    let powerMenus = appMenus.map((mainMenu) => {
      mainMenu.child = mainMenu.child || [];
      //如果下部有other属性
      let findOtherMenus = mainMenu.child.filter(a => a.other && a.visible);
      otherFunctions = [...otherFunctions, ...findOtherMenus];//合并
      let childMenus = mainMenu.child.filter(a => !a.other && a.visible);//本组排除其它功能
      if (childMenus.length > 0) {
        //获取主菜单对应的icon
        let mainMenuIcon = getMenuIcon(mainMenu);
        return <View flex-1 bg-white marginB-10 style={styles.block_boxwrap}>
          <View row centerV style={{ height: 52 }} >
            <Image source={mainMenuIcon.icon} marginR-10 />
            <Text dark10 text80>{YSI18n.get(mainMenu.name)}</Text>
          </View>
          <View paddingH-7>
            <Grid data={childMenus} columnNum={3} hasLine={false}
              onClick={(el: Object, index: number) => {
                let menuInfoIcon = getMenuIcon(el);
                //路由到功能入口
                this.props.navigation.navigate(menuInfoIcon.routeName);
              }}
              renderItem={(menuInfo, index) => {
                //获取功能菜单对应的icon
                let menuInfoIcon = getMenuIcon(menuInfo);
                return (
                  <View center marginH-6 style={[styles.itemView, { backgroundColor: menuInfoIcon.bgcolor }]}  >
                    <Image source={menuInfoIcon.icon} style={styles.imgIco} />
                    <Text white text80>{YSI18n.get(menuInfo.name)}</Text>
                  </View>
                )
              }}
            >
            </Grid >
          </View>
        </View>
      }
      else {
        return null;
      }
    });

    let otherMainMenuInfoIcon = getMenuIcon({ key: 'Others' });
    let block_function_others =
      <View flex-1 bg-white style={styles.block_boxwrap} >
        <View row centerV style={{ height: 52 }} >
          <Image source={otherMainMenuInfoIcon.icon} marginR-10 />
          <Text dark10 text80>{YSI18n.get(otherMainMenuInfoIcon.name)}</Text>
        </View>
        <View paddingH-7>
          <Grid data={otherFunctions} columnNum={3} hasLine={false}
            onClick={(el: Object, index: number) => {
              let menuInfoIcon = getMenuIcon(el);
              //路由到功能入口
              this.props.navigation.navigate(menuInfoIcon.routeName);
            }}
            renderItem={(menuInfo, index) => {
              //获取功能菜单对应的icon
              let menuInfoIcon = getMenuIcon(menuInfo);
              return (
                <View center marginH-6 style={[styles.itemView, { backgroundColor: menuInfoIcon.bgcolor }]}  >
                  <Image source={menuInfoIcon.icon} style={styles.imgIco} />
                  <Text white text80>{YSI18n.get(menuInfo.name)}</Text>
                </View>
              )
            }}
          >
          </Grid >
        </View>
      </View >


    return <View style={styles.container}>
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {block_header}
        {block_topbar}
        {/* 主功能区域，根据功能权限获得，排除其中设置为"其它"区域的 */}
        {powerMenus}
        {/* 其它功能区域 */}
        {block_function_others}
      </ScrollView>
    </View>
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: YSColors.default_bjcolor
  },
  img_topbar: {
    marginBottom: 8
  },
  block_boxwrap: {
    height: 130,
    borderBottomWidth: 1,
    borderColor: Colors.dark70
  },
  itemView: {
    paddingTop: 8,
    height: 66,
    borderRadius: 4
  },
  imgIco: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }


})


const mapStateToProps = (state) => {
  let { items } = state.menu;
  //alert(JSON.stringify(items))
  return { AllMenus: items };
};

function mapDispatchToProps(dispatch) {
  return {
  };
}
//redux 组件 封装
module.exports = connect(mapStateToProps, mapDispatchToProps)(Workbench);
