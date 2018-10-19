/**
 * 按类型显示学生列表
 * @providesModule StatDetailByType
 * @flow
 */

//
import React from 'react';
import { TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView, ListView
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
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSLoaderScreen from 'YSLoaderScreen';
import { checkPermissionCamera, getGeolocation,
  encodeText
} from 'Util';
import YSAppSettings from "YSAppSettings";
const StyleSheet = require('../common/YSStyleSheet');
//4. action
import { GetStudentByState, StudentPhotoSign,
  StudentPhotoSignAdd
} from '../actions/exam';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class StatDetailByType extends React.Component {
  static navigationOptions = ({ navigation }) => {
      return {
          title: navigation.state.params.title,
          gesturesEnabled: true,
          gestureResponseDistance: { horizontal: 20 },
          headerTitleStyle: { alignSelf: 'center', fontWeight: 'normal', color: YSColors.whiteBackground, fontSize: 19 },
          headerStyle: { borderBottomWidth: 0, borderColor: YSColors.splitlineColor, backgroundColor: '#4499FF' },
          /*headerRight: (
              <TouchableOpacity activeOpacity={1} onPress={() => {
                  navigation.state.params.onEdit()
              }}>
                  <Image source={Assets.icons.edit} />
              </TouchableOpacity>
          ),*/
      }
  }
  constructor(props){
    super(props);
    var params = props.navigation.state.params;
    this.state = {
      exam_info: params.exam_info,
      stat_info: params.stat_info,
      type: params.type,  //0: 通过 1: 未通过 2: 补签 3: 未到 4: 重点关注
      title: params.title,
      signType: params.signType,  //0 拍照签到跳来的； 1 直接从统计的未到的 跳来的。

      search_text: '',

      loading: false,
      all_data_list: [],
      data_list: [],

      image: {},
      modal_show: false,
    };
    (this: any).onTakePhoto = this.onTakePhoto.bind(this);
    (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
    (this: any).onReScan = this.onReScan.bind(this);
    (this: any).onUpload = this.onUpload.bind(this);
    (this: any).getDataList = this.getDataList.bind(this);
    (this: any).uploadData = this.uploadData.bind(this);
  }
  componentDidMount() {
    this.getDataList();

    this.getLocation();
  }

  getDataList(){
    let { Toast } = this;
    let { examId, stationId, placeId, orderName } = this.state.exam_info;
    var state = this.state.type;
    this.props.GetStudentByState(examId, stationId, placeId, orderName, state, 1, 999)
      .then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1 && response.ReData){
          this.setState({
            all_data_list: response.ReData.dataList,
            data_list: response.ReData.dataList
          })
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }

  getLocation(){
    var that = this;
    getGeolocation(function(res){
      //alert(JSON.stringify(res));
      if(res.result){
        var pos = res.y + ',' + res.x;
        that.setState({
          pos: pos
        })
      }else {
        that.setState({
          showSettingBox2: true
        })
      }
    })
  }

  onSearchChange(text){
    if(!this.state.all_data_list.length){
      return;
    }
    if(!text){
      this.setState({
        search_text: '',
        data_list: this.state.all_data_list
      });
      return;
    }
    var _list = this.state.all_data_list.filter(a => a.studentName.indexOf(text) >= 0);

    this.setState({
      search_text: text,
      data_list: _list
    });
  }
  onTakePhoto(row){
    //alert(JSON.stringify(row));
    var that = this;
    checkPermissionCamera(function(isPermit: boolean){
      if(isPermit){
        ImagePicker.openCamera({
          width: 640,
          height: 640 * YSWHs.height_window / YSWHs.width_window,
          //cropping: true,
          cropping: false,
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
      studentId: row.studentId,
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
    var that = this;
    let { Toast } = this;
    if(!this.state.studentId || !this.state.image.photo){
      this.onModalHide();
      Toast.info('参数不够，无法取场次数据');
      return;
    }
    if(!this.state.pos){
      //Toast.info('参数不够，无法取场次数据');
      this.getLocation();
      this.setState({
        showSettingBox2: true,
      })
      return;
    }

    this.onModalHide();
    this.setState({ loading: true });
    setTimeout(function(){
      that.uploadData();
    }, 100);
  }
  uploadData(){
    var that = this;
    let { Toast } = this;
    var studentId = this.state.studentId;
    var pos = this.state.pos;
    var photo = encodeText(this.state.image.photo);
    if(this.state.signType == 1){
      this.props.StudentPhotoSign(studentId, pos, photo)
      .then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1){
          /*setTimeout(function(){
            that.setState({
              valid_status: 2
            })
          }, 1000);*/
          that.setState({loading: false})
          Toast.success('拍照补签成功！');
          this.getDataList();
        }else{
          that.setState({ loading: false });
          Toast.info(response.ReMsg);
          /*setTimeout(function(){
            that.setState({
              valid_status: 3 //非本人
            })
            if(1==2){
              that.setState({
                valid_status: 4 //非考场范围
              })
            }
          }, 1000);*/
        }
      })
      .catch((response) => {
        that.setState({ loading: false });
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
    }else {
      this.props.StudentPhotoSignAdd(studentId, pos, photo)
      .then((response) => {
        if(response.State == 1){
          Toast.success('拍照补签成功！');
          this.getDataList();
        }else{
          Toast.info(response.ReMsg);
        }
      })
      .catch((response) => {
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
    }
  }

  openSettings() {
    SchoolearnModule.openSettings();
    this.setState({
      showSettingBox: false,
      showSettingBox2: false
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
    //this.state.type
    //0: 通过 1: 未通过 2: 补签 3: 未到 4: 重点关注
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
                        {this.state.type == 1 && <Image source={Assets.signed.icon_f} style={styles.list_icon}/>}
                        {this.state.type == 3 && <Image source={Assets.signed.icon_un_sign} style={styles.list_icon}/>}
                        {this.state.type == 0 && <Image source={Assets.signed.icon_pass} style={styles.list_icon}/>}
                        {this.state.type == 2 && <Image source={Assets.signed.icon_repair} style={styles.list_icon}/>}
                        <Text black font_17 marginL-30 numberOfLines={1}>{row.studentName}</Text>
                        {this.state.type == 4 &&
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
                    {row.replenishType == 1
                      && !this.props.is_zhu_kao
                      && <View right flex-1 centerV>
                        <TouchableOpacity onPress={()=>this.onTakePhoto(row)}>
                          <View bg-blue style={styles.list_view_touch}>
                            <Text font_13 white>拍照补签</Text>
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
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
            <View row>
              <YSInput ref="input_name"
                  icon={Assets.signed.icon_search}
                  placeholder={'请输入考生信息查询'}
                  placeholderTextColor={"#999999"}
                  style={styles.inputText}
                  containerStyle={!!this.state.search_text ? styles.inputContainer2 : styles.inputContainer}
                  onChangeText={(text) => this.onSearchChange(text)}
                  value={this.state.search_text}
                  enableClear={!!this.state.search_text ? true: false}
                  clearStyle={styles.clearStyle}
                  onClear={()=>this.onSearchChange('')}
              />
              {!!this.state.search_text && <TouchableOpacity onPress={()=> this.onSearchChange('')}>
                <Text font_14 blue marginT-19>取消</Text>
              </TouchableOpacity>}
            </View>
            <View bg-white2 style={styles.line}/>
            <View row marginT-16 marginB-14>
              <Text font_18 black marginL-15>考试场次：{row.orderName}</Text>
            </View>
            <View bg-white2 style={styles.line}/>
            <View centerV row marginL-15 style={styles.bottom_2_top}>
              <Image source={Assets.signed.icon_user_num} style={styles.icon0} />
              <Text font_14 gray2>签到人数</Text>
              <Text font_14 blue marginL-15>{row.signCount}</Text>
              <Text font_14 gray2 >/{row.totalStudent}人</Text>
              <View right marginL-36 row>
                <Image source={Assets.signed.icon_error_gray}/>
                <Text font_14 gray2 marginL-6>缺考率</Text>
                <Text font_14 blue marginL-15 marginR-36>{row.missRate}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/*this.state.data_list.length > 0 && block_list_view*/}
        {block_list_view}
        {this.state.data_list.length == 0 &&
          <View marginT-91 centerH column>
            <Image source={Assets.signed.img_no_result}/>
            <Text black3 font_14>暂无搜索结果</Text>
          </View>
        }

        {!!this.state.image.data && !!this.state.modal_show &&
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
              <Text font_16 black2>拍照补签说明</Text>
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

        {!!this.state.showSettingBox && <YSAppSettings hideDialog={() => this.setState({ showSettingBox: false })} type={1} callback={() => this.openSettings()} />}
        {!!this.state.showSettingBox2 && <YSAppSettings hideDialog={() => this.setState({ showSettingBox2: false })} type={2} callback={() => this.openSettings()} />}
        <YSLoaderScreen loading={this.state.loading} tips={'上传中...'}/>
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
    backgroundColor: '#F1F1F1',
    borderRadius: 14,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 11,
    width: 345,
    ios: {
      paddingTop: 7,
      paddingBottom: 7,
      height: 30,
    },
    android: {
      height: 38,
    },
  },
  inputContainer2: {
    backgroundColor: '#F1F1F1',
    borderRadius: 14,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    paddingLeft: 11,

    width: 300,
    ios: {
      paddingTop: 7,
      paddingBottom: 7,
      height: 28,
    },
    android: {
      height: 36,
    },
  },
  clearStyle: {
    resizeMode: 'contain',
    marginRight: 39,
    ios: {
      width: 13,
      height: 13,
    },
    android: {
    },
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
    //height: '100%',
    //backgroundColor: YSColors.AppMainColor,
    backgroundColor: 'transparent',
  },
  bottom_1: {
    width: YSWHs.width_window,
    ios: {
      height: 145,
    },
    android: {
      height: 155,
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

  image: {
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
    var is_zhu_kao = false;
    if (store.user && store.user.userInfo){
      is_zhu_kao = store.user.userInfo.RoleName == '主考老师';
      //is_zhu_kao = true;
    }
    return {
      is_zhu_kao
    }
}
function mapDispatchToProps(dispatch) {
    return {
        GetStudentByState: bindActionCreators(GetStudentByState, dispatch),
        StudentPhotoSign: bindActionCreators(StudentPhotoSign, dispatch),
        StudentPhotoSignAdd: bindActionCreators(StudentPhotoSignAdd, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(StatDetailByType);
