/**
 * 本场考试签到
 * @providesModule ExamSign
 * @flow
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
  ListView
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
import ImagePicker from 'react-native-image-crop-picker';
//2. 自定义方法
import { dismissKeyboard, initFormValid, getFormValid,
  getTextInputValidator, loadBizDictionary
} from 'ComponentExt';
//3. 自定义 插件
import YSToast from 'YSToast';
import YSI18n from 'YSI18n';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
//4. action
import { loginWithEmail } from '../actions/user';
import { getDeviceUuid } from '../actions/base';
import { GetStudentByCard } from '../actions/exam';

import {getFinger} from '../env';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class ExamSign extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        read_status: 0,   //0 未开始； 1 读卡中； 2 读卡成功； 3 读卡失败
        check_status: 2,  //0 初始；  2 验证成功； 3 验证失败
        need_follow: true,  //需要重点关注

        blues: [],
        cardInfo: {}
      };
      (this: any).onRead = this.onRead.bind(this);
      (this: any).onReturn = this.onReturn.bind(this);
      (this: any).initDevice = this.initDevice.bind(this);
      (this: any).onTestFind = this.onTestFind.bind(this);
      (this: any).onCheckUserInfo = this.onCheckUserInfo.bind(this);
      (this: any).onTakePhoto = this.onTakePhoto.bind(this);
  };
  componentWillMount() {
    this.initDevice();
  }

  onCheckUserInfo(cardInfo){
    let { Toast } = this;
    if(!cardInfo || !cardInfo.cardNo){
      Toast.fail('未获取到学生身份证');
      return;
    }
    var examId = 1;
    var stationId = 1;
    var placeId = 1;
    this.props.GetStudentByCard(examId, stationId, placeId, cardInfo.cardNo)
        .then((response) => {
          alert(JSON.stringify(response));
          if(response.State == 1){
            this.setState({
              check_status: 2,    //验证成功

            })
            //response.data
          }
        })
        .catch((response) => {
          Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
        })
  }

  initDevice(){
    var that = this;
    CardModule.init({
      a: '11',
      onReturn: (data, type) => {
        if(type < 0 || type == "-1"){
          alert(data);
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
          this.onCheckUserInfo(cardInfo);
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
              this.onCheckUserInfo(cardInfo);
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
  onRead(){
    let { Toast } = this;
    if(this.state.read_status == 0 || this.state.read_status == 3){
      this.setState({
        read_status: 1
      })

      CardModule.read_card_info({
      })

      /*var that = this;
      setTimeout(function(){
        that.setState({read_status: 3})
      }, 2000)*/
    }else {
      Toast.info('正在读卡中...');
    }

  }
  onReturn(){
    //this.props.navigation.goBack(this.props.navigation.state.params.keys.home_key);
    this.props.navigation.popToTop();
  }
  onTakePhoto(){
    var that = this;
    Util.checkPermissionCamera(function(isPermit: boolean){
      if(isPermit){
        ImagePicker.openCamera({
          width: 640,
          height: 640,
          cropping: true,
          mediaType:'photo',
          includeBase64: true,
        }).then(image => {
            that.doUploadPhoto(image.data)
        });
      }else {
        that.setState({
          showSettingBox: true
        })
      }
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

  render(){
    let dataSource = ds.cloneWithRows(this.state.blues);
    return (
      <View flex style={this.state.read_status <= 1 ? styles.container : styles.container_result}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          {this.state.read_status == 0 && <View flex-1 bg-blue3 center row style={styles.tip}>
              <Image source={Assets.signed.icon_error}/>
              <Text font_14 blue>请放身份证，点击开始读卡</Text>
            </View>
          }
          {this.state.read_status <= 1 &&
            <View centerH marginT-46>
              <Image source={Assets.home.icon_read_card} />
              <Text font_16 black2 marginT-50>请将身份证置于读卡器上</Text>
              { this.state.read_status == 1 && <View marginT-39 style={styles.load_progress} row>
                <View style={styles.load_progress_left} />
                <View style={styles.load_progress_right} />
              </View>}
              { this.state.read_status == 1 && <Text font_12 white3 marginT-10>读卡中……</Text> }
            </View>
          }
          {this.state.read_status == 2 &&
            <View centerH marginT-26 marginL-28 marginR-28 bg-white style={styles.result}>
              <Text font_18 blue marginT-18>考生身份证信息</Text>
              <Image source={{uri: this.state.cardInfo.avatar}} style={styles.photo}/>
              <Text font_14 gray2 marginT-15>姓名</Text>
              <Text font_20 black marginT-10>{this.state.cardInfo.name}</Text>
              <Text font_14 gray2 marginT-31>证件号码</Text>
              <Text font_20 black marginT-10>{this.state.cardInfo.cardNo}</Text>
            </View>
          }
          //读身份证成功 但验证失败
          {this.state.check_status == 3 &&
            <View centerH marginT-15 center row>
              <Image source={Assets.signed.icon_error_r} />
              <Text font_14 red marginL-6>非本场考生，信息有误</Text>
            </View>
          }
          {this.state.check_status == 2 && this.state.need_follow &&
            <View centerH marginT-15 center row>
              <Image source={Assets.signed.icon_error_y} />
              <Text font_14 red marginL-6>该考生需要重点关注</Text>
            </View>
          }
          {this.state.read_status == 2 && this.state.check_status == 3 &&
            <View centerH marginT-65 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'读卡有误 返回签到'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onReturn} />
            </View>
          }
          {this.state.read_status == 2 && this.state.check_status == 2 &&
            <View centerH marginT-65 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'拍照验证'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onTakePhoto} />
            </View>
          }
          {this.state.read_status <= 1 && <View centerH marginT-120 marginL-48 marginR-48 center>
              <YSButton
                type={'bordered'}
                style={this.state.read_status == 1 ? styles.border_button_ing : styles.border_button}
                caption={'开始读卡'}
                text_style={styles.text_caption}
                disable={this.state.read_status == 1 ? true : false}
                onPress={this.onRead} />
            </View>
          }
          <View centerH marginT-20 marginL-48 marginR-48 center>
            {this.state.read_status <= 1 && <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'获取蓝牙列表'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onTestFind} /> }

          </View>
          {this.state.read_status <= 1 && <View style={{width: '75%', marginLeft: 45, marginRight: 45}}>
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
  tip: {
    width: '100%',
    height: 60,
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
    height: 320
  },
  photo: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#C5C5C5',
    marginTop: 33
  }

})

function select(store) {
    var account = "";
    if (store.user && store.user.login_name) {
        account = store.user.login_name
    }
    return {
        account: account,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        loginWithEmail: bindActionCreators(loginWithEmail, dispatch),
        getDeviceUuid: bindActionCreators(getDeviceUuid, dispatch),
        GetStudentByCard: bindActionCreators(GetStudentByCard, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(ExamSign);
