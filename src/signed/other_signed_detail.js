/**
 * 其他签到详情 显示学生列表
 * @providesModule OtherSignedDetail
 * @flow
 */

//
import React from 'react';
import { TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView, ListView,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Button, Assets, Image, ListItem
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker,
  WingBlank, Modal
} from 'antd-mobile-rn';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Dimensions from 'Dimensions';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
//2. 自定义方法
import { dismissKeyboard, initFormValid, getFormValid,
  getTextInputValidator, loadBizDictionary
} from 'ComponentExt';
//3. 自定义 插件
const StyleSheet = require('../common/YSStyleSheet');
import YSToast from 'YSToast';
import YSI18n from 'YSI18n';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
import { checkPermissionCamera, getGeolocation,
  encodeText
} from 'Util';
//4. action
import { GetStudentByOrder, StudentPhotoSign } from '../actions/exam';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

/*const DATA = [
  {
    userId: 1,
    name: '李勤',
    card: '1112224333333',
    stuNo: '2018000121',
    seat: '01',
    specialty: '工程管理',
    course: '建筑施工技术',
    need_notice: true,
    need_repair: true,
  },
  {
    userId: 3,
    name: '李勤2',
    card: '1112224333333',
    stuNo: '2018000121',
    seat: '02',
    specialty: '工程管理',
    course: '建筑施工技术',
    need_repair: false,
  },
  {
    userId: 3,
    name: '李勤3',
    card: '1112224333333',
    stuNo: '2018000121',
    seat: '03',
    specialty: '工程管理',
    course: '建筑施工技术',
    need_repair: false,
  },
  {
    userId: 4,
    name: '李勤4',
    card: '1112224333333',
    stuNo: '2018000121',
    seat: '04',
    specialty: '工程管理',
    course: '建筑施工技术',
    need_repair: false,
  },
];*/

class OtherSignedDetail extends React.Component {
  constructor(props){
    super(props);
    var params = props.navigation.state.params;
    this.state = {
      exam_info: params.currentDataModel,

      data_list: [],

      valid_status: 0,  //验证是否本考点： 0 未验证； 2 通过； 3 失败（非考场范围）
      image: {},
      modal_show: false,
    };
    (this: any).onTakePhoto = this.onTakePhoto.bind(this);
    (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
    (this: any).onReScan = this.onReScan.bind(this);
    (this: any).onUpload = this.onUpload.bind(this);
    (this: any).onReturn = this.onReturn.bind(this);
    (this: any).getDataList = this.getDataList.bind(this);
    (this: any).uploadData = this.uploadData.bind(this);
  }
  componentDidMount() {
    this.getDataList();
  }

  getDataList(){
    let { Toast } = this;
    //let { examId, stationId, placeId } = this.props.place_info;
    let { examId, stationId, placeId, orderName } = this.state.exam_info;
    this.props.GetStudentByOrder(examId, stationId, placeId, orderName, 1, 999)
      .then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1){
          this.setState({
            data_list: response.ReData.dataList
          })
          //response.data
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }

  onReturn(){
    //this.props.navigation.goBack(this.props.navigation.state.params.keys.home_key);
    this.props.navigation.popToTop();
  }
  onTakePhoto(row){
    //alert(JSON.stringify(row));
    var that = this;
    checkPermissionCamera(function(isPermit: boolean){
      if(isPermit){
        ImagePicker.openCamera({
          width: 640,
          height: 640 * YSWHs.height_window / YSWHs.width_window,
          cropping: true,
          mediaType:'photo',
          includeBase64: true,
          cropperChooseText: '选择',
          cropperCancelText: '取消'
        }).then(image => {
            //that.doUploadPhoto(image.data)
            image.photo = `data:${image.mime};base64,${image.data}`;
            that.onChoosePhoto(image, row);
        });
      }else {
        that.setState({
          showSettingBox: true
        })
      }
    })
  }
  onChoosePhoto(image, row){
    this.setState({
      image: image,
      studentId: row.studentId
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
  onUpload(){
    //上传拍照 返回 验证 结果
    this.onModalHide();
    var that = this;
    let { Toast } = this;
    if(this.state.studentId && this.state.image.photo){
      getGeolocation(function(res){
        //alert(JSON.stringify(res));
        if(res.result){
          var pos = res.y + ',' + res.x;
          that.uploadData(pos);
        }else {
          Toast.info('未获取到用户位置');
          return;
        }
      })
    }

  }
  uploadData(pos){
    var that = this;
    let { Toast } = this;
    var studentId = this.state.studentId;
    var photo = encodeText(this.state.image.photo);
    this.props.StudentPhotoSign(studentId, pos, photo)
      .then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1){
          setTimeout(function(){
            that.setState({
              valid_status: 2
            })
          }, 1000);
          //Toast.success('拍照补签成功！');
          //this.getDataList();
        }else{
          Toast.info(response.ReMsg);
          setTimeout(function(){
            /*that.setState({
              valid_status: 3 //非本人
            })*/
            that.setState({
              valid_status: 4 //非考场范围
            })
          }, 1000);
        }
      })
      .catch((response) => {
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }

  //浏览视图
  onLookView = (op, item) => {
      this.setState({
          editMode: op,//编辑模式
          currentDataModel: item,//编辑对象
      });
      switch (op) {
          case 'View':
              this.props.navigation.navigate('CourseDetail', { currentDataModel: item });
              break;
      }
  };
  //视图回调
  viewCallback = (dataModel) => {
      if (dataModel) {
          //如果需要更新，则刷新
          if (dataModel.is_changed) {
              this.getPlaceInfo();
          }
      }
      this.setState({ editMode: 'Manage' });
  }
  renderRow(row, id) {
      return (
          <ListItem
              activeBackgroundColor={Colors.dark60}
              activeOpacity={0.3}
              height={200}
              //onPress={(item) => this.onLookView('View', item)}
              animation="fadeIn"
              easing="ease-out-expo"
              duration={1000}
              useNativeDriver
              containerStyle={styles.list_wrap}
          >
              <ListItem.Part column>
                  <ListItem.Part containerStyle={[styles.list_item, styles.list_view_head]}>
                      <View row centerV>
                        {row.state == 1 && <Image source={Assets.signed.icon_f} style={styles.list_icon}/>}
                        {row.state == 3 && <Image source={Assets.signed.icon_un_sign} style={styles.list_icon}/>}
                        {row.state == 0 && <Image source={Assets.signed.icon_pass} style={styles.list_icon}/>}
                        {row.state == 2 && <Image source={Assets.signed.icon_repair} style={styles.list_icon}/>}
                        <Text black font_17 marginL-30 numberOfLines={1}>{row.studentName}</Text>
                        {row.important == 1 &&
                          <View marginL-9 bg-yellow center style={styles.list_view_notice}>
                            <Text orange font_12>重点关注</Text>
                          </View>
                        }
                        <View right flex-1>
                          <Text font_14 gray2>座位号 {row.seatNumber}</Text>
                        </View>
                      </View>
                  </ListItem.Part>
                  <ListItem.Part>
                    <View style={styles.list_line}/>
                  </ListItem.Part>
                  <ListItem.Part containerStyle={styles.list_item}>
                    <View column>
                      <View row marginT-17>
                        <Text font_14 gray2>证件号</Text>
                        <Text font_14 gray2 marginL-13>{row.cardNumber}</Text>
                      </View>
                      <View row marginT-17>
                        <Text font_14 gray2>学号</Text>
                        <Text font_14 gray2 marginL-13>{row.studentCode}</Text>
                      </View>
                      <View row marginT-17>
                        <Text font_14 gray2>专业</Text>
                        <Text font_14 gray2 marginL-13>{row.subject}</Text>
                      </View>
                      <View row marginT-17>
                        <Text font_14 gray2>课程</Text>
                        <Text font_14 gray2 marginL-13>{row.courseName}</Text>
                      </View>
                    </View>
                    {row.replenishType == 1 && <View right flex-1 centerV>
                      <TouchableOpacity onPress={()=>this.onTakePhoto(row)}>
                        <View bg-blue style={styles.list_view_touch}>
                          <Text font_13 white>拍照签到</Text>
                        </View>
                      </TouchableOpacity>
                    </View>}
                  </ListItem.Part>
              </ListItem.Part>
          </ListItem>
      );
  }

  render(){
    let block_list_view = <ListView
        dataSource={ds.cloneWithRows(this.state.data_list)}
        renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
    />

    var row = this.state.exam_info;

    return (
      <View flex style={styles.container}>
        {this.state.valid_status == 0 && <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
            <View row marginT-16 marginB-14>
              <Text font_18 black marginL-15>考试场次：{row.orderName}</Text>
            </View>
            <View bg-white2 style={styles.line}/>
            <View centerV row marginL-15 style={styles.bottom_2_top}>
              <Image source={Assets.signed.icon_user_num} style={styles.icon0} />
              <Text font_14 gray2>签到人数</Text>
              <Text font_14 blue marginL-15>{row.signCount}</Text>
              <Text font_14 gray2 >/{row.totalStudent}人</Text>
            </View>
          </View>
        </View>}

        {this.state.valid_status == 0 && this.state.data_list.length == 0 &&
          <View marginT-91 centerH column>
            <Image source={Assets.signed.img_no_result}/>
            <Text black3 font_14>暂无搜索结果</Text>
          </View>
        }
        {this.state.valid_status == 0 && this.state.data_list.length > 0 && block_list_view}

        {this.state.valid_status == 2 &&
          <View centerH marginT-56>
            <Image source={Assets.signed.icon_valid_pass} />
            <Text font_20 black marginT-22>提交通过</Text>
            <Text font_14 black3 marginT-15>考试地点验证成功</Text>
          </View>
        }

        {this.state.valid_status == 3 &&
          <View centerH marginT-56>
            <Image source={Assets.signed.icon_valid_fail2} />
            <Text font_20 black marginT-22>验证不通过</Text>
            <View centerH marginT-15 center row>
              <Image source={Assets.signed.icon_error_r} />
              <Text font_14 red marginL-6>拍照地点不在考试范围内，验证不通过！</Text>
            </View>
          </View>
        }
        {(this.state.valid_status == 2 || this.state.valid_status == 3) &&
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

        {this.state.image.data && this.state.valid_status == 0 &&
          <TouchableOpacity style={styles.full_image_touch} onPress={()=>{this.setState({modal_show:true})}}>
            <Image style={styles.full_image} source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}} />
          </TouchableOpacity>
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
              <Text font_16 black2>其他拍照说明</Text>
              <Text font_14 black2 marginT-23>1.请持有效证件和当场考试试卷进行补签拍照认证； </Text>
              <Text font_14 black2 marginT-23>2.请拍照时点击有效证件聚焦，保证有效证件信息及考试科目清晰可见，如上传的照片无法识别证件信息，则签到无效。</Text>
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
    backgroundColor: '#F1F1F1'
  },
  inputText: {
    color: '#999999',
    fontSize: 14,
  },
  inputContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10,
    width: 345,
    backgroundColor: '#F1F1F1',

    borderRadius: 14,
    paddingLeft: 11,
    ios: {
      height: 30,
      paddingTop: 7,
      paddingBottom: 7,
    },
    android: {
      height: 40
    },
  },
  inputContainer2: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    width: 300,
    backgroundColor: '#F1F1F1',

    borderRadius: 14,
    paddingLeft: 11,
    ios: {
      height: 30,
      paddingTop: 7,
      paddingBottom: 7,
    },
    android: {
      height: 40
    },
  },
  clearStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    android: {
      paddingRight: 9,
    },
    ios: {
      paddingRight: 9,
    }
  },
  //------------考试场次部分
  list_wrap: {
    backgroundColor: YSColors.whiteBackground,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    //paddingLeft: 15,
    //paddingTop: 12,
    //paddingRight: 15,
    //paddingBottom: 15,
  },
  list_item: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  list_view_head: {
    height: 50,
    width: '100%',
    //backgroundColor: '#332244'
  },
  list_line: {
    height: 1,
    width: '100%',
    backgroundColor:'#F1F1F1'
  },
  list_icon: {
    width: 25,
    height: 25,
  },
  list_view_notice: {
    borderRadius: 10,
    width: 70,
    height: 20,
  },
  list_view_touch: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 15,
  },

  sign_status: {
    borderRadius: 10,
    backgroundColor: '#FFF4D5',
  },
  sign_status_text: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 14,
    marginRight: 13
  },
  btn_sign: {
    borderRadius: 15,
    backgroundColor: '#4B9FFF',
    width: 75,
    height: 30
  },
  btn_sign_text: {
    fontSize: 13,
    color: YSColors.whiteBackground
  },
  //----------上部分
  bottom: {
    //position: 'absolute',
    //top: 257,
    //left: 0,
    //bottom: 0,
    width: YSWHs.width_window,
    //backgroundColor: YSColors.AppMainColor,
    backgroundColor: 'transparent',
  },
  bottom_1: {
    width: YSWHs.width_window,
    ios: {
      height: 95,
    },
    android: {
      height: 105,
    }
  },
  bottom_2: {
    width: YSWHs.width_window,
    height: 176,
  },
  bottom_2_top: {
    width: YSWHs.width_window,
    height: 50,
  },
  icon0: {
    width: 16,
    height: 16
  },
  bottom_2_left: {
    width: '50%',
    height: 176,
    marginLeft: 15
  },
  bottom_2_right: {
    width: '50%',
    height: 176,
    paddingRight: 15
  },
  bottom_2_right_item: {
    height: 25,
  },



  behind_bg: {
    //height: '75%'
  },
  front0: {
    position: 'absolute',
    backgroundColor: 'transparent',
    //backgroundColor: YSColors.AppMainColor,
    width: YSWHs.width_window,
    height: 257,
    top: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  front_user: {
    width: '85%',
    height: 120,
    //backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  front: {
    position: 'absolute',
    backgroundColor: YSColors.whiteBackground,
    width: 320,
    height: 156,
    top: 101,
    left: 28,
    right: 28,
    //borderWidth: 0.5,
    //borderColor: YSColors.login.border,
    //box-shadow:0 5 5 0 rgba(0,0,0,0.05);
    borderRadius: 5,
    elevation: 20,
    shadowOffset: {width: 0, height: 10},
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 5
  },
  logo_outside: {
    marginTop: -36,
  },
  logo: {
    width: 73,
    height: 73,
    resizeMode: 'contain',
  },
  text_caption: {
    fontSize: 16
  },





  btn: {
    width: 180,
    height: 44,
  },

  full_image_touch: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  full_image: {
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
    return {}
    /*var place_info = {};
    if (store.exam && store.exam.place_info) {
        place_info = store.exam.place_info || {};
    }
    return {
        place_info,
    }*/
}
function mapDispatchToProps(dispatch) {
    return {
        GetStudentByOrder: bindActionCreators(GetStudentByOrder, dispatch),
        StudentPhotoSign: bindActionCreators(StudentPhotoSign, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(OtherSignedDetail);
