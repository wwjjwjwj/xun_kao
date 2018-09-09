/**
 * 本场签到统计
 * @providesModule OneExamSignedStat
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
import YSLoading from 'YSLoading';
//4. action
import { loginWithEmail } from '../actions/user';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

class OneExamSignedStat extends React.Component {
  constructor(props: Props) {
      super(props);
      this.state = {
          currentDataModel: props.navigation.state.params.currentDataModel,
      };
      (this: any).onTest = this.onTest.bind(this);
      (this: any).gotoDetail = this.gotoDetail.bind(this);
  };
  componentWillMount() {
  }

  onTest(){

  }
  gotoDetail(type, title){
    switch (type) {
      case 1:
        break;
      default:
    }
    this.props.navigation.navigate('statDetailByType', {
      currentDataModel: this.state.currentDataModel,
      type: type,
      title: title,
    });
  }
  render(){

    var row = this.state.currentDataModel;

    return (
      <View flex style={styles.container}>
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>考试场次：{row.examName}</Text>
            </View>
            <View centerV row marginT-17 marginL-15>
              <Image source={Assets.signed.icon_user_num} style={styles.icon} />
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

        <View centerV marginL-15 marginR-15 marginT-16>
          <View row>
            <View marginL-1 bg-gray2 style={styles.center0}/>
            <Text marginL-6 font_14 gray2>签到统计</Text>
          </View>
          <TouchableOpacity onPress={()=>this.gotoDetail(1, '未通过')}>
          <View bg-white centerV row style={styles.center1}>
            <Image source={Assets.signed.icon_f} style={styles.icon2}/>
            <Text marginL-10 font_17 black>未通过</Text>
            <View flex-1 right row centerV>
              <Text marginR-8 font_14 gray2>{row.numF}人</Text>
              <Image source={Assets.signed.icon_next} style={styles.icon2}/>
            </View>
          </View>
          </TouchableOpacity>
          <View bg-white centerV row style={styles.center1}>
            <Image source={Assets.signed.icon_un_sign} style={styles.icon2}/>
            <Text marginL-10 font_17 black>未到</Text>
            <View flex-1 right row centerV>
              <Text marginR-8 font_14 gray2>{row.numUnSign}人</Text>
              <Image source={Assets.signed.icon_next} style={styles.icon2}/>
            </View>
          </View>
          <View bg-white centerV row style={styles.center1}>
            <Image source={Assets.signed.icon_pass} style={styles.icon2}/>
            <Text marginL-10 font_17 black>通过</Text>
            <View flex-1 right row centerV>
              <Text marginR-8 font_14 gray2>{row.numPass}人</Text>
              <Image source={Assets.signed.icon_next} style={styles.icon2}/>
            </View>
          </View>
          <View bg-white centerV row style={styles.center1}>
            <Image source={Assets.signed.icon_repair} style={styles.icon2}/>
            <Text marginL-10 font_17 black>补签</Text>
            <View flex-1 right row centerV>
              <Text marginR-8 font_14 gray2>{row.numRepair}人</Text>
              <Image source={Assets.signed.icon_next} style={styles.icon2}/>
            </View>
          </View>
          <View row marginT-30>
            <View bg-orange marginL-1 style={styles.center0}/>
            <Text marginL-6 font_14 orange>重点关注</Text>
          </View>
          <View bg-white centerV row style={styles.center1}>
            <Image source={Assets.signed.icon_notice} style={styles.icon2}/>
            <Text marginL-10 font_17 black>重点关注</Text>
            <View flex-1 right row centerV>
              <Text marginR-8 font_14 orange>{row.numNotice}人</Text>
              <Image source={Assets.signed.icon_next_orange} style={styles.icon2}/>
            </View>
          </View>
        </View>

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
    height: 100,
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
    width: 18,
    height: 18
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


  center0: {
    width: 4,
    height: 15,
    borderRadius: 2
  },
  icon2: {
    width: 25,
    height: 25,
  },
  center1: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 5,
    marginTop: 10
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
module.exports = connect(select, mapDispatchToProps)(OneExamSignedStat);
