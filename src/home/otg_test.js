/**
 * otg 有线 测试
 * @providesModule OtgTest
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
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
//4. action
import { loginWithEmail } from '../actions/user';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

class OtgTest extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
      (this: any).onTest = this.onTest.bind(this);
  };
  componentWillMount() {
  }

  onTest(){
    this.props.navigation.navigate('readCardTest', {type: 'otg'});

  }
  render(){
    return (
      <View flex style={styles.container}>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          <View centerH paddingT-26 center>
            <Image source={Assets.home.icon_connect_otg} style={styles.logo} />
          </View>
          <View left marginT-30 marginL-15 marginR-17>
            <Text font_18 black2 marginT-15>有线连接说明</Text>
            <View left marginT-21>
              <Text black2 font_16>第一步：连接设备</Text>
              <Text black2 font_14 marginT-5>将连接线接入手机和读卡器两端，如接入后读卡器充电灯不亮，则表示连接失败，请更换为蓝牙连接方式。</Text>
              <Text black2 font_16 marginT-20>第二步：开始测试</Text>
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
module.exports = connect(select, mapDispatchToProps)(OtgTest);
