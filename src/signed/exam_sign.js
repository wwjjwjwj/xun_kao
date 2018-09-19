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
  Button, Assets, Image, ListItem
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker, Modal
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
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
import { checkPermissionCamera, getGeolocation,
  encodeText,
} from 'Util';
//4. action
import { GetStudentByCard, CardSign } from '../actions/exam';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class ExamSign extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        exam_info: props.navigation.state.params.info,
        read_status: 0,   //读卡状态： 0 未开始； 1 读卡中； 2 读卡成功； 3 读卡失败
        check_status: 0,  //验证身份证是否本考场： 0 初始； 1 验证成功（需重点关注）  2 验证成功； 3 验证失败（非本考场）
        //need_follow: false,  //需要重点关注
        valid_status: 0,  //验证是否本人： 0 未验证； 2 通过； 3 失败（非本人）； 4 失败（非考场范围）

        blues: [],
        //cardInfo: {},
        cardInfo: {
          cardNo: '110224199007260023',
          name: '张三',
          avatar: "data:image/jpg;base64," + 'abc'
        },
        image: {}   //拍照图片
      };
      (this: any).onRead = this.onRead.bind(this);
      (this: any).onReturn = this.onReturn.bind(this);
      (this: any).initDevice = this.initDevice.bind(this);
      (this: any).onTestFind = this.onTestFind.bind(this);
      (this: any).onCheckUserInfo = this.onCheckUserInfo.bind(this);
      (this: any).onTakePhoto = this.onTakePhoto.bind(this);
      (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
      (this: any).onReScan = this.onReScan.bind(this);
      (this: any).onUpload = this.onUpload.bind(this);
      (this: any).onReValid = this.onReValid.bind(this);
      (this: any).onValidFail = this.onValidFail.bind(this);
      (this: any).onPostCardSign = this.onPostCardSign.bind(this);
  };
  componentWillMount() {
    this.initDevice();

//假设读卡成功2018
    this.setState({read_status: 2})  //读卡状态： 0 未开始； 1 读卡中； 2 读卡成功； 3 读卡失败
    this.onCheckUserInfo(this.state.cardInfo);
  }

  onCheckUserInfo(cardInfo){
    let { Toast } = this;
    if(!cardInfo || !cardInfo.cardNo){
      Toast.fail('未获取到学生身份证');
      return;
    }

    var that = this;
    let { examId, stationId, placeId } = this.props.place_info;
    this.props.GetStudentByCard(examId, stationId, placeId, this.state.exam_info.orderName, cardInfo.cardNo)
        .then((response) => {
          if(response.State == 1){
            if(!response.ReData){
              that.setState({
                check_status: 3,    //3 验证失败（非本考场）
              })
            }else {
              //alert(JSON.stringify(response.ReData));
              that.setState({
                check_status: response.ReData.important == 1 ? 1 : 2,    //验证成功
                student_id: response.ReData.studentId,
              })
            }
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
          this.onCheckUserInfo(c);
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
              this.onCheckUserInfo(c);
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
    checkPermissionCamera(function(isPermit: boolean){
      if(isPermit){
        ImagePicker.openCamera({
          width: 640,
          height: 640,
          cropping: true,
          mediaType:'photo',
          includeBase64: true,
          cropperChooseText: '选择',
          cropperCancelText: '取消'
        }).then(image => {
            //that.doUploadPhoto(image.data)
            image.photo = `data:${image.mime};base64,${image.data}`;
            that.onChoosePhoto(image);
        });
      }else {
        that.setState({
          showSettingBox: true
        })
      }
    })
  }
  onChoosePhoto(image){
    this.setState({
      image: image
    })
    this.onModalShow();
  }
  onModalShow(){
    this.setState({
      modal_show: true
    })
  }
  onModalHide(){
    this.setState({
      modal_show: false
    })
  }
  onReScan(){
    this.onModalHide();
    var that = this;
    setTimeout(function(){
      that.onTakePhoto();
    }, 500);
  }

  onPostCardSign(pos){
    //上传拍照 返回 验证 结果
    let { Toast } = this;
    if(!this.state.student_id){
      Toast.fail('未获取到学生Id');
      return;
    }
    var that = this;
    var s = {
      studentId: this.state.student_id,
      pos: pos,
      //cardPic: encodeText(this.state.cardInfo.avatar),
      cardPic: encodeText(this.state.image.photo),
      photo: encodeText(this.state.image.photo),
      //cardPic : encodeURI(this.state.image.photo),
      //photo: encodeURI(this.state.image.photo),
    }
    this.props.CardSign(s)
        .then((response) => {
          //alert(JSON.stringify(response));
          if(response.State == 1){
            setTimeout(function(){
              that.setState({
                valid_status: 2
              })
            }, 1000);
          }else{
            Toast.info(response.ReMsg);
            setTimeout(function(){
              that.setState({
                valid_status: 3 //非本人
              })
              if(1==2){
                that.setState({
                  valid_status: 4 //非考场范围
                })
              }
            }, 1000);
          }
        })
        .catch((response) => {
          Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
        })
  }

  onUpload(){
    this.onModalHide();
    //验证位置权限
    var that = this;
    let { Toast } = this;
    getGeolocation(function(res){
      //alert(JSON.stringify(res));
      if(res.result){
        var pos = res.y + ',' + res.x;
        that.onPostCardSign(pos);
      }else {
        Toast.info('未获取到用户位置');
        return;
      }
    })

return;


    this.onModalHide();
    var that = this;
    setTimeout(function(){
      //alert('上传');
      that.setState({
        valid_status: 4
      })
    }, 1000);

  }

  onReValid(){
    //再次验证
    this.onUpload();
  }
  onValidFail(){
    //确认不通过
    alert('不通过操作');
    this.onReturn();
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
          {this.state.read_status == 0 && this.state.check_status == 0 && <View flex-1 bg-blue3 center row style={styles.tip}>
              <Image source={Assets.signed.icon_error}/>
              <Text font_14 blue>请放身份证，点击开始读卡</Text>
            </View>
          }
          {this.state.read_status <= 1 && this.state.check_status == 0 &&
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
          {/*读身份证成功 但验证失败*/}
          {this.state.check_status == 3 &&
            <View centerH marginT-15 center row>
              <Image source={Assets.signed.icon_error_r} />
              <Text font_14 red marginL-6>非本场考生，信息有误</Text>
            </View>
          }
          {this.state.check_status == 1 &&
            <View centerH marginT-15 center row>
              <Image source={Assets.signed.icon_error_y} />
              <Text font_14 orange marginL-6>该考生需要重点关注</Text>
            </View>
          }
          {this.state.valid_status == 2 &&
            <View centerH marginT-56>
              <Image source={Assets.signed.icon_valid_pass} />
              <Text font_20 black marginT-22>验证通过</Text>
              <Text font_14 black3 marginT-15>考试拍照签到成功</Text>
            </View>
          }
          {this.state.valid_status == 2 &&
            <View centerH marginT-50 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'返回签到'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onReturn} />
            </View>
          }
          {this.state.valid_status == 3 &&
            <View centerH marginT-56>
              <Image source={Assets.signed.icon_valid_fail} />
              <Text font_20 black marginT-22>验证不通过</Text>
              <View centerH marginT-15 center row>
                <Image source={Assets.signed.icon_error_r} />
                <Text font_14 red marginL-6>非本人考试，验证不通过</Text>
              </View>
            </View>
          }
          {this.state.valid_status == 4 &&
            <View centerH marginT-56>
              <Image source={Assets.signed.icon_valid_fail2} />
              <Text font_20 black marginT-22>验证不通过</Text>
              <View centerH marginT-15 center row>
                <Image source={Assets.signed.icon_error_r} />
                <Text font_14 red marginL-6>拍照地点不在考试范围内，验证不通过！</Text>
              </View>
            </View>
          }
          {(this.state.valid_status == 3 || this.state.valid_status == 4) &&
            <View centerH marginT-50 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'再次验证'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onReValid} />
            </View>
          }
          {(this.state.valid_status == 3 || this.state.valid_status == 4) &&
            <View centerH marginT-50 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button_return}
                caption={'确认不通过'}
                text_style={styles.text_caption_return}
                disable={false}
                onPress={this.onValidFail} />
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
          {this.state.read_status == 2 &&
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
          {this.state.read_status <= 1 && this.state.check_status == 0 && <View centerH marginT-120 marginL-48 marginR-48 center>
              <YSButton
                type={'bordered'}
                style={this.state.read_status == 1 ? styles.border_button_ing : styles.border_button}
                caption={'开始读卡'}
                text_style={styles.text_caption}
                disable={this.state.read_status == 1 ? true : false}
                onPress={this.onRead} />
            </View>
          }
          {this.state.read_status <= 1 && this.state.check_status == 0 && <View centerH marginT-20 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'获取蓝牙列表'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onTestFind} />
          </View> }
          {this.state.read_status <= 1 && this.state.check_status == 0 && <View style={{width: '75%', marginLeft: 45, marginRight: 45}}>
            <ListView
              dataSource={dataSource}
              renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
            />
          </View> }

        </KeyboardAwareScrollView>

        {this.state.image.data && this.state.valid_status == 0 &&
            <Image style={styles.image} source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}} />
        }

        <Modal
          popup
          visible={this.state.modal_show}
          onClose={()=>this.onModalHide()}
          animationType="slide-up"
          maskClosable={true}
        >
          <View centerH style={styles.modal}>
            <Text font_18 black2 marginT-18>请确认照片是否符合要求</Text>
            <TouchableOpacity style={styles.close} onPress={()=>this.onModalHide()}>
              <Image source={Assets.home.icon_close} style={styles.icon} />
            </TouchableOpacity>
            <View marginT-17 style={styles.line}/>
            <View left marginT-15>
              <Text font_16 black2>拍照签到说明</Text>
              <Text font_14 black2>请拍照时点击有效证件聚焦，保证有效证件信息及考试科目清晰可见，如上传的照片无法识别证件信息，则签到无效。</Text>
            </View>
            <View marginT-21 style={styles.line2}/>
            <View>
              <YSButton
                type={'bordered'}
                style={styles.btn_upload}
                caption={'确认上传'}
                text_style={styles.btn_upload_text}
                disable={false}
                onPress={this.onUpload} />
            </View>
            <View style={styles.line3}/>
            <View>
              <YSButton
                type={'bordered'}
                style={styles.btn_upload}
                caption={'重新拍摄'}
                text_style={styles.btn_scan_text}
                disable={false}
                onPress={this.onReScan} />
            </View>

          </View>
        </Modal>
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
    fontSize: 18,
    color: '#FFFFFF'
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
  },

  image: {
    //flex: 1,
    //width: YSWHs.width,
    //height: YSWHs.height,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  modal: {
    width: YSWHs.width_window,
    //height: 292,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 15,
    paddingRight: 12,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  line: {
    width: YSWHs.width_window,
    height: 1,
    backgroundColor: '#F1F1F1'
  },
  line2: {
    width: YSWHs.width_window,
    height: 10,
    backgroundColor: '#F1F1F1'
  },
  line3: {
    width: YSWHs.width_window,
    height: 1,
    backgroundColor: '#D6D6D6'
  },
  btn_upload: {
    backgroundColor: '#FFFFFF',
  },
  btn_upload_text: {
    fontSize: 18,
    color: '#2E66E7'
  },
  btn_scan_text: {
    fontSize: 18,
    color: '#666666'
  },

})

function select(store) {
    var place_info = {};
    if (store.exam && store.exam.place_info) {
        place_info = store.exam.place_info || {};
    }
    return {
        place_info,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        GetStudentByCard: bindActionCreators(GetStudentByCard, dispatch),
        CardSign: bindActionCreators(CardSign, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(ExamSign);
