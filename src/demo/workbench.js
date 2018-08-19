/**
 * Created by Administrator on 4/14/2017.
 * @providesModule Workbench
 * @flow
 * 工作台
 */

'use strict';

import React, { Component } from 'react';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSI18n from 'YSI18n';
import YSFontSizes from 'YSFontSizes';
import { Grid } from 'antd-mobile-rn';
import { Card, View, Text, Stepper, Typography, BorderRadiuses, Modal, Picker, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings } from 'react-native-ui-lib';



const dataBars = [
  {
    icon: Assets.workbench.ico1,
    text: YSI18n.get('工作日志'),

  },
  {
    icon: Assets.workbench.ico2,
    text: YSI18n.get('文件收藏'),

  },
  {
    icon: Assets.workbench.ico3,
    text: YSI18n.get('备忘录'),

  },
  {
    icon: Assets.workbench.ico4,
    text: YSI18n.get('通知消息'),

  },

]

const dataPart1 = [
  {
    icon: Assets.workbench.ico5,
    text: YSI18n.get('部门管理'),
    bgcolor: '#19BFA4'

  },
  {
    icon: Assets.workbench.ico6,
    text: YSI18n.get('员工管理'),
    bgcolor: '#29C5D2'

  },
  {
    icon: Assets.workbench.ico7,
    text: YSI18n.get('角色管理'),
    bgcolor: '#2CB5F6'
  },
]

const dataPart2 = [
  {
    icon: Assets.workbench.ico8,
    text: YSI18n.get('课程管理'),
    bgcolor: '#FA5A55'

  },
  {
    icon: Assets.workbench.ico9,
    text: YSI18n.get('盟校管理'),
    bgcolor: '#FF7748'

  },
  {
    icon: Assets.workbench.ico10,
    text: YSI18n.get('课程授权管理'),
    bgcolor: '#19BFA4'
  },
]
const dataPart3 = [
  {
    icon: Assets.workbench.ico11,
    text: YSI18n.get('文件资料'),
    bgcolor: '#19BFA4'

  },
  {
    icon: Assets.workbench.ico4,
    text: YSI18n.get('通知消息管理'),
    bgcolor: '#2CB5F6'
  },

]
class Workbench extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedTab: 'Workbench',
    };

  }
  
  onChangeTab(tabName: any) {
    this.setState({
      selectedTab: tabName,
    });
  }


  render() {

    let block_header = <View bg-blue30 row center style={{ height: 64 }}><Text white text60>{YSI18n.get("工作台")}</Text></View>
    let block_topbar = <View bg-blue30 marginB-10>
      <Grid data={dataBars} columnNum={4} hasLine={false}
        onClick={(el: Object, index: number) => {
          Alert.alert('点击的是' + index)
        }}
        renderItem={dataItem => (
          <View flex center >
            <Image source={dataItem.icon} style={styles.img_topbar} />
            <Text white text80>{dataItem.text}</Text>
          </View>
        )}
      />
    </View>

    let block_part1 =
      <View flex-1 bg-white marginB-10 style={styles.block_boxwrap} >
        <View row centerV style={{ height: 52 }} >
          <Image source={Assets.workbench.ico12} marginR-10 />
          <Text dark10 text80>{YSI18n.get("组织架构管理")}</Text>
        </View>
        <View paddingH-7>
          <Grid data={dataPart1} columnNum={3} hasLine={false}
            onClick={(el: Object, index: number) => {
              Alert.alert('点击的是' + index)
            }}
            renderItem={(dataItem, index) => {
              return (
                <View center marginH-6 style={[styles.itemView, { backgroundColor: dataItem.bgcolor }]}  >
                  <Image source={dataItem.icon} style={styles.imgIco}/>
                  <Text white text80>{dataItem.text}</Text>
                </View>
              )
            }}
          >
          </Grid >
        </View>
      </View >

    let block_part2 =
      <View flex-1 bg-white marginB-10 style={styles.block_boxwrap} >
        <View row centerV style={{ height: 52 }} >
          <Image source={Assets.workbench.ico14} marginR-10 />
          <Text dark10 text80>{YSI18n.get("盟校体系管理")}</Text>
        </View>
        <View paddingH-7>
          <Grid data={dataPart2} columnNum={3} hasLine={false}
            onClick={(el: Object, index: number) => {
              Alert.alert('点击的是' + index)
            }}
            renderItem={(dataItem, index) => {
              return (
                <View center marginH-6 style={[styles.itemView, { backgroundColor: dataItem.bgcolor }]}  >
                  <Image source={dataItem.icon} style={styles.imgIco}/>
                  <Text white text80>{dataItem.text}</Text>
                </View>
              )
            }}
          >
          </Grid >
        </View>
      </View >

    let block_part3 =
      <View flex-1 bg-white style={styles.block_boxwrap} >
        <View row centerV style={{ height: 52 }} >
          <Image source={Assets.workbench.ico13} marginR-10 />
          <Text dark10 text80>{YSI18n.get("其他")}</Text>
        </View>
        <View paddingH-7>
          <Grid data={dataPart3} columnNum={3} hasLine={false}
            onClick={(el: Object, index: number) => {
              Alert.alert('点击的是' + index)
            }}
            renderItem={(dataItem, index) => {
              return (
                <View center  marginH-6 style={[styles.itemView, { backgroundColor: dataItem.bgcolor }]}  >
                  <Image source={dataItem.icon} style={styles.imgIco}/>
                  <Text white text80>{dataItem.text}</Text>
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
        {block_part1}
        {block_part2}
        {block_part3}
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
    paddingTop:8,
    height: 66,
    borderRadius:4
  },
   imgIco:{
     width:40,
     height:40,
     resizeMode:'contain'
   } 
  

})


module.exports = (Workbench);
