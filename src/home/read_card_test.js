/**
 * 读卡测试
 * @providesModule ReadCardTest
 * @flow
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
  ListView, Platform
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Modal, Button, Assets, Image, ListItem
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker
} from 'antd-mobile-rn';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Dimensions from 'Dimensions';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import CardModule from 'react-native-card-read';
//2. 自定义方法
import { dismissKeyboard, initFormValid, getFormValid,
  getTextInputValidator, loadBizDictionary
} from 'ComponentExt';
//3. 自定义 插件
import YSToast from 'YSToast';
import YSI18n from 'YSI18n';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSButton from 'YSButton';
//4. action
import { checkPermissionReadPhoneState } from '../actions/base';

import {getFinger} from '../env';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class ReadCardTest extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        read_status: 0,   //0 未开始； 1 读卡中； 2 读卡成功； 3 读卡失败

        blues: [],
        cardInfo: {},
        type: props.navigation.state.params.type,
      };
      (this: any).onTest = this.onTest.bind(this);
      (this: any).onReturn = this.onReturn.bind(this);
      (this: any).initDevice = this.initDevice.bind(this);
      (this: any).onTestFind = this.onTestFind.bind(this);
  };
  componentWillMount() {
    this.initDevice();
    this.props.checkPermissionReadPhoneState();
  }

  initDevice(){
    var that = this;
    CardModule.init({
      a: '11',
      onReturn: (data, type) => {
        let { Toast } = that;
        if(type < 0 || type == "-1"){
          //alert(data);
          alert('读卡失败：' + data);
          //Toast.info(data);
          that.setState({
            read_status: 3
          })
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
            cardInfo: c,
            read_status: 2, //读卡成功
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
              c.name = data.Name ? data.Name.trim() : data.Name;
              c.cardNo = data.CardNo;
              this.setState({
                cardInfo: c,
                read_status: 2, //成功
              })
            }

          }

        }
      }

    });

  }

  onTestFind() {
    CardModule.show_peripher_list({});
  }
  onTestConnect(item){
    CardModule.connect_peripher({
      mac: item.mac,
      name: item.name,
    })
  }
  onTest(){
    let { Toast } = this;
    if(this.state.read_status == 0 || this.state.read_status == 3){
      this.setState({
        read_status: 1
      })

      var that = this;
      setTimeout(function(){
        if(that.state.type == 'blueteeth'){
          CardModule.read_card_info({})
        }else if(that.state.type == 'otg'){
          if(Platform.OS === 'android'){
            CardModule.read_card_info_otg({});
          }else {
            Toast.info('iphone不支持otg连接');
            return;
          }
        }

        //that.setState({read_status: 3})
      }, 500);
      var that = this;
      setTimeout(function(){
        if(that.state.read_status == 1){
          that.setState({read_status: 0})
        }
      }, 10000);
    }else {
      Toast.info('正在读卡中...');
    }

  }
  onReturn(){
    //this.props.navigation.goBack(this.props.navigation.state.params.keys.home_key);
    this.props.navigation.popToTop();
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

  render(){
    let dataSource = ds.cloneWithRows(this.state.blues);
    return (
      <View flex style={this.state.read_status <= 1 ? styles.container : styles.container_result}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          {this.state.read_status <= 1 &&
            <View centerH marginT-56 center>
              <Image source={Assets.home.icon_read_card} />
              <Text font_16 black2 marginT-50>请将身份证置于读卡器上进行读卡测试</Text>
              { this.state.read_status == 0 && <View marginT-39 style={styles.load_progress}/>}
              { this.state.read_status == 0 && <Text font_12 gray2 marginT-10>等待读卡中……</Text> }
              { this.state.read_status == 1 && <View marginT-39 style={styles.load_progress} row>
                <View style={styles.load_progress_left} />
                <View style={styles.load_progress_right} />
              </View>}
              { this.state.read_status == 1 && <Text font_12 white3 marginT-10>读卡中……</Text> }
            </View>
          }
          {this.state.read_status == 3 &&
            <View centerH marginT-56 center>
              <Image source={Assets.home.icon_read_card_fail} />
              <Text font_20 black marginT-22>读取失败</Text>
              <Text font_14 black2 marginT-15>请重新连接读卡器后重试测试</Text>
            </View>
          }
          {this.state.read_status == 2 &&
            <View center marginT-26 marginL-28 marginR-28 bg-white style={styles.result}>
              <Text font_18 blue>身份证信息</Text>
              <Image source={{uri: this.state.cardInfo.avatar}} style={styles.photo}/>
              <Text font_14 gray2 marginT-15>姓名</Text>
              <Text font_20 black marginT-10>{this.state.cardInfo.name}</Text>
              <Text font_14 gray2 marginT-21>证件号码</Text>
              <Text font_20 black marginT-10>{this.state.cardInfo.cardNo}</Text>
            </View>
          }
          <View centerH marginT-120 marginL-48 marginR-48 center>
            {this.state.read_status == 2 ? <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'测试完成 返回首页'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onReturn} />
                :
            <YSButton
                type={'bordered'}
                style={this.state.read_status == 1 ? styles.border_button_ing : styles.border_button}
                caption={this.state.read_status == 3 ? '再次测试' : '开始测试'}
                text_style={styles.text_caption}
                disable={this.state.read_status == 1 ? true : false}
                onPress={this.onTest} />
            }
          </View>
          <View centerH marginT-20 marginL-48 marginR-48 center>
            {this.state.read_status == 3 && <YSButton
                type={'bordered'}
                style={styles.border_button_return}
                caption={'返回首页'}
                text_style={styles.text_caption_return}
                disable={false}
                onPress={this.onReturn} /> }
            {this.state.type == 'blueteeth' && this.state.read_status <= 1 && <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'获取蓝牙列表'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onTestFind} />}
          </View>
          {this.state.type == 'blueteeth' && this.state.read_status <= 1 && <View style={{width: '75%', borderWidth: 1, borderColor: '#2E66E7', marginLeft: 45, marginRight: 45}}>
            <ListView
              dataSource={dataSource}
              renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
            />
          </View> }


        </KeyboardAwareScrollView>
        <YSToast ref={(toast) => this.Toast = toast} />
      </View>
    )
  }

};


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: YSColors.whiteBackground
  },
  container_result: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F1F1F1'
  },
  text_caption: {
    fontSize: 18
  },
  text_caption_return: {
    fontSize: 18,
    color: '#2E66E7'
  },
  border_button: {
    borderRadius: 99,
    backgroundColor: '#2E66E7',
  },
  border_button_ing: {
    borderRadius: 99,
    backgroundColor: '#4B9FFF',
  },
  border_button_return: {
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E66E7'
  },
  load_progress: {
    height: 10,
    width: 240,
    backgroundColor: '#E7E7E7',
    borderRadius: 5,
    //borderWidth: 1,
    //borderColor: '#FF0000'
  },
  load_progress_left: {
    height: 10,
    width: 200,
    backgroundColor: '#4B9FFF',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  load_progress_right: {
    height: 10,
    width: 40,
    backgroundColor: '#E7E7E7',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },

  result: {
    width: 320,
    height: 320,
    borderRadius: 5,
  },
  photo: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#C5C5C5',
    marginTop: 23
  }

})

function select(store) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
        checkPermissionReadPhoneState: bindActionCreators(checkPermissionReadPhoneState, dispatch)
    };
}
module.exports = connect(select, mapDispatchToProps)(ReadCardTest);
