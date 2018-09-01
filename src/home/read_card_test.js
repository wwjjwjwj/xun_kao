/**
 * 读卡测试
 * @providesModule ReadCardTest
 * @flow
 */

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

class ReadCardTest extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        read_status: 0,   //0 未开始； 1 读卡中； 2 读卡成功； 3 读卡失败

        realname: '李四',
        card: '140222111122223341',
      };
      (this: any).onTest = this.onTest.bind(this);
      (this: any).onReturn = this.onReturn.bind(this);
  };
  componentWillMount() {
  }

  onTest(){
    let { Toast } = this;
    if(this.state.read_status == 0 || this.state.read_status == 3){
      this.setState({
        read_status: 1
      })

      var that = this;
      setTimeout(function(){
        that.setState({read_status: 2})
      }, 2000)
    }else {
      Toast.info('正在读卡中...');
    }

  }
  onReturn(){

  }

  render(){
    return (
      <View flex style={this.state.read_status <= 1 ? styles.container : styles.container_result}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          {this.state.read_status <= 1 &&
            <View centerH marginT-56 center>
              <Image source={Assets.home.icon_read_card} />
              <Text font_16 black2 marginT-50>请将身份证置于读卡器上进行读卡测试</Text>
              { this.state.read_status == 0 && <View marginT-39 style={styles.load_progress}/>}
              { this.state.read_status == 0 && <Text font_12 gray2 marginT-10>等待读卡中……</Text> }
              { this.state.read_status == 1 && <View marginT-39 style={styles.load_progress} row>
                <View style={styles.load_progress_left} />
                <View style={styles.load_progress_right} />
              </View>}
              { this.state.read_status == 1 && <Text font_12 gray2 marginT-10>读卡中……</Text> }
            </View>
          }
          {this.state.read_status == 3 &&
            <View centerH marginT-56 center>
              <Image source={Assets.home.icon_read_card_fail} />
              <Text font_20 black marginT-22>读取失败</Text>
              <Text font_14 black2 marginT-15>请重新连接读卡器后重试测试</Text>
            </View>
          }
          {this.state.read_status == 2 &&
            <View centerH marginT-26 marginL-28 marginR-28 bg-white style={styles.result}>
              <Text font_18 blue marginT-18>身份证信息</Text>
              <Image source={{uri: 'abc'}} style={styles.photo}/>
              <Text font_14 gray2 marginT-15>姓名</Text>
              <Text font_20 black marginT-10>{this.state.realname}</Text>
              <Text font_14 gray2 marginT-31>证件号码</Text>
              <Text font_20 black marginT-10>{this.state.card}</Text>
            </View>
          }
          <View centerH marginT-120 marginL-48 marginR-48 center>
            {this.state.read_status == 2 ? <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={'测试完成 返回首页'}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onReturn} />
                :
            <YSButton
                type={'bordered'}
                style={this.state.read_status == 1 ? styles.border_button_ing : styles.border_button}
                caption={this.state.read_status == 3 ? '再次测试' : '开始测试'}
                text_style={styles.text_caption}
                disable={this.state.read_status == 1 ? true : false}
                onPress={this.onTest} />
            }
          </View>
          <View centerH marginT-20 marginL-48 marginR-48 center>
            {this.state.read_status == 3 && <YSButton
                type={'bordered'}
                style={styles.border_button_return}
                caption={'返回首页'}
                text_style={styles.text_caption_return}
                disable={false}
                onPress={this.onReturn} />}
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
    backgroundColor: YSColors.whiteBackground
  },
  container_result: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F1F1F1'
  },
  text_caption: {
    fontSize: 18
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
module.exports = connect(select, mapDispatchToProps)(ReadCardTest);
