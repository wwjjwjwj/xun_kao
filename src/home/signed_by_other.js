//其他签到

//
import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView, ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Button, Assets, Image, Modal, ListItem
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker,
  WingBlank
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
import { GetPlace } from '../actions/exam';
import { getDeviceUuid } from '../actions/base';

import {getFinger} from '../env';

const DATA = [
  {
    examId: 1,
    examName: '第一次月考',
    signTime: '9月20日 08:20-08:59',
    examTime: '9月20日 09:00-10:30',
    status: 1,
    statusName: '签到中',
  },
  {
    examId: 2,
    examName: '第四场',
    signTime: '9月21日 08:20-08:59',
    examTime: '9月21日 09:00-10:30',
    status: 0,
    statusName: '未开始'
  }
];

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class SignedByOther extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      batch: '201809考试批次',
      exam_num: 2500,
      branch: '重庆学习中心',
      branch_addr: '重庆市沙坪坝区沙坪坝正街174号',

      data_list: DATA,
    };
    (this: any).getPlaceInfo = this.getPlaceInfo.bind(this);
  }
  componentDidMount() {
    this.getPlaceInfo();
  }

  getPlaceInfo(){
    let { Toast } = this;
    this.props.GetPlace()
      .then((response) => {
        alert(JSON.stringify(response));
        if(response.State == 1){
          this.setState({

          })
          //response.data
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        //Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }

  onSearchChange(text){
    this.setState({search_text: text});
    //触发搜索
  }

  //浏览视图
  onLookView = (op, item) => {
      this.setState({
          editMode: op,//编辑模式
          currentDataModel: item,//编辑对象
      });
      switch (op) {
          case 'View':
              this.props.navigation.navigate('CourseDetail', { currentDataModel: item });
              break;
      }
  };
  //视图回调
  viewCallback = (dataModel) => {
      if (dataModel) {
          //如果需要更新，则刷新
          if (dataModel.is_changed) {
              this.getPlaceInfo();
          }
      }
      this.setState({ editMode: 'Manage' });
  }
  renderRow(row, id) {
      return (
          <ListItem
              activeBackgroundColor={Colors.dark60}
              activeOpacity={0.3}
              height={120}
              onPress={(item) => this.onLookView('View', item)}
              animation="fadeIn"
              easing="ease-out-expo"
              duration={1000}
              useNativeDriver
              containerStyle={styles.list_wrap}
          >
              <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                  <ListItem.Part containerStyle={{ marginBottom: 0 }}>
                      <View row marginL-20>
                        <Text blue font_17 marginT-17 numberOfLines={1}>{row.examName}</Text>
                        <View right flex-1 paddingT-10 paddingR-10>
                          {row.status == 1 &&
                            <View style={styles.sign_status} center>
                              <Text font_12 orange style={styles.sign_status_text}>重点关注考生：2人</Text>
                            </View>
                          }
                        </View>
                      </View>
                  </ListItem.Part>
                  <ListItem.Part>
                    <View row marginT-23 marginL-22>
                      <Image source={Assets.signed.icon_time_signed}/>
                      <Text font_14 gray2>签到</Text>
                      <Text font_14 gray2 marginL-15>{row.signTime}</Text>
                      <View right flex-1>
                        <Image source={Assets.signed.icon_next}/>
                      </View>
                    </View>

                  </ListItem.Part>
                  <ListItem.Part>
                    <View row flex-1 centerV marginT-2 marginL-22>
                      <Image source={Assets.signed.icon_time_exam}/>
                      <Text font_14 gray2>考试</Text>
                      <Text font_14 gray2 marginL-15>{row.examTime}</Text>
                    </View>
                  </ListItem.Part>
              </ListItem.Part>
          </ListItem>
      );
  }

  render(){
    let block_list_view = <ListView
        dataSource={ds.cloneWithRows(this.state.data_list)}
        renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
    />

    return (
      <View flex style={styles.container}>
        <View centerH bg-blue>
          <Text marginT-35 style={styles.modalTitle}>其他签到</Text>
          <View row>
            <YSInput ref="input_name"
                icon={Assets.signed.icon_search}
                //iconstyle={styles.iconstyle}
                placeholder={'请输入考生信息查询'}
                placeholderTextColor={"#999999"}
                style={styles.inputText}
                containerStyle={this.state.search_text ? styles.inputContainer2 : styles.inputContainer}
                onChangeText={(text) => this.onSearchChange(text)}
                value={this.state.search_text}
                enableClear={this.state.search_text ? true : false}
                clearStyle={styles.clearStyle}
                onClear={()=>this.setState({search_text: ''})}
            />
            {this.state.search_text && <TouchableOpacity onPress={()=> this.onSearchChange('')}>
              <Text font_14 white marginT-19>取消</Text>
            </TouchableOpacity>}
          </View>
        </View>
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
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
        </View>

        {block_list_view}

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
    backgroundColor: '#F1F1F1'
  },
  modalTitle: {
    fontSize: 19,
    color: YSColors.whiteBackground,
  },
  inputText: {
    color: '#999999',
    fontSize: 14,
  },
  inputContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    height: 28,
    width: 345,
    backgroundColor: '#FFFFFF',

    borderRadius: 14,
    paddingLeft: 11,
    paddingTop: 7,
    paddingBottom: 7,
  },
  inputContainer2: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 12,
    height: 28,
    width: 300,
    backgroundColor: '#FFFFFF',

    borderRadius: 14,
    paddingLeft: 11,
    paddingTop: 7,
    paddingBottom: 7,
  },
  clearStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 69,
  },
  //------------考试场次部分
  list_wrap: {
    backgroundColor: YSColors.whiteBackground,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
  },
  sign_status: {
    borderRadius: 10,
    backgroundColor: '#FFF4D5',
  },
  sign_status_text: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 14,
    marginRight: 13
  },
  btn_sign: {
    borderRadius: 15,
    backgroundColor: '#4B9FFF',
    width: 75,
    height: 30
  },
  btn_sign_text: {
    fontSize: 13,
    color: YSColors.whiteBackground
  },
  //----------上部分
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
  text_caption: {
    fontSize: 16
  },





  btn: {
    width: 180,
    height: 44,
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
        GetPlace: bindActionCreators(GetPlace, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(SignedByOther);
