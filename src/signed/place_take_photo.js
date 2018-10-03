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
import SchoolearnModule from 'react-native-schoolearn';
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
import YSAppSettings from "YSAppSettings";
//4. action
import { PhotoUpload, GetOrderStatistics } from '../actions/exam';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class PlaceTakePhoto extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        exam_info: props.navigation.state.params.info,
        status: 0,  //步骤： 0 初始； 1 拍照完成； 2 上传成功； 3 验证不通过

        image_list: [],
        //image: {}   //拍照图片
      };
      (this: any).onReturn = this.onReturn.bind(this);
      (this: any).onTakePhoto = this.onTakePhoto.bind(this);
      (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
      (this: any).onUpload = this.onUpload.bind(this);
      (this: any).onViewSign = this.onViewSign.bind(this);
      (this: any).onUploadData = this.onUploadData.bind(this);
  };
  componentWillMount() {
    var that = this;
    setTimeout(function(){
      that.onTakePhoto();
    }, 1000);

    this.getLocation();

  }

  getLocation(){
    var that = this;
    getGeolocation(function(res){
      //alert(JSON.stringify(res));
      var pos = res.y + ',' + res.x;
      that.setState({
        pos: pos
      })
    })
  }

  onReturn(){
    //this.props.navigation.goBack(this.props.navigation.state.params.keys.home_key);
    this.props.navigation.popToTop();
  }
  onTakePhoto(){
    let { Toast } = this;
    if(this.state.image_list.length >= 5){
      Toast.info('最多上传5张照片');
      return;
    }
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
            var photo = `data:${image.mime};base64,${image.data}`;
            that.onChoosePhoto(photo);
        });
      }else {
        that.setState({
          showSettingBox: true
        })
        //Toast.info("请您在设置中，允许我们使用您手机的摄像头.");
      }
    })
  }
  onChoosePhoto(photo){
    var _list = this.state.image_list;
    _list.push(photo);
    this.setState({
      image_list: _list,
      status: 1,
    })
  }
  onUploadData(){
    let { Toast } = this;
    let { examId, stationId, placeId } = this.props.place_info;
    if(!examId || !stationId || !placeId){
      Toast.info('参数不够，无法取场次数据');
      return;
    }
    if(!this.state.pos){
      //Toast.info('参数不够，无法取场次数据');
      this.getLocation();
      this.setState({
        showSettingBox2: true
      })
      return;
    }
    var orderName = this.state.exam_info.orderName;
    var pos = this.state.pos;
    var situation = 0;
    var memo ='';
    var files = [];
    this.state.image_list.map(i => {
      files.push(encodeText(i));
    })
    //var files = files.join(',');
    //className, pos, files
    this.props.PhotoUpload(examId, stationId, placeId, orderName, pos, situation, memo, files)
        .then((response) => {
          //alert(JSON.stringify(response));
          if(response.State == 1){
            this.setState({
              status: 2
            })
          }
        })
        .catch((response) => {
          //alert(JSON.stringify(response));
          Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
        })
  }
  onUpload(){
    //上传拍照 返回 验证 结果
    if(this.state.image_list.length){
      this.onUploadData()
    }
    /*var that = this;
    setTimeout(function(){
      //alert('上传');
      that.setState({
        //status: 2,
        status: 3
      })
    }, 1000);*/
  }

  onViewSign(){
    //alert('查看本场签到');
    //this.props.navigation.navigate('oneExamSignedStat', { currentDataModel: this.state.exam_info });
    return;
    let { examId, stationId, placeId, orderName } = this.state.exam_info;
    if(!examId || !stationId || !placeId){
      Toast.info('参数不够，无法取场次数据');
      return;
    }
    this.props.GetOrderStatistics(examId, stationId, placeId, orderName, '')
      .then((response) => {
        alert('场次统计信息：' + JSON.stringify(response));
        if(response.State == 1){
          alert(JSON.stringify(response.ReData))
          return;

          //this.props.navigation.navigate('oneExamSignedStat', { currentDataModel: , signType: 0 });
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }
  openSettings() {
    SchoolearnModule.openSettings();
    this.setState({
      showSettingBox: false,
      showSettingBox2: false
    })
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
          {/*this.state.status == 1 &&
            <View centerH marginT-46>
              <Image source={Assets.home.icon_read_card} />

            </View>
          */}
          {this.state.image_list.length > 0 && this.state.status == 1 &&
            <View style={styles.image_view}>
              {this.state.image_list.map(image => {
                  if(image){
                    return <Image style={styles.image_photo} source={{uri: image}} />
                  }

                })
              }
              <TouchableOpacity style={styles.image_bg} onPress={()=>this.onTakePhoto()}>
                <Image style={styles.image_add} source={Assets.signed.img_add}/>
              </TouchableOpacity>
            </View>
          }

          {this.state.status == 1 &&
            <View centerH marginT-115 marginL-48 marginR-48>
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

        {/*this.state.image.data && this.state.valid_status == 0 &&
            <Image style={styles.image} source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}} />
        */}
        {!!this.state.showSettingBox && <YSAppSettings hideDialog={() => this.setState({ showSettingBox: false })} type={1} callback={() => this.openSettings()} />}
        {!!this.state.showSettingBox2 && <YSAppSettings hideDialog={() => this.setState({ showSettingBox2: false })} type={2} callback={() => this.openSettings()} />}

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

  image_view: {
    width: '100%',
    height: 225,
    marginTop: 31,
    paddingLeft: 16,
    paddingRight: 2,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',

  },
  image_photo: {
    width: 105,
    height: 105,
    resizeMode: 'cover',
    marginTop: 15,
    marginRight: 14,
  },
  image_add: {
    width: 32,
    height: 32,
  },
  image_bg: {
    marginTop: 15,
    width: 105,
    height: 105,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center'
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
        PhotoUpload: bindActionCreators(PhotoUpload, dispatch),
        GetOrderStatistics: bindActionCreators(GetOrderStatistics, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(PlaceTakePhoto);
