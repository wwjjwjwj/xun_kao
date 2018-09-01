/**
 * 蓝牙 无线 测试
 * @providesModule BlueteethTest
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

class BlueteethTest extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
      (this: any).onTest = this.onTest.bind(this);
  };
  componentWillMount() {
  }

  onTest(){
    //alert("hello");
    this.props.navigation.navigate('readCardTest');
  }

  render(){
    return (
      <View flex style={styles.container}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          <View centerH marginT-26 center>
            <Image source={Assets.home.icon_connect_blueteeth} style={styles.logo} />
          </View>
          <View left marginT-30 marginL-15 marginR-17>
            <Text font_18 black2 marginT-15>蓝牙连接说明</Text>
            <View left marginT-21>
              <Text black2 font_16>第一步：开启设备</Text>
              <Text black2 font_14 marginT-5>设备开机后，蓝牙开启搜索，蓝牙指示灯闪烁，每次一下。</Text>
              <Text black2 font_16 marginT-20>第二步：蓝牙配对</Text>
              <Text black2 font_14 marginT-5>手机蓝牙功能开启，在可用设备列表中选择“ST710-××××××”进行配对，配对成功后，设备名称显示在已配对列表中，设备蓝牙指示灯每次闪烁2下。</Text>
              <Text black2 font_16 marginT-20>第三步：开始测试</Text>
              <Text black2 font_14 marginT-5>当连接成功后，开始测试按钮可点击。</Text>
            </View>
          </View>
          <View centerH marginT-50 marginL-48 marginR-48 center>
            <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={YSI18n.get('读卡器测试')}
                text_style={styles.text_caption}
                disable={false}
                onPress={this.onTest} />
          </View>

        </KeyboardAwareScrollView>
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
  text_caption: {
    fontSize: 18
  },
  border_button: {
    borderRadius: 99,
    //backgroundColor: 'transparent'
    backgroundColor: '#4B9FFF'
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
module.exports = connect(select, mapDispatchToProps)(BlueteethTest);
