/**
 * 本场考场拍照
 * @providesModule PlaceTakePhoto
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
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
import { checkPermissionCamera } from 'Util';
//4. action
import { GetStudentByCard } from '../actions/exam';

import {getFinger} from '../env';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class PlaceTakePhoto extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        status: 0,  //步骤： 0 初始； 1 拍照完成； 2 上传成功； 3 验证不通过

        image: {}   //拍照图片
      };
      (this: any).onReturn = this.onReturn.bind(this);
      (this: any).onCheckUserInfo = this.onCheckUserInfo.bind(this);
      (this: any).onTakePhoto = this.onTakePhoto.bind(this);
      (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
      (this: any).onUpload = this.onUpload.bind(this);
      (this: any).onViewSign = this.onViewSign.bind(this);
  };
  componentWillMount() {
    this.onTakePhoto();
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
      image: image,
      status: 1,
    })
  }
  onUpload(){
    //上传拍照 返回 验证 结果
    var that = this;
    setTimeout(function(){
      //alert('上传');
      that.setState({
        //status: 2,
        status: 3
      })
    }, 1000);
  }

  onViewSign(){
    alert('查看本场签到');
  }

  render(){
    return (
      <View flex style={styles.container}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          {this.state.status == 1 &&
            <View flex-1 bg-yellow center row style={styles.tip}>
              <Text font_14 orange>请拍摄考场全景照片、试卷袋照片、缺考签到表上传</Text>
            </View>
          }
          {this.state.status == 1 &&
            <View centerH marginT-46>
              <Image source={Assets.home.icon_read_card} />

            </View>
          }
          {this.state.status == 1 &&
            <View centerH marginT-235 marginL-48 marginR-48>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'确认上传'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onUpload} />
            </View>
          }

          {this.state.status == 2 &&
            <View centerH marginT-56>
              <Image source={Assets.signed.icon_photo_valid_pass} />
              <Text font_20 black marginT-22>验证通过</Text>
              <Text font_14 black3 marginT-15>考试地点验证成功</Text>
            </View>
          }
          {this.state.status == 2 &&
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

          {this.state.status == 3 &&
            <View centerH marginT-56>
              <Image source={Assets.signed.icon_valid_fail2} />
              <Text font_20 black marginT-22>验证不通过</Text>
              <View centerH marginT-15 center row>
                <Image source={Assets.signed.icon_error_r} />
                <Text font_14 red marginL-6>拍照地点不在考试范围内，验证不通过！</Text>
              </View>
            </View>
          }
          {this.state.status == 3 &&
            <View centerH marginT-50 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'返回'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onReturn} />
            </View>
          }
          {(this.state.status == 2 || this.state.status == 3) &&
            <View centerH marginT-20 marginL-48 marginR-48 center>
             <YSButton
                type={'bordered'}
                style={styles.border_button_return}
                caption={'查看本场签到'}
                text_style={styles.text_caption_return}
                disable={false}
                onPress={this.onViewSign} />
            </View>
          }

        </KeyboardAwareScrollView>

        {this.state.image.data && this.state.valid_status == 0 &&
            <Image style={styles.image} source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}} />
        }

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
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
        GetStudentByCard: bindActionCreators(GetStudentByCard, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(PlaceTakePhoto);
