

//
import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Button, Assets, Image
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker,
  Modal, WingBlank
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
import { loginWithEmail } from '../actions/user';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //connect_show: false,

      university: '吉林大学',
      name: '李老师',
      mobile: '13511112222',
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

  goto_otg(){
    this.onCloseConnectModal();
    //this.props.navigation.navigate('otgTest', {keys: { home_key: this.props.navigation.state.key }});
    this.props.navigation.navigate('otgTest');
  }
  goto_blueteeth(){
    this.onCloseConnectModal();
    //this.props.navigation.navigate('blueteethTest', {keys: { home_key: this.props.navigation.state.key }});
    this.props.navigation.navigate('blueteethTest');
  }

  render(){

    return (
      <View flex style={styles.container}>
        <Image style={styles.behind_bg} source={Assets.home.img_bg}/>
        <View style={styles.front0}>
          <Text marginT-35 white text_title2>E考官</Text>
          <Text marginT-11 blue2 label_input>欢迎来到考场巡检系统！</Text>
          <View marginT-57 marginL-28 marginR-28 bg-white style={styles.front_user}>
            <View centerH center style={styles.logo_outside}>
              <Image source={Assets.home.img_avatar_jk} style={styles.logo} />
            </View>
            <Text center marginT-13 blue font_16>{this.state.university}</Text>
            <Text center marginT-12 black2 font_16>{this.state.name} {this.state.mobile}</Text>
          </View>
        </View>

        <View centerH marginT-20 style={styles.bottom}>
          <YSButton type={'bordered'}
            style={styles.btn}
            caption={"点击连接读卡器"}
            text_style={styles.text_caption}
            onPress={this.onShowConnectModal}/>
          <View marginT-19 bg-white style={styles.bottom_1}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>{this.state.batch}</Text>
              <Text gray2 label_input marginL-80 marginR-15>{`考试人数:${this.state.exam_num}`}</Text>
            </View>
            <View centerV row marginT-15 paddingL-15>
              <Image source={Assets.home.icon_branch_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.state.branch}</Text>
            </View>
            <View centerV row marginT-10 paddingL-15>
              <Image source={Assets.home.icon_addr_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.state.branch_addr}</Text>
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
                <Text black label_input>{this.state.exam_place}</Text>
              </View>
              <View centerV marginT-10 style={styles.bottom_2_right_item}>
                <Text black label_input>{this.state.exam_addr}</Text>
              </View>
              <View centerV marginT-10 style={styles.bottom_2_right_item}>
                <Text black label_input>{this.state.exam_contact}</Text>
              </View>
            </View>
          </View>
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
        getDeviceUuid: bindActionCreators(getDeviceUuid, dispatch)
    };
}
module.exports = connect(select, mapDispatchToProps)(Home);
