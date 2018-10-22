'use strict';

//1. 系统/第三方 插件
import React from 'react';
import { TouchableOpacity, PixelRatio
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
import YSLoaderScreen from 'YSLoaderScreen';
import { md5_32 } from 'Util';
const StyleSheet = require('../common/YSStyleSheet');
//4. action
import { loginWithEmail, schoolListQuery } from '../actions/user';
import { getDeviceUuid, checkPermissionReadPhoneState } from '../actions/base';

import {getFinger} from '../env';

class LoginByEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: props.account,
            password: '',

            //account: '18612010002',
            //password: '198693',
            //13813138000 / a123123

            //13510001001 / 345677  主考

            school_info: {},
            loading: false,
            btn_enable: false
        };
        this.message = "";
        //扩展方法用于本组件实例
        this.loadBizDictionary = loadBizDictionary.bind(this);
        this.initFormValid = initFormValid.bind(this);
        this.getFormValid = getFormValid.bind(this);
        this.getTextInputValidator = getTextInputValidator.bind(this);
        (this: any).onLogin = this.onLogin.bind(this);
        (this: any).onTextChange = this.onTextChange.bind(this);
    };
    componentWillMount() {
        //表单验证初始化
        this.initFormValid(["account", "password"])
        //test
        var w = Dimensions.get('window').width;
        var h = Dimensions.get('window').height;
        //alert(w + " " + h);
        var density = PixelRatio.get()
        //alert(density)

        var that = this;
        this.props.checkPermissionReadPhoneState()
        //.then((response) => {
          //that.props.getDeviceUuid();
        //})
        that.props.getDeviceUuid();
        this.getSchoolList();
    }

    getSchoolList(){
      let { Toast } = this;
      this.props.schoolListQuery()
        .then((response) => {

        })
        .catch((response) => {
          Toast.fail(response.message || YSI18n.get('loginFailed'));
        })
    }

    onChangeSchool(val){
      var id = val[0];
      var name = '';
      for(var i = 0; i < this.props.school_list.length; i++){
        var s = this.props.school_list[i];
        if(s.value == id){
          name = s.label;
          break;
        }
      }
      var btn_enable = this.state.btn_enable;
      if(id && this.state.account && this.state.password){
        btn_enable = true;
      }else {
        btn_enable = false;
      }
      this.setState({
        school_info: {value: id, label: name},
        btn_enable: btn_enable
      });
    }
    onTextChange(type, text){
      if(type == 1)
       this.setState({account: text})
      if(type == 2)
       this.setState({password: text})
      var that = this;
      setTimeout(function(){
        if(that.state.account
          && that.state.password
          && that.state.school_info.value){
          that.setState({ btn_enable: true })
        }else {
          that.setState({ btn_enable: false })
        }
      }, 100);
    }
    _goResetPwd(){
      this.props.navigation.navigate("resetPassword");
    }
    onLogin = () => {
        //var uuid = getFinger();
        //alert(uuid);
        //return;

        let { Toast } = this;
        var that = this;
        //隐藏键盘
        dismissKeyboard();
        this.message = "";

        let { account, password } = this.state;
        var school_id = this.state.school_info.value;
        var school_name = this.state.school_info.label;
        //alert(JSON.stringify(this.state.school_info))
        if(!account){
          Toast.info('请输入登录账号', 2);
          return;
        }else if(!password){
          Toast.info('请输入密码', 2);
          return;
        }else if(!school_id){
          Toast.info('请选择院校', 2);
          return;
        }
        //登录中...提示，默认3秒
        //Toast.loading(YSI18n.get('loginPending'), 3);
        this.setState({ loading: true })
        setTimeout(function(){
          var _password = md5_32(password);
          that.props.loginWithEmail(account, _password, school_id, school_name)
            .then((response) => {
                that.setState({ loading: false });
                Toast.success(YSI18n.get('loginSuccess'))
            })
            .catch((response) => {
                that.setState({ loading: false });
                Toast.fail(response.ReMsg || YSI18n.get('loginFailed'));
            })
        }, 1000);

    };

    render() {
        var segment = "";
        //let block_loading = null;
        //let disable = (this.state.account.trim() === '' || this.state.password.trim() === '' || !this.state.school_info.value)
        let disable = false;
        if (this.state.loading) {
            //block_loading = <YSLoading loading_type={1} />
            segment = <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={YSI18n.get('请等待...')}
                disable={disable}
                onPress={() => { }} />
        } else {
            if(this.state.btn_enable){
              segment = <YSButton
                type={'bordered'}
                style={styles.border_button_1}
                caption={YSI18n.get('登录')}
                disable={disable}
                text_style={styles.text_caption}
                onPress={this.onLogin} />
            }else {
              segment = <YSButton
                type={'bordered'}
                style={styles.border_button}
                caption={YSI18n.get('登录')}
                disable={disable}
                text_style={styles.text_caption}
                onPress={this.onLogin} />
            }
        }
        return (
            <View flex style={styles.container}>
                <Image style={styles.behind_bg} source={Assets.login.img_bg}/>
                <View style={styles.behind_bottom}>
                  <Text font_14_20 gray>默认初始密码为身份证后六位</Text>
                </View>
                <KeyboardAwareScrollView style={styles.front} ref='scroll' keyboardShouldPersistTaps="handled">
                    <View centerH paddingT-45 center>
                      <Image source={Assets.logo.app_logo} style={styles.logo} />
                    </View>
                    <View centerH paddingT-27 center>
                      <View row centerV style={styles.inputContainer}>
                        <View flex-1 style={styles.inputText}>
                          <Picker
                              title={YSI18n.get('请选择学校')}
                              extra={' '}
                              data={this.props.school_list}
                              cols={1}
                              onChange={v => this.onChangeSchool(v)}
                          >
                            <List.Item arrow="horizontal" style={styles.listItem}>
                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={Assets.login.icon_school} style={styles.iconstyle} resizeMode='contain' />
                                {this.state.school_info.value ?
                                  <Text black font_14_20>{this.state.school_info.label || '请选择学校'}</Text>
                                  :
                                  <Text gray font_14_20>{this.state.school_info.label || '请选择学校'}</Text>
                                }
                              </View>
                            </List.Item>
                          </Picker>
                        </View>
                      </View>
                      <YSInput ref="input_name"
                        icon={Assets.login.icon_user}
                        //iconstyle={styles.iconstyle}
                        placeholder={'请输入用户名/手机号'}
                        placeholderTextColor={"#C5C5C5"}
                        style={styles.inputText}
                        containerStyle={styles.inputContainer}
                        onChangeText={(text) => this.onTextChange(1, text)}
                        value={this.state.account}
                        enableClear={this.state.account ? true : false}
                        onClear={()=>this.setState({account: ''})}
                      />
                      <YSInput ref="input_pwd"
                        icon={Assets.login.icon_pwd}
                        //iconstyle={styles.iconstyle}
                        placeholder={'请输入密码'}
                        placeholderTextColor={"#C5C5C5"}
                        style={styles.inputText}
                        containerStyle={styles.inputContainer}
                        onChangeText={(text) => this.onTextChange(2, text)}
                        value={this.state.password}
                        ispassword="true"
                        enableEye={this.state.password ? true : false}
                      />
                    </View>
                    <View marginT-12 marginR-47 style={styles.block_forget_wrap}>
                      <TouchableOpacity onPress={() => this._goResetPwd()}>
                        <Text blue >{YSI18n.get('找回密码')}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.logininput_margin} centerH>
                      {segment}
                    </View>
                    <YSLoaderScreen loading={this.state.loading} tips={'登录中...'}/>
                    <YSToast ref={(toast) => this.Toast = toast} />
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
    width: '100%',
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
    shadowRadius: 5,
    zIndex: 1,
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
    marginRight: 12,
    ios: {
      marginLeft: -15,
    },
    android: {
      //paddingLeft: -100,
    }
  },
  inputText: {
    color: '#333333',
    borderRadius: 99,
  },
  listItem: {
    ios: {},
    android: {
      marginLeft: -15,
      marginRight: -15
    }
  },
  inputContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    marginTop: 18,
    height: 47,
    width: 280,

    borderRadius: 99,
    paddingLeft: 17,
    paddingRight: 18,
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
    backgroundColor: '#4B9FFF',
    width: 280,
    height: 45
  },
  border_button_1: {
    borderRadius: 99,
    //backgroundColor: 'transparent'
    backgroundColor: '#2E66E7',
    width: 280,
    height: 45
  },
  logininput_margin: {
    marginTop: 47,
    //marginLeft: 32,
    //marginRight: 32
  },

})

function select(store) {
    var school_list = [];
    var account = '';
    //alert(store.user.school_list);
    if (store.user){
        if(store.user.school_list)
          school_list = store.user.school_list;
        if(store.user.account)
          account = store.user.account;
    }
    return {
        school_list,
        account
    }
}
function mapDispatchToProps(dispatch) {
    return {
        loginWithEmail: bindActionCreators(loginWithEmail, dispatch),
        getDeviceUuid: bindActionCreators(getDeviceUuid, dispatch),
        checkPermissionReadPhoneState: bindActionCreators(checkPermissionReadPhoneState, dispatch),
        schoolListQuery: bindActionCreators(schoolListQuery, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(LoginByEmail);
