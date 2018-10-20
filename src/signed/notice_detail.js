/**
 * 监考须知
 * @providesModule NoticeDetail
 * @flow
 */

//
import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Modal, Button, Assets, Image
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker
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
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSWebView from 'YSWebView';
//4. action
import { loginWithEmail } from '../actions/user';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

class NoticeDetail extends React.Component {
  constructor(props) {
      super(props);
      var p = props.navigation.state.params;
      this.state = {
        //desc: '1、监考人员必须充分重视监考工作，具有高度的责任感。监考安排一旦确定，监考人员必须按时履行监考职责，不得迟到、早退、缺席，不得擅自调换监考人员。 2、所有监考人员须携带监考证参加监考。监考过程中不得使用手机，不得擅自离岗，不得在考场中交谈等，一经发现，按相应教学事故处理。 3、监考当日，监考人员应提前15-20分钟到岗，作好考试各项准备工作： （1）按照规定引导学生隔列就坐或按指定位置就坐，前后对齐，不得由考生随意找、占座位； （2）要求考生将学生证（或带学号的E卡）放与桌面右上角，核实考生身份，核对实考人数； （3）向考生申明考场纪律和有关注意事项，开考开始前，监考人员要认真清场，要求考生将与考试无关物品集中放在指定地点，并认真检查桌面和抽屉，不得留有任何与考试科目有关的、非规定可带的纸张、书本以及其他物品。若在开考后被发现，按违纪处理，责任由学生自负；若因监考人员清场不严、检查不仔细，追究监考人员责任。 （4）考试开始前5分钟开始发卷，考场内若只有1名监考人员，应立即通报学院办公室或研究生院培养办公室，直至补派监考人员后，方可发卷。 （5）要求考生首先检查试卷是否完整无损，字迹清晰等。若有问题，应及时举手向监考人员更换；检查无误后填写学号、姓名、院系等信息。'
        desc: p.notice_text
      };
  };
  componentWillMount() {
  }

  render(){
    return (
      <View flex style={styles.container}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          <View paddingL-15 paddingT-15 paddingR-15>
            <Text font_16 black2>本批次监考须知</Text>
            {/*<Text font_14_20 black2 marginT-10>{this.state.desc}</Text>*/}
            <YSWebView
              style={{backgroundColor: YSColors.black2}}
              source={this.state.desc}
              //source='<h1>Hello world</h1>'
              //url='http://news.163.com/18/0811/13/DOUC6BMI000189FH.html'
            />
          </View>
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
    backgroundColor: YSColors.home.bg
  },
  behind_bg: {
    //height: '75%'
  },
  behind_bottom: {
    position: 'absolute',
    bottom: 47,
    left: 97

  },
  front: {
    position: 'absolute',
    backgroundColor: YSColors.whiteBackground,
    width: '91.5%',
    height: '78%',
    top: YSWHs.login.front_top,
    left: YSWHs.login.front_left,
    right: YSWHs.login.front_left,
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
  logo: {
    width: 80,
    height: 80,
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

  block_forget_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    //alignItems: 'center',
    height: 20,
  },
  forgetwrap: {
    textAlign: 'center',
    color: YSColors.lightText,
    backgroundColor: 'transparent'
  },
  text_caption: {
    fontSize: 18
  },

  border_button: {
    borderRadius: 99,
    //backgroundColor: 'transparent'
    backgroundColor: '#4B9FFF'
  },
  logininput_margin: {
    marginTop: 47,
    marginLeft: 32,
    marginRight: 32
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
        loginWithEmail: bindActionCreators(loginWithEmail, dispatch),
        getDeviceUuid: bindActionCreators(getDeviceUuid, dispatch)
    };
}
module.exports = connect(select, mapDispatchToProps)(NoticeDetail);
