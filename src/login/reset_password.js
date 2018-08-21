//@flow

'use strict';

//1. 系统/第三方 插件
import React from 'react';
import {
    Animated,
    Dimensions,
    //Image,
    //View,
    //Text,
    refs,
    ScrollView,
    //TextInput,
    //Button,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Assets, Image, Colors, Text, TextInput,
  Button, View
} from 'react-native-ui-lib';
//2. 自定义方法
import {isValidMobile} from 'Util';
//3. 自定义 插件
import HeaderNavigator from 'headerNavigator';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
import YSI18n from 'YSI18n';
const StyleSheet = require('../common/YSStyleSheet');
import YSToast from 'YSToast';
//4. action
import { resetPwdByMobile, sendSMS } from '../actions/user';

export type State = {
    isLoading: boolean;
    isCountDown: boolean;
    countDownSeconds: number;    //倒计时秒数
    phone: string;
    valid_code: string;
    pwd: string;
}

//var IMG_BG;
let COUNT_DOWN_INIT = 60
//const Codes = ['86', '1'];

class ResetPassword extends React.Component {
    props: {
        dispatch: (action: any) => Promise<*>;
        style: any;
        navigation: any;
    };
    state: State;
    _isKeyboardShowed: boolean;   //键盘是否显示
    _countDownTimer: any;
    _isMounted: boolean;
constructor(props: Props) {
    super(props);
    this.state = {
        isLoading: false,
        isCountDown: false,
        countDownSeconds: COUNT_DOWN_INIT,
        phone: props.phone || '',
        code: '',
        pwd: '',

        step: 1,

        showMaskWindow: true,
    };
    this._isKeyboardShowed = false;
    this._countDownTimer = null;
    (this: any)._getInputValue = this._getInputValue.bind(this);
    (this: any)._reset = this._reset.bind(this);
    (this: any)._sendSMS = this._sendSMS.bind(this);
    (this: any).onNext = this.onNext.bind(this);
};
componentWillMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    //IMG_BG = Util.getAppBg();
}
componentDidMount(){
    this._isMounted = true;
}
componentWillUnmount(){
    this.setState({ showMaskWindow: false })

    this._countDownTimer && clearInterval(this._countDownTimer);
    this._countDownTimer = undefined;
    this._isMounted = false;
}
_keyboardDidHide = () => {
    if (this._isKeyboardShowed) {
        if (this.refs.input_phone)
            this.refs.input_phone.onBlur();
        if (this.refs.input_valid_code) {
            //this.refs.input_valid_code.onBlur();
            this.refs.input_valid_code.blur();
        }
        if (this.refs.input_pwd)
            this.refs.input_pwd.onBlur();
    }
}
_keyboardDidShow = () => {
    this._isKeyboardShowed = true;
}
_getInputValue(val: string, type: number): void {
    switch(type) {
            case 0:
    this.setState({ phone: val })
            break;
    case 1:
    this.setState({ valid_code: val })
            break;
    case 2:
    this.setState({ pwd: val })
            break;
}
    };
_startCountDown(){
    var that = this;
    this._countDownTimer = setInterval(() => {
        that.state.countDownSeconds -= 1;
        that.setState({
            countDownSeconds: that.state.countDownSeconds
        })
        if (that.state.countDownSeconds <= 0) {
            clearInterval(that._countDownTimer);
            that.setState({
                isCountDown: false
            })
        };
    }, 1000)
};
_sendSMS(){
    let { Toast } = this;
    var that = this;
    var phone = this.state.phone;
    //var countryCode = this.state.chooseCountryCode;
    if (phone) {
        var isMobile = isValidMobile(phone, 86);
        if (!isMobile) {
            Toast.fail("请输入一个正确的手机号");
            return;
        }
    } else {
        Toast.fail("请输入手机号");
        return;
    }
    this.code_sended = true;
    var world_phone = "+" + this.props.countryCode + phone;
    this.props.sendSMS(world_phone, 3)
      .then(response => {
        //倒计时60s
        that.setState({
            isCountDown: true,
            countDownSeconds: COUNT_DOWN_INIT
        });
        that._startCountDown();
      })
      .catch(response => {
        Toast.fail(response.message || YSI18n.get('loginFailed'));
      })
}
onNext(){
  if(this.state.step == 1){
    this.setState({
      step: 2
    })
  }else {

  }

}
async _reset() {
    let { Toast } = this;
    var that = this;
    var phone = this.state.phone;
    var valid_code = this.state.valid_code;
    var pwd = this.state.pwd;
    if (phone && valid_code && pwd) {

    } else {
        //alert(YSI18n.get('Register_tip'));
        Toast.fail("请输入手机号");
        return;
    }
    if (pwd.length < 6) {
        Toast.fail("密码长度不能小于6");
        return;
    }
    var world_phone = "+" + this.props.countryCode + phone;
    let params = [];
    params.push(world_phone);
    params.push(valid_code);
    params.push(pwd);

    const { dispatch, onReggedIn } = this.props;
    this.setState({ isLoading: true });
    try {
        await Promise.all([
            dispatch(resetPwdByMobile(params, function () {
                that.props.navigation.goBack(null);
                Toast.success(YSI18n.get('Reset_success'))
            })),
            Util.timeout(15000),
        ])
    } catch (e) {
        Toast.fail(e.message || e);
        return
    } finally {
        this._isMounted && this.setState({ isLoading: false });
    }
    onReggedIn && onReggedIn();
};

render() {



    var segment_btn = "";
    var segment_input = "";
    let block_loading = null;
    let disable = false//this.state.phone.trim() === "" || this.state.code.trim() === "";
    if(this.state.isLoading){
      block_loading = <YSLoading loading_type={1}/>
      segment_btn = <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={YSI18n.get('请等待...')}
                disable={disable}
                onPress={() => { }} />
    } else {
      segment_btn = <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={this.state.step == 1 ? '下一步' : '确认'}
                disable={disable}
                text_style={styles.text_caption}
                onPress={this.onNext} />
    }

    if(this.state.step == 1){
      segment_input = <View centerH center marginT-52>
              <YSInput ref="input_name"
                icon={this.state.isPhoneFocus ? Assets.login.icon_phone_focus : Assets.login.icon_phone}
                placeholder={'请输入已绑定的手机号'}
                placeholderTextColor={"#C5C5C5"}
                style={styles.inputText}
                containerStyle={styles.inputContainer}
                onChangeText={(text) => this.setState({phone: text})}
                value={this.state.phone}
                enableClear={this.state.phone ? true: false}
                onFocus={()=>this.setState({isPhoneFocus: true})}
                onBlur={()=>this.setState({isPhoneFocus: false})}
                onClear={()=>this.setState({phone: ''})}
              />
              <YSInput ref="input_code"
                icon={this.state.isCodeFocus ? Assets.login.icon_verify_focus : Assets.login.icon_verify}
                placeholder={'请输入验证码'}
                placeholderTextColor={"#C5C5C5"}
                style={styles.inputText}
                containerStyle={styles.inputContainer}
                onChangeText={(text) => this.setState({code: text})}
                value={this.state.code}
                onFocus={()=>this.setState({isCodeFocus: true})}
                onBlur={()=>this.setState({isCodeFocus: false})}
                button={{title: '获取验证码', onPress:this._sendSMS  }}
              />
            </View>
    }else {
      segment_input = <View centerH center marginT-52>
              <YSInput ref="input_pwd"
                icon={this.state.isPwdFocus ? Assets.login.icon_pwd_focus : Assets.login.icon_pwd}
                placeholder={'请输入新密码'}
                placeholderTextColor={"#C5C5C5"}
                style={styles.inputText}
                containerStyle={styles.inputContainer}
                onChangeText={(text) => this.setState({pwd: text})}
                value={this.state.pwd}
                ispassword={true}
                enableEye={this.state.pwd ? true: false}
                onFocus={()=>this.setState({isPwdFocus: true})}
                onBlur={()=>this.setState({isPwdFocus: false})}
              />
              <YSInput ref="input_pwd2"
                icon={this.state.isPwd2Focus ? Assets.login.icon_pwd_focus : Assets.login.icon_pwd}
                placeholder={'请再次输入密码'}
                placeholderTextColor={"#C5C5C5"}
                style={styles.inputText}
                containerStyle={styles.inputContainer}
                onChangeText={(text) => this.setState({pwd2: text})}
                value={this.state.pwd2}
                ispassword={true}
                enableEye={this.state.pwd2 ? true: false}
                onFocus={()=>this.setState({isPwd2Focus: true})}
                onBlur={()=>this.setState({isPwd2Focus: false})}
              />
            </View>
    }

    return (
        <View style={styles.container}>
          <Image source={Assets.login.img_bg}/>
          <KeyboardAwareScrollView style={styles.front} ref='scroll' keyboardShouldPersistTaps="handled">
            <Text centerH center blue text_title marginT-80 style={styles.title}>找回密码</Text>
            {segment_input}
            <View style={styles.button_margin}>
              {segment_btn}
            </View>
          </KeyboardAwareScrollView>
          <HeaderNavigator navigation={this.props.navigation} headerTitle={""} />
          <YSToast ref={(toast) => this.Toast = toast} />
        </View>
    );
};
}

var styles = StyleSheet.create({
  container: {
      flex: 1,
      ios: {
          height: YSWHs.height_window - YSWHs.header_ios_height
      },
      android: {
          height: YSWHs.height_window - YSWHs.header_android_height - 24
      },
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: YSColors.login.bg
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
  title: {
    height: 25
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

  button_margin: {
    marginTop: 143,
    marginLeft: 32,
    marginRight: 32
  },
  border_button: {
    borderRadius: 99,
    backgroundColor: '#4B9FFF',
  },
  text_caption: {
    fontSize: 18
  },

});

function select(store) {
    var phone = "";
    var fullPhone = "";
    var countryCode = "86";//默认1
    if (store.user && store.user.login_name) {
        phone = store.user.login_name
        fullPhone = phone;
    }
    //如果不是手机号，则默认为空
    /*if (!Util.isValidMobile(phone, 86)) {
        phone = "";
    }
    else {
        Codes.map((a) => {
            let pre = `+${a}`;
            if (phone.indexOf(pre) != -1) {
                phone = phone.replace(pre, '');
                countryCode = `${a}`;
                return;
            }
        })
    }*/
    return {
        fullPhone: fullPhone,//完整电话（带区号)
        phone: phone,
        countryCode: countryCode//国家
    }
}
function mapDispatchToProps(dispatch) {
    return {
        resetPwdByMobile: bindActionCreators(resetPwdByMobile, dispatch),
        sendSMS: bindActionCreators(sendSMS, dispatch)
    };
}

module.exports = connect(select, mapDispatchToProps)(ResetPassword);
