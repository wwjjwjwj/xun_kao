'use strict';

//1. 系统/第三方 插件
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
} from 'ComponentExt'
//3. 自定义 插件
import YSToast from 'YSToast';
import YSI18n from 'YSI18n';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
//4. action
import { loginWithEmail } from '../actions/user';


class LoginByEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: props.account,
            password: '',

            school_list: [
              {'value': '1', 'label': '清华大学'},
              {'value': '2', 'label': '北京大学'},
              {'value': '3', 'label': '南开大学'}
            ],
            school_info: {}
        };
        //扩展方法用于本组件实例
        this.loadBizDictionary = loadBizDictionary.bind(this);
        this.initFormValid = initFormValid.bind(this);
        this.getFormValid = getFormValid.bind(this);
        this.getTextInputValidator = getTextInputValidator.bind(this);
    };
    componentWillMount() {
        //表单验证初始化
        this.initFormValid(["account", "password"])

        var w = Dimensions.get('window').width;
        var h = Dimensions.get('window').height;
        //alert(w + " " + h);

        var density = PixelRatio.get()
        //alert(density)
    }

    onChangeSchool(val){
      var id = val[0];
      var name = '';
      for(var i = 0; i < this.state.school_list.length; i++){
        var s = this.state.school_list[i];
        if(s.value == id){
          name = s.label;
          break;
        }
      }
      this.setState({
        school_info: {value: id, label: name}
      });
    }
    _goResetPwd(){
      this.props.navigation.navigate("ResetPassword");
    }
    onLogin = () => {
        //隐藏键盘
        dismissKeyboard();

        let { account, password } = this.state;
        //登录中...提示，默认3秒
        Toast.loading(YSI18n.get('loginPending'), 3);
        this.props.loginWithEmail(account, password)
            //api调用成功
            .then((response) => {
                Toast.success(YSI18n.get('loginSuccess'))
            })
            //api调用失败,提示登录名或密码错误
            .catch((response) => {
                Toast.fail(response.message || YSI18n.get('loginFailed'));
            })
    };

    render() {
        var segment = "";
        let block_loading = null;
        let disable = (this.state.account.trim() === '' || this.state.password.trim() === '')
        if (this.state.isLoading) {
            block_loading = <YSLoading loading_type={1} />
            segment = <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={YSI18n.get('请等待...')}
                disable={disable}
                onPress={() => { }} />
        } else {
            segment = <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={YSI18n.get('登录')}
                disable={disable}
                text_style={styles.text_caption}
                onPress={this.onLogin} />
        }
        return (
            <View flex style={styles.container}>
                <Image style={styles.behind_bg} source={Assets.login.img_bg}/>
                <View style={styles.behind_bottom}>
                  <Text label gray>默认初始密码为身份证后六位</Text>
                </View>
                <KeyboardAwareScrollView style={styles.front} ref='scroll' keyboardShouldPersistTaps="handled">
                    <View centerH paddingT-45 center>
                      <Image source={Assets.logo.app_logo} style={styles.logo} />
                    </View>
                    <View centerH paddingT-27 paddingH-31 center>
                      <View row centerV style={styles.inputContainer}>
                        <View flex-1 style={styles.inputText}>
                          <Picker
                              title={YSI18n.get('请选择学校')}
                              extra={' '}
                              data={this.state.school_list}
                              cols={1}
                              onChange={v => this.onChangeSchool(v)}
                          >
                            <List.Item arrow="horizontal">
                              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Image source={Assets.login.icon_school} style={[styles.iconstyle, {marginLeft: -15}]} resizeMode='contain' />
                                {this.state.school_info.value ?
                                  <Text black text>{this.state.school_info.label || '请选择学校'}</Text>
                                  :
                                  <Text gray label>{this.state.school_info.label || '请选择学校'}</Text>
                                }
                              </View>
                            </List.Item>
                          </Picker>
                        </View>
                      </View>
                      <YSInput ref="input_name"
                        icon={Assets.login.icon_user}
                        iconstyle={styles.iconstyle}
                        placeholder={'请输入用户名/手机号'}
                        placeholderTextColor={"#C5C5C5"}
                        style={styles.inputText}
                        containerStyle={styles.inputContainer}
                        onChangeText={(text) => this.setState({account: text})}
                        value={this.state.account}
                      />
                      <YSInput ref="input_pwd"
                        icon={Assets.login.icon_pwd}
                        iconstyle={styles.iconstyle}
                        placeholder={'请输入密码'}
                        placeholderTextColor={"#C5C5C5"}
                        style={styles.inputText}
                        containerStyle={styles.inputContainer}
                        onChangeText={(text) => this.setState({password: text})}
                        value={this.state.password}
                        ispassword="true"
                      />
                    </View>
                    <View marginT-12 marginR-47 style={styles.block_forget_wrap}>
                      <TouchableOpacity onPress={() => this._goResetPwd()}>
                        <Text blue >{YSI18n.get('找回密码')}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.logininput_margin}>
                      {segment}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: YSColors.login.bg
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
  border_button: {
    borderRadius: 99,
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
    };
}
module.exports = connect(select, mapDispatchToProps)(LoginByEmail);
