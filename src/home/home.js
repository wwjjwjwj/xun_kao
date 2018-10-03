//首页


import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView, Platform, WebView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Button, Assets, Image
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker,
  Modal, WingBlank, Carousel
} from 'antd-mobile-rn';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Dimensions from 'Dimensions';
import { StackNavigator } from 'react-navigation';
import _ from 'lodash';
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
//4. action
import { logout, HideExamNotice } from '../actions/user';
import { getDeviceUuid } from '../actions/base';
import { GetPlace, GetExamNotice, GetExamTask
} from '../actions/exam';

import {getFinger} from '../env';

const TASK = [
  '监考任务一：开考后30分钟，巡考任务内容滚动显示',
  '监考任务二：开考后10分钟，巡考任务内容滚动显示'
];

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //connect_show: false,

      //exam_notice_show: true,
      exam_notice_show: false,
      notice_text: '<h1>Hello world</h1>',

      //task_list: TASK,
      task_list: [],

      //university: '吉林大学',
      //name: '李老师',
      //mobile: '13511112222',
      batch: '201809考试批次',
      exam_num: 2500,
      branch: '重庆学习中心',
      branch_addr: '重庆市沙坪坝区沙坪坝正街174号',
      exam_place: '重庆学习中心',
      exam_addr: '重庆大学A区8号教学楼',
      exam_contact: '李斯',
    };
    (this: any).onShowConnectModal = this.onShowConnectModal.bind(this);
    (this: any).onCloseConnectModal = this.onCloseConnectModal.bind(this);
    (this: any).goto_otg = this.goto_otg.bind(this);
    (this: any).goto_blueteeth = this.goto_blueteeth.bind(this);
    (this: any).onTask = this.onTask.bind(this);
    (this: any).gotoLogout = this.gotoLogout.bind(this);
    (this: any).onGetPlaceData = this.onGetPlaceData.bind(this);
    (this: any).onGetExamNoticeData = this.onGetExamNoticeData.bind(this);
    (this: any).onGetExamTaskData = this.onGetExamTaskData.bind(this);
  }
  componentDidMount() {
    this.onGetPlaceData();
    this.onGetExamTaskData();

//alert(this.props.saw_notice);
    if(!this.props.saw_notice){
      this.onGetExamNoticeData();
    }
  }

  onShowConnectModal(e){
    //e.preventDefault();
    this.setState({
      connect_show: true
    })
  }
  onCloseConnectModal(){
    this.setState({
      connect_show: false
    })
  }
  onCloseExamNoticeModal(){
    this.props.HideExamNotice();
    this.setState({
      exam_notice_show: false
    })
  }

  goto_otg(){
    if(Platform.OS === 'android'){
      this.onCloseConnectModal();
      //this.props.navigation.navigate('otgTest', {keys: { home_key: this.props.navigation.state.key }});
      this.props.navigation.navigate('otgTest');
    }else {
      let { Toast } = this;
      Toast.info('iphone不支持otg连接');
      return;
    }
  }
  goto_blueteeth(){
    this.onCloseConnectModal();
    //this.props.navigation.navigate('blueteethTest', {keys: { home_key: this.props.navigation.state.key }});
    this.props.navigation.navigate('blueteethTest');
  }
  onTask(){
    this.props.navigation.navigate('taskList');
  }
  gotoLogout(){
    let { Toast } = this;
    this.props.logout()
        .then((response) => {

        })
        .catch((response) => {
          Toast.fail(response.message || YSI18n.get('loginFailed'));
        })
  }
  onGetPlaceData(){
    let { Toast } = this;
    this.props.GetPlace();
      /*.then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1 && response.ReData){
          this.setState({
            info: response.ReData,
          })
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('获取考点数据失败'));
      })*/
  }
  onGetExamNoticeData(){
    let { Toast } = this;
    var that = this;
    if(!this.props.info.examId){
      return;
    }
    this.props.GetExamNotice(this.props.info.examId)
      .then((response) => {
        //alert(JSON.stringify(response))
        if(response.State == 1 && response.ReData){
          setTimeout(function(){
            that.setState({
              notice_text: response.ReData,
              exam_notice_show: true
            })
          }, 3000); //如果不显示，那时间就再久一点
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('获取通知数据失败'));
      })
  }
  onGetExamTaskData(){
    let { Toast } = this;
    var that = this;
    if(!this.props.info.examId){
      return;
    }
    this.props.GetExamTask(this.props.info.examId)
      .then((response) => {
        //alert(JSON.stringify(response))
        if(response.State == 1 && response.ReData){
            that.setState({
              task_list: response.ReData,
            })
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('获取任务数据失败'));
      })
  }

  render(){

    return (
      <View flex style={styles.container}>
        <Image style={styles.behind_bg} source={Assets.home.img_bg}/>
        <View style={styles.front0}>
          <Text marginT-35 white text_title2>E考官</Text>
          <Text marginT-11 blue2 label_input>欢迎来到考场巡检系统！</Text>
          <View marginL-28 marginR-28 style={styles.front_user0}>
            <View marginT-52 marginB-5 bg-white style={styles.front_user}>
              <TouchableOpacity style={styles.touch_exit} onPress={()=>this.gotoLogout()}>
                <Image source={Assets.home.icon_exit} style={styles.img_exit}/>
              </TouchableOpacity>
              <Text center marginT-51 blue font_16>{this.props.school_name}</Text>
              <Text center marginT-12 marginB-22 black2 font_16>{this.props.name} {this.props.account}</Text>
            </View>
            <View centerH center style={styles.logo_outside}>
              <Image source={Assets.home.img_avatar_jk} style={styles.logo_jk} resizeMode='contain'/>
            </View>
          </View>
        </View>

        <View centerH marginT-20 style={styles.bottom}>
          <YSButton type={'bordered'}
            style={styles.btn}
            caption={"点击连接读卡器"}
            text_style={styles.text_caption}
            onPress={this.onShowConnectModal}/>
          {this.state.task_list.length > 0 && <View marginT-21 centerV row style={styles.lantern_view}>
              <TouchableOpacity onPress={()=>this.onTask()}>
              <Image source={Assets.home.icon_task} style={styles.lantern_img}/>
              <Carousel
                style={styles.lantern_wapper}
                selectedIndex={0}
                autoplay
                infinite
                dots={false}
                //afterChange={this.onHorizontalSelectedIndexChange}
              >
                {this.state.task_list.map(t => {
                  return <Text marginL-11 blue font_14 style={styles.lantern_text}>{this.state.task_list[0]}</Text>
                })}
              </Carousel>
              </TouchableOpacity>
          </View>
          }
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          <View marginT-19 bg-white style={styles.bottom_1}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>{this.props.info.examName}</Text>
              <Text gray2 label_input marginL-80 marginR-15>{`考试人数:${this.props.info.studentCount}`}</Text>
            </View>
            <View centerV row marginT-15 paddingL-15>
              <Image source={Assets.home.icon_branch_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.props.info.stationName}</Text>
            </View>
            <View centerV row marginT-10 paddingL-15>
              <Image source={Assets.home.icon_addr_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.props.info.placeAddress}</Text>
            </View>
          </View>
          <View row center marginT-10 bg-white style={styles.bottom_2}>
            <View style={styles.bottom_2_left}>
              <View centerV row marginT-15>
                <Image source={Assets.home.icon_branch} style={styles.icon} />
                <Text marginL-11 gray2 label_input>考点</Text>
              </View>
              <View centerV row marginT-10>
                <Image source={Assets.home.icon_addr} style={styles.icon} />
                <Text marginL-11 gray2 label_input>考点地址</Text>
              </View>
              <View centerV row marginT-10>
                <Image source={Assets.home.icon_contact} style={styles.icon} />
                <Text marginL-11 gray2 label_input>考点联系人</Text>
              </View>
            </View>
            <View right style={styles.bottom_2_right}>
              <View centerV marginT-15 style={styles.bottom_2_right_item}>
                <Text black label_input>{this.props.info.placeName}</Text>
              </View>
              <View centerV marginT-10 style={styles.bottom_2_right_item}>
                <Text black label_input>{this.props.info.placeAddress}</Text>
              </View>
              <View centerV marginT-10 style={styles.bottom_2_right_item}>
                <Text black label_input>{this.props.info.contact}</Text>
              </View>
            </View>
          </View>
          </KeyboardAwareScrollView>
        </View>


        <Modal
          popup
          visible={this.state.connect_show}
          onClose={()=>this.onCloseConnectModal()}
          animationType="slide-up"
          maskClosable={true}
        >
          <View centerH style={styles.modal}>
            <Text font_18 black2 marginT-17>请选择设备连接方式</Text>
            <TouchableOpacity style={styles.close} onPress={()=>this.onCloseConnectModal()}>
              <Image source={Assets.home.icon_close} style={styles.icon} />
            </TouchableOpacity>
            <View marginT-17 style={styles.line}/>
            <View left row marginT-15>
              <TouchableOpacity onPress={this.goto_otg}>
                <Image source={Assets.home.img_otg} style={styles.img}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.goto_blueteeth}>
                <Image source={Assets.home.img_blueteeth} style={styles.img}/>
              </TouchableOpacity>
            </View>
            <View left style={styles.intro_title}>
              <Text marginT-25 black2 font_16>读卡器操作说明</Text>
              <Text marginT-19 black2 label_input>开关机:</Text>
              <Text gray2 label_input>长按开关机键2秒，开机。长按2秒，关机。开机后工作灯绿灯闪烁，蓝牙灯闪烁，等待配对连接。</Text>
              <Text marginT-19 black2 label_input>有线连接:</Text>
              <Text gray2 label_input>使用数据线与手机连接。</Text>
              <Text marginT-19 black2 label_input>蓝牙连接:</Text>
              <Text gray2 label_input>使开机后，设备蓝牙开启搜索，蓝牙指示灯闪烁，打开手机蓝牙连接设备，蓝牙指示灯每次闪烁两下表示蓝牙处于已连接状态。</Text>
            </View>
          </View>
        </Modal>
        <Modal
          popup
          visible={this.state.exam_notice_show}
          //visible={false}
          onClose={()=>this.onCloseExamNoticeModal()}
          animationType="slide-up"
          maskClosable={true}
        >
          <View centerH style={styles.modal}>
            <Text font_18 black2 marginT-17>监考须知</Text>
            <TouchableOpacity style={styles.close} onPress={()=>this.onCloseExamNoticeModal()}>
              <Image source={Assets.home.icon_close} style={styles.icon} />
            </TouchableOpacity>
            <View marginT-13 style={styles.line}/>
            <View left marginT-15>
              <Text font_18 black2>本批次监考须知</Text>
              {/*<Text font_14 black2 marginT-10>
                1、监考人员必须充分重视监考工作，具有高度的责任感。监考安排一旦确定，监考人员必须按时履行监考职责，不得迟到、早退、缺席，不得擅自调换监考人员。 2、所有监考人员须携带监考证参加监考。监考过程中不得使用手机，不得擅自离岗，不得在考场中交谈等，一经发现，按相应教学事故处理。 3、监考当日，监考人员应提前15-20分钟到岗，作好考试各项准备工作： （1）按照规定引导学生隔列就坐或按指定位置就坐，前后对齐，不得由考生随意找、占座位； （2）要求考生将学生证（或带学号的E卡）放与桌面右上角，核实考生身份，核对实考人数； （3）向考生申明考场纪律和有关注意事项，开考开始前，监考人员要认真清场，要求考生将与考试无关物品集中放在指定地点，并认真检查桌面和抽屉，不得留有任何与考试科目有关的、非规定可带的纸张、书本以及其他物品。若在开考后被发现，按违纪处理，责任由学生自负；若因监考人员清场不严、检查不仔细，追究监考人员责任。 （4）考试开始前5分钟开始发卷，考场内若只有1名监考人员，应立即通报学院办公室或研究生院培养办公室，直至补派监考人员后，方可发卷。 （5）要求考生首先检查试卷是否完整无损，字迹清晰等。若有问题，应及时举手向监考人员更换；检查无误后填写学号、姓名、院系等信息。
              </Text>*/}
              <WebView
                originWhitelist={['*']}
                //source={{ html: '`${this.state.notice_text}`' }}
                source={{ html: '<h1>Hello world</h1>' }}
              />
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
    backgroundColor: YSColors.home.bg
  },
  behind_bg: {
    //height: '75%'
    //width: YSWHs.borderWidth,
    width: '100%',
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
    alignItems: 'center',
    borderRadius: 10
  },
  front_user0: {
    width: '85%',
    //height: 120,
    borderRadius: 10,
  },
  front_user: {
    width: '100%',
    height: 115,
    borderRadius: 10,
  },
  touch_exit: {
    position: 'absolute',
    right: 10,
    top: 10,
    height: 20,
    width: 20,
    //backgroundColor: '#330099'
  },
  img_exit: {
    width: 20,
    height: 20
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
    //marginTop: -36,
    //zIndex: 2,
    position: 'absolute',
    //left: '50%',
    left: 0,
    right: 0,
    top: 21,
    margin: 'auto',

  },
  logo_jk: {
    width: 73,
    height: 73,
    resizeMode: 'contain',
    //zIndex: 3
  },
  iconstyle:{
    width: 16,
    height: 16,
    resizeMode:'contain',
    marginRight: 12
  },
  inputText: {
    color: '#333333',
    borderRadius: 99,
  },
  inputContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    marginTop: 18,
    height: 47,

    borderRadius: 99,
    paddingLeft: 17,
    paddingRight: 18
  },
  text_caption: {
    fontSize: 16
  },
  bottom: {
    position: 'absolute',
    top: 257,
    left: 0,
    bottom: 0,
    width: YSWHs.width_window,
    //backgroundColor: YSColors.AppMainColor,
    backgroundColor: 'transparent',
  },
  btn: {
    width: 180,
    height: 44,
  },
  lantern_view: {
    width: YSWHs.width_window,
    height: 50,
    borderWidth: 1,
    borderColor: '#2E66E7',
    backgroundColor: '#EEF5FF'
  },
  lantern_img: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
    marginLeft: 15,
  },
  lantern_wapper: {
    //backgroundColor: '#334400',
    width: '100%',
    alignSelf: 'center'
  },
  lantern_text: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 21
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

  modal: {
    width: YSWHs.width_window,
    height: 480,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 16,
    paddingRight: 16,
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
  img: {
    width: 164,
    height: 100,
    borderRadius: 5,
    resizeMode: 'contain',
    marginRight: 10
  },
  intro_title: {
    width: YSWHs.width_window,
    paddingLeft: 16,
    paddingRight: 16,
  }


})

function select(store) {
    //alert(JSON.stringify(store.user));
    //alert(JSON.stringify(store.exam));
    var school_name = "";
    var name = '';
    var account = '';
    if (store.user){
      if(store.user.schoolInfo)
        school_name = store.user.schoolInfo.label;
      name = store.user.name;
      account = store.user.account
    }
    var info = {};
    if(store.exam && store.exam.place_info){
      info = store.exam.place_info;
    }
    return {
        school_name,
        name,
        account,
        info,
        saw_notice: store.user.saw_notice
    }
}
function mapDispatchToProps(dispatch) {
    return {
        logout: bindActionCreators(logout, dispatch),
        getDeviceUuid: bindActionCreators(getDeviceUuid, dispatch),
        GetPlace: bindActionCreators(GetPlace, dispatch),
        GetExamNotice: bindActionCreators(GetExamNotice, dispatch),
        HideExamNotice: bindActionCreators(HideExamNotice, dispatch),
        GetExamTask: bindActionCreators(GetExamTask, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(Home);
