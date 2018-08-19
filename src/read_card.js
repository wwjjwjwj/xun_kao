'use strict';

//基本组件（所有页面都包括）
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import YSI18n from 'YSI18n';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';

//使用到的UI组件
import { StyleSheet, TouchableOpacity, ListView } from 'react-native';
import { Constants, Modal, View, Text, Typography, BorderRadiuses, Badge, RadioButton, RadioGroup, AvatarHelper, TextInput, Button, Colors, ThemeManager, Image, Assets, Spacings, ListItem } from 'react-native-ui-lib';
import { Toast } from 'antd-mobile-rn';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CardModule from 'react-native-card-read';

//业务处理
import { loginWithEmail } from './actions/user';
import { dismissKeyboard, initFormValid, getFormValid, getTextInputValidator, loadBizDictionary } from 'ComponentExt'

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class ReadCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account: props.account,
            password: '',

            blues: [],

            cardInfo: {}
        };
        //扩展方法用于本组件实例
        this.loadBizDictionary = loadBizDictionary.bind(this);
        this.initFormValid = initFormValid.bind(this);
        this.getFormValid = getFormValid.bind(this);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        (this: any).onTestFind = this.onTestFind.bind(this);
    };

    componentWillMount() {
        //表单验证初始化
        this.initFormValid(["account", "password"])

        var that = this;
        CardModule.init({
          a: '11',
          onReturn: (data, type) => {
            if(type < 0 || type == "-1"){
              alert(data);
              return;
            }

            if(type == "1" && data){
              //读取蓝牙列表
              var blues = [];
              var isAndroid = false;
              if(data.indexOf("H||C") >= 0){
                //android
                isAndroid = true;
              }
              if(isAndroid){
                var flag = "[未配对]";
                data.split("H||C").map(dd => {
                  dd.split("H,C").map(d => {
                    if(d){
                      var item = d.split("H-C");
                      if(item[1]){
                        blues.push({
                          name: item[0] + flag,
                          mac: item[1]
                        })
                      }
                    }
                  })
                  flag = "";
                })
              }else {
                data.split("H,C").map(d => {
                  if(d){
                    var item = d.split("H-C");
                    blues.push({
                      name: item[0],
                      mac: item[1]
                    })
                  }
                })
              }


              that.setState({
                blues: blues
              })
            }else if(type == "2"){
              //连接某一蓝牙设备成功
            }else if(type == "3"){
              //android 读取身份证信息
              var cardInfo = JSON.parse(data);
              var c = {
                name: cardInfo.name,
                cardNo: cardInfo.cardNo,
                avatar: "data:image/jpg;base64," + cardInfo.avatar
              }
              this.setState({
                cardInfo: c
              })
          }else if(type == "30"){
              //ios 读取身份证信息
              if(typeof data == 'string'){
                  //头像
                  var c = this.state.cardInfo;
                  c.avatar = "data:image/jpg;base64," + data;
                  this.setState({
                    cardInfo: c
                  })

              }else if(typeof data == 'object'){
                if(data.Name && data.CardNo){
                  var c = this.state.cardInfo;
                  c.name = data.Name;
                  c.cardNo = data.CardNo;
                  this.setState({
                    cardInfo: c
                  })
                }

              }

            }
          }

        });
    }

    onTestFind() {
      //CardModule.alert("hello");
      //CardModule.openSettings();
      CardModule.show_peripher_list({});
    }
    onTestConnect(item){
      CardModule.connect_peripher({
        mac: item.mac,
        name: item.name,
      })
    }
    onTestReadCard(){
      CardModule.read_card_info({
      })
    }

    renderRow(row, id) {
        return (
            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={60}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                useNativeDriver
                onPress={(item) => this.onTestConnect(row)}
            >
                <ListItem.Part middle column containerStyle={{}}>
                    <ListItem.Part containerStyle={{}}>
                        <View row flex-1 centerV>
                            <Text dark30 text60 marginR-10 numberOfLines={1}>{row.name}</Text>
                        </View>
                    </ListItem.Part>
                </ListItem.Part>

            </ListItem>

        );
    }

    render() {
        let dataSource = ds.cloneWithRows(this.state.blues);
        return (
            <View flex>
                <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
                    <View centerH paddingH-s7 paddingT-87 center>
                        <View marginB-60><Image source={Assets.LOGO.App_Logo} style={{ width: 120, height: 152, resizeMode: 'contain' }} /></View>
                        <View style={{ width: '100%', }}>
                            <Button
                                marginT-40
                                backgroundColor={YSColors.AppMainColor}
                                size='large'
                                text60
                                borderRadius={9}
                                style={{ width: '100%', height: 48 }}
                                label={YSI18n.get('获取蓝牙列表')}
                                onPress={this.onTestFind} />
                            <ListView
                              dataSource={dataSource}
                              renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
                            />
                            <Button
                                marginT-40
                                backgroundColor={YSColors.AppMainColor}
                                size='large'
                                text60
                                borderRadius={9}
                                style={{ width: '100%', height: 48 }}
                                label={YSI18n.get('读取身份证')}
                                onPress={this.onTestReadCard} />
                        </View>
                    </View>
                    <View row centerV padding-s5 bg-white>
                      <Image style={styles.img_user} source={{ uri: this.state.cardInfo.avatar }} />
                      <View row centerV flex-1>
                        <View flex-1>
                          <View row centerV marginB-s4>
                            <Text text60 dark10 marginR-s2>{this.state.cardInfo.name}</Text>
                          </View>
                          <Text text80 dark10>{this.state.cardInfo.cardNo}</Text>
                        </View>
                      </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
};

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
    width: 100,
    height: 200,
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

function select(store) {
    var account = "";
    return {
        account: account,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        loginWithEmail: bindActionCreators(loginWithEmail, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(ReadCard);
