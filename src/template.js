

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
//4. action
import { loginWithEmail } from '../actions/user';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

class Template extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
      (this: any).onTest = this.onTest.bind(this);
  };
  componentWillMount() {
  }

  onTest(){

  }
  render(){

    return (
      <View flex style={styles.container}>
        <Image style={styles.behind_bg} source={Assets.home.img_bg}/>
        <KeyboardAwareScrollView style={styles.front} ref='scroll' keyboardShouldPersistTaps="handled">
          <View centerH paddingT-45 center>
            <Image source={Assets.logo.app_logo} style={styles.logo} />
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
module.exports = connect(select, mapDispatchToProps)(Template);
