/**
 * 按类型显示学生列表
 * @providesModule StatDetailByType
 * @flow
 */

//
import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
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
import { GetPlace } from '../actions/exam';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

const DATA = [
  {
    userId: 1,
    name: '李勤',
    card: '1112224333333',
    stuNo: '2018000121',
    seat: '01',
    specialty: '工程管理',
    course: '建筑施工技术',
    type: 1,
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
    type: 2,
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
    type: 3,
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
    type: 4,
    need_repair: false,
  },
];

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
      currentDataModel: params.currentDataModel,
      type: params.type,
      title: params.title,

      all_data_list: DATA,
      data_list: DATA,

      image: {},
      modal_show: false,
    };
    (this: any).getPlaceInfo = this.getPlaceInfo.bind(this);
    (this: any).onTakePhoto = this.onTakePhoto.bind(this);
    (this: any).onChoosePhoto = this.onChoosePhoto.bind(this);
    (this: any).onReScan = this.onReScan.bind(this);
    (this: any).onUpload = this.onUpload.bind(this);
  }
  componentDidMount() {
    this.getPlaceInfo();
  }

  getPlaceInfo(){
    let { Toast } = this;
    this.props.GetPlace()
      .then((response) => {
        alert(JSON.stringify(response));
        if(response.State == 1){
          this.setState({

          })
          //response.data
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        //Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
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
    //触发搜索
    var _list = this.state.all_data_list.filter(a => a.name.indexOf(text) >= 0);

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
  onUpload(){
    //上传拍照 返回 验证 结果
    this.onModalHide();
    var that = this;
    setTimeout(function(){
      //alert('上传');
      that.setState({
        valid_status: 4
      })
    }, 1000);

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
                        {row.type == 1 && <Image source={Assets.signed.icon_f} style={styles.list_icon}/>}
                        {row.type == 2 && <Image source={Assets.signed.icon_un_sign} style={styles.list_icon}/>}
                        {row.type == 3 && <Image source={Assets.signed.icon_pass} style={styles.list_icon}/>}
                        {row.type == 4 && <Image source={Assets.signed.icon_repair} style={styles.list_icon}/>}
                        <Text black font_17 marginL-30 numberOfLines={1}>{row.name}</Text>
                        {row.need_notice &&
                          <View marginL-9 bg-yellow center style={styles.list_view_notice}>
                            <Text orange font_12>重点关注</Text>
                          </View>
                        }
                        <View right flex-1>
                          <Text font_14 gray2>座位号 {row.seat}</Text>
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
                        <Text font_14 gray2 marginL-13>{row.card}</Text>
                      </View>
                      <View row marginT-17>
                        <Text font_14 gray2>学号</Text>
                        <Text font_14 gray2 marginL-13>{row.stuNo}</Text>
                      </View>
                      <View row marginT-17>
                        <Text font_14 gray2>专业</Text>
                        <Text font_14 gray2 marginL-13>{row.specialty}</Text>
                      </View>
                      <View row marginT-17>
                        <Text font_14 gray2>课程</Text>
                        <Text font_14 gray2 marginL-13>{row.course}</Text>
                      </View>
                    </View>
                    {row.need_repair && <View right flex-1 centerV>
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

    var row = this.state.currentDataModel;

    return (
      <View flex style={styles.container}>
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
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
              {this.state.search_text && <TouchableOpacity onPress={()=> this.onSearchChange('')}>
                <Text font_14 blue marginT-19>取消</Text>
              </TouchableOpacity>}
            </View>
            <View bg-white2 style={styles.line}/>
            <View row marginT-16 marginB-14>
              <Text font_18 black marginL-15>考试场次：{row.examName}</Text>
            </View>
            <View bg-white2 style={styles.line}/>
            <View centerV row marginL-15 style={styles.bottom_2_top}>
              <Image source={Assets.signed.icon_user_num} style={styles.icon0} />
              <Text font_14 gray2>签到人数</Text>
              <Text font_14 blue marginL-15>{row.numStu}</Text>
              <Text font_14 gray2 >/{row.numTotal}人</Text>
              <View right marginL-36 row>
                <Image source={Assets.signed.icon_error_gray}/>
                <Text font_14 gray2 marginL-6>缺考率</Text>
                <Text font_14 blue marginL-15 marginR-36>{row.percent}%</Text>
              </View>
            </View>
          </View>
        </View>

        {this.state.data_list.length > 0 && block_list_view}
        {this.state.data_list.length == 0 &&
          <View marginT-91 centerH column>
            <Image source={Assets.signed.img_no_result}/>
            <Text black3 font_14>暂无搜索结果</Text>
          </View>
        }

        {this.state.image.data && this.state.modal_show &&
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
    height: 30,
    width: 345,
    backgroundColor: '#F1F1F1',

    borderRadius: 14,
    paddingLeft: 11,
    paddingTop: 7,
    paddingBottom: 7,
  },
  inputContainer2: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    height: 28,
    width: 300,
    backgroundColor: '#F1F1F1',

    borderRadius: 14,
    paddingLeft: 11,
    paddingTop: 7,
    paddingBottom: 7,
  },
  clearStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 69,
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
    height: 145,
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
        GetPlace: bindActionCreators(GetPlace, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(StatDetailByType);
