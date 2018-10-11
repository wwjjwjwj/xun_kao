//5 其他签到

//
import React from 'react';
import { TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView, ListView,
  Keyboard
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
import { checkPermissionCamera, getGeolocation,
  encodeText
} from 'Util';
//4. action
import {
  GetExamClassStat,
  GetStudentByName,
  StudentPhotoSign
} from '../actions/exam';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class SignedByOther extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //data_list: [],
      is_search: false,
      search_data_list: [],

      valid_status: 0,  //验证是否本考点： 0 未验证； 2 通过； 3 失败（非考场范围）
      image: {},
      modal_show: false,
    };
    (this: any).getPlaceInfo = this.getPlaceInfo.bind(this);
    //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    (this: any).searchDataList = this.searchDataList.bind(this);
    (this: any).studentView = this.studentView.bind(this);
    (this: any).onTakePhoto = this.onTakePhoto.bind(this);
    (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
    (this: any).onReScan = this.onReScan.bind(this);
    (this: any).onUpload = this.onUpload.bind(this);
    (this: any).onReturn = this.onReturn.bind(this);
    (this: any).uploadData = this.uploadData.bind(this);
  }
  componentDidMount() {
    //this.getPlaceInfo();
  }

  getPlaceInfo(){
    let { Toast } = this;
    let { examId, stationId, placeId } = this.props.place_info;
    if(!examId || !stationId || !placeId){
      Toast.info('参数不够，无法取场次数据');
      return;
    }
    this.props.GetExamClassStat(examId, stationId, placeId)
      /*.then((response) => {
        if(response.State == 1){
          //alert(JSON.stringify(response));
          this.setState({
            data_list: response.ReData.dataList
          })
          //response.data
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })*/
  }

  onSearchChange(text){
    if(!text){
      this.setState({search_text: '', is_search: false});
      return;
    }
    //this.setState({search_text: text, is_search: true});
    //触发搜索
    this.searchDataList(text);
  }
  searchDataList(text){
    let { Toast } = this;
    let { examId, stationId, placeId } = this.props.place_info;
    var orderName = '';
    this.props.GetStudentByName(examId, stationId, placeId, orderName, text, 1, 999)
      .then((response) => {
        if(response.ReData.dataList.length){
          //alert(JSON.stringify(response));
        }
        var _list = [];
        if(response.State == 1 && response.ReData){
          response.ReData.dataList.map(stu => {
            var _oc = { stu_list: [] };
            var _stat_list = this.props.class_stat_list
            for(var i = 0; i < _stat_list.length; i++){
              var oc = _stat_list[i];
              if(stu.orderName == oc.orderName && stu.className == oc.className){
                _oc = oc;
                break;
              }
            }
            var exist = false;
            for(var i = 0; i < _list.length; i++){
              if(_list[i].orderName == _oc.orderName && _list[i].className == _oc.className){
                exist = true;
                _oc = _list[i];
                break;
              }
            }
            if(!exist){
              _list.push(_oc);
            }
            _oc.stu_list = _oc.stu_list || [];
            var stu_exist = false;
            for(var i = 0; i < _oc.stu_list.length; i++){
              if(_oc.stu_list[i].studentId == stu.studentId){
                stu_exist = true;
                break;
              }
            }
            if(!stu_exist){
              _oc.stu_list.push(stu);
            }
          });
          if(_list.length){
            //alert(JSON.stringify(_list));
          }
          this.setState({
            search_data_list: _list,
            search_text: text,
            is_search: true
          })
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }

  onReturn(){
    //this.props.navigation.goBack(this.props.navigation.state.params.keys.home_key);
    //this.props.navigation.popToTop();
    this.setState({
      valid_status: 0,
      image: {},
    });
    this.searchDataList(this.state.search_text);
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
              this.props.navigation.navigate('otherSignedDetail', {
                currentDataModel: item
              });
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
  //默认进入页面的 ListView 项
  renderRow(row, id) {
      var _signTime;
      var _examTime;
      if(row.beginInterval && row.endInterval){
        var index = row.beginInterval.indexOf(' ');
        _signTime = row.beginInterval.substr(0, index);
        _signTime += row.beginInterval.substr(index, 6);
        _signTime += '-';
        _signTime += row.endInterval.substr(index+1, 5);
      }
      if(row.beginTime && row.endTime){
        var index = row.beginTime.indexOf(' ');
        _examTime = row.beginTime.substr(0, index);
        _examTime += row.beginTime.substr(index, 6);
        _examTime += '-';
        _examTime += row.endTime.substr(index+1, 5);
      }
      return (
          <ListItem
              activeBackgroundColor={Colors.dark60}
              activeOpacity={0.3}
              height={120}
              onPress={(item) => this.onLookView('View', row)}
              animation="fadeIn"
              easing="ease-out-expo"
              duration={1000}
              useNativeDriver
              containerStyle={styles.list_wrap}
          >
              <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                  <ListItem.Part containerStyle={{ marginBottom: 0 }}>
                      <View row marginL-20>
                        <Text blue font_17 marginT-17 numberOfLines={1}>{row.orderName} {row.className}</Text>
                        <View right flex-1 paddingT-10 paddingR-10>
                          {row.state == 1 && row.importantCount &&
                            <View style={styles.sign_status} center>
                              {/*<Text font_12 orange style={styles.sign_status_text}>重点关注考生：{row.importantCount}人</Text>*/}
                              <Text font_12 orange style={styles.sign_status_text}>{row.importantCount}人</Text>
                            </View>
                          }
                        </View>
                      </View>
                  </ListItem.Part>
                  <ListItem.Part>
                    <View row marginT-23 marginL-22>
                      <Image source={Assets.signed.icon_time_signed}/>
                      <Text font_14 gray2>签到</Text>
                      <Text font_14 gray2 marginL-15>{_signTime}</Text>
                      <View right flex-1>
                        <Image source={Assets.signed.icon_next}/>
                      </View>
                    </View>

                  </ListItem.Part>
                  <ListItem.Part>
                    <View row flex-1 centerV marginT-2 marginL-22>
                      <Image source={Assets.signed.icon_user_num}/>
                      <Text font_14 gray2>签到人数</Text>
                      <Text font_14 blue marginL-15>{row.signCount}</Text>
                      <Text font_14 gray2>/{row.totalStudent}人</Text>
                    </View>
                  </ListItem.Part>
              </ListItem.Part>
          </ListItem>
      );
  }

  studentView(){
    var result = this.state.search_data_list.map(row => {
      var _signTime;
      if(row.beginInterval && row.endInterval){
        var index = row.beginInterval.indexOf(' ');
        _signTime = row.beginInterval.substr(0, index);
        _signTime += row.beginInterval.substr(index, 6);
        _signTime += '-';
        _signTime += row.endInterval.substr(index+1, 5);
      }
      var seg_stu = [];
      (row.stu_list || []).map(s => {
        seg_stu.push(
          <View column style={styles.list_stu}>
            <View row centerV paddingL-15 paddingR-15 style={[styles.list_item, styles.list_view_head]}>
              {s.state == 1 && <Image source={Assets.signed.icon_f} style={styles.list_icon}/>}
              {s.state == 3 && <Image source={Assets.signed.icon_un_sign} style={styles.list_icon}/>}
              {s.state == 0 && <Image source={Assets.signed.icon_pass} style={styles.list_icon}/>}
              {s.state == 2 && <Image source={Assets.signed.icon_repair} style={styles.list_icon}/>}
              <Text black font_17 marginL-30 numberOfLines={1}>{s.studentName}</Text>
              {s.important == 1 &&
                <View marginL-9 bg-yellow center style={styles.list_view_notice}>
                  <Text orange font_12>重点关注</Text>
                </View>
              }
              <View right flex-1>
                <Text font_14 gray2>座位号 {s.seatNumber}</Text>
              </View>
            </View>
            <View style={styles.list_line}/>
            <View row paddingL-15 paddingR-15 style={styles.list_view_body}>
              <View column centerV>
                <View row>
                  <Text font_14 gray2>证件号</Text>
                  <Text font_14 gray2 marginL-13>{s.cardNumber}</Text>
                </View>
                <View row marginT-17>
                  <Text font_14 gray2>学号</Text>
                  <Text font_14 gray2 marginL-13>{s.studentCode}</Text>
                </View>
                <View row marginT-17>
                  <Text font_14 gray2>专业</Text>
                  <Text font_14 gray2 marginL-13>{s.subject}</Text>
                </View>
                <View row marginT-17>
                  <Text font_14 gray2>课程</Text>
                  <Text font_14 gray2 marginL-13>{s.courseName}</Text>
                </View>
              </View>
              {s.replenishType == 1 && <View right flex-1 centerV>
                <TouchableOpacity onPress={()=>this.onTakePhoto(s)}>
                  <View bg-blue style={styles.list_view_touch}>
                    <Text font_13 white>拍照签到</Text>
                  </View>
                </TouchableOpacity>
              </View>}
            </View>
          </View>
        )
      })
      //row.stu_list
      return (
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.list_warp_exam}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>考试场次：{row.orderName} {row.className}</Text>
            </View>
            <View bg-white2 style={styles.line}/>
            <View centerV row marginT-16 paddingL-15>
              <Image source={Assets.signed.icon_user_num} style={styles.icon} />
              <Text font_14 gray2>签到人数</Text>
              <Text font_14 blue marginL-15>{row.signCount}</Text>
              <Text font_14 gray2 >/{row.totalStudent}人</Text>
            </View>
          </View>

          {seg_stu}

        </View>
      )
    });

    return result;
  }

  render(){
    let block_list_view;
    if(!this.state.is_search){
      block_list_view = <ListView
        dataSource={ds.cloneWithRows(this.props.class_stat_list)}
        renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
      />
    }else {
      block_list_view = this.studentView();
    }

    return (
      <View flex style={styles.container}>
        <View centerH bg-blue>
          <Text marginT-15 style={styles.modalTitle}>其他签到</Text>
          <View row>
            <YSInput ref="input_name"
                icon={Assets.signed.icon_search}
                //iconstyle={styles.iconstyle}
                placeholder={'请输入考生信息查询'}
                placeholderTextColor={"#999999"}
                style={styles.inputText}
                containerStyle={this.state.search_text ? styles.inputContainer2 : styles.inputContainer}
                onChangeText={(text) => this.onSearchChange(text)}
                value={this.state.search_text}
                enableClear={this.state.search_text ? true : false}
                clearStyle={styles.clearStyle}
                onClear={()=>this.onSearchChange('')}
            />
            {!!this.state.search_text && <TouchableOpacity onPress={()=> this.onSearchChange('')}>
              <Text font_14 white marginT-19>取消</Text>
            </TouchableOpacity>}
          </View>
        </View>
        {!this.state.is_search && this.state.valid_status == 0 &&  <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>{this.props.place_info.examName}</Text>
              <Text gray2 font_14_20 marginL-80 marginR-15>{`考试人数:${this.props.place_info.studentCount}`}</Text>
            </View>
            <View centerV row marginT-15 paddingL-15>
              <Image source={Assets.home.icon_branch_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.props.place_info.stationName}</Text>
            </View>
            <View centerV row marginT-10 paddingL-15>
              <Image source={Assets.home.icon_addr_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.props.place_info.placeAddress}</Text>
            </View>
          </View>
        </View>}

        {this.state.valid_status == 0 && <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {block_list_view}
        </ScrollView>
        }

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
  modalTitle: {
    fontSize: 19,
    color: YSColors.whiteBackground,
    android: {
      marginTop: 15
    },
    ios: {
      marginTop: 35
    }
  },
  inputText: {
    color: '#999999',
    fontSize: 14,
  },
  inputContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    ios: {
      height: 28,
      paddingTop: 7,
      paddingBottom: 7,
    },
    android: {
      height: 40
    },
    width: 345,
    backgroundColor: '#FFFFFF',

    borderRadius: 14,
    paddingLeft: 11,
  },
  inputContainer2: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    ios: {
      height: 28,
      paddingTop: 7,
      paddingBottom: 7,
    },
    android: {
      height: 40
    },
    width: 300,
    backgroundColor: '#FFFFFF',

    borderRadius: 14,
    paddingLeft: 11,
  },
  clearStyle: {
    width: 13,
    height: 13,
    resizeMode: 'cover',
    paddingRight: 19,
  },
  //------------考试场次部分
  list_wrap: {
    backgroundColor: YSColors.whiteBackground,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
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
    height: 140,
  },
  bottom_2: {
    width: YSWHs.width_window,
    height: 176,
  },
  bottom_1_top: {
    width: YSWHs.width_window,
    height: 50,
  },
  icon: {
    width: 25,
    height: 25
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

  list_warp_exam: {
    width: YSWHs.width_window,
    height: 95,
    marginBottom: 14,
  },
  line: {
    width: YSWHs.width_window,
    height: 1,
    backgroundColor: '#F1F1F1'
  },
  list_stu: {
    //marginTop: 14,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 14,
    width: 345,
    backgroundColor: '#FFFFFF',
    height: 185,
    borderRadius: 5
  },
  list_line: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F1F1'
  },
  list_view_head: {
    height: 50,
    width: '100%',
  },
  list_view_body: {
    height: 135,
    width: '100%'
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

  text_caption: {
    fontSize: 16
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
    var class_stat_list = [];
    if (store.exam && store.exam.place_info) {
        place_info = store.exam.place_info || {};
    }
    if(store.exam && store.exam.class_stat_list){
        class_stat_list = store.exam.class_stat_list
    }
    return {
        place_info,
        class_stat_list
    }
}
function mapDispatchToProps(dispatch) {
    return {
        GetExamClassStat: bindActionCreators(GetExamClassStat, dispatch),
        GetStudentByName: bindActionCreators(GetStudentByName, dispatch),
        StudentPhotoSign: bindActionCreators(StudentPhotoSign, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(SignedByOther);
