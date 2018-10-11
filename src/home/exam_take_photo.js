//3 考场拍照

//
import React from 'react';
import { TouchableOpacity, PixelRatio,
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
const StyleSheet = require('../common/YSStyleSheet');
import YSToast from 'YSToast';
import YSI18n from 'YSI18n';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSButton from 'YSButton';
//4. action
//import { GetExamClassSign } from '../actions/exam';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class ExamTakePhoto extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //batch: '201809考试批次',
      //exam_num: 2500,
      //branch: '重庆学习中心',
      //branch_addr: '重庆市沙坪坝区沙坪坝正街174号',

      //data_list: DATA,
      //data_list: [],
    };
    //(this: any).getPlaceInfo = this.getPlaceInfo.bind(this);
  }
  componentDidMount() {
    //this.getPlaceInfo();
  }

  /*getPlaceInfo(){
    let { Toast } = this;
    let { examId, stationId, placeId } = this.props.place_info;
    if(!examId || !stationId || !placeId){
      Toast.info('参数不够，无法取场次数据');
      return;
    }
    this.props.GetExamClassSign(examId, stationId, placeId)
      .then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1){
          this.setState({
            data_list: response.ReData.dataList
          })
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }*/
  onSign(row: any){
    if(row.state == 1){
      this.props.navigation.navigate('placeTakePhoto', {info: row});
    }
  }

  renderRow(row, id) {
      var _signTime;
      var _examTime;
      if(row.beginInterval && row.endInterval){
        var index = row.beginInterval.indexOf(' ');
        _signTime = row.beginInterval.substr(0, index);
        _signTime += row.beginInterval.substr(index, 6);
        _signTime += '-';
        _signTime += row.endInterval.substr(index+1, 5);
      }
      if(row.beginTime && row.endTime){
        var index = row.beginTime.indexOf(' ');
        _examTime = row.beginTime.substr(0, index);
        _examTime += row.beginTime.substr(index, 6);
        _examTime += '-';
        _examTime += row.endTime.substr(index+1, 5);
      }
      return (
          <ListItem
              //activeBackgroundColor={Colors.dark60}
              //activeOpacity={0.3}
              height={120}
              //onPress={(item) => this.onLookView('View', item)}
              animation="fadeIn"
              easing="ease-out-expo"
              duration={1000}
              useNativeDriver
              containerStyle={styles.list_wrap}
          >
              <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                  <ListItem.Part containerStyle={{ marginBottom: 0 }}>
                      <View row marginL-20>
                        <Text blue font_17 marginT-17 numberOfLines={1}>{row.orderName}</Text>
                        <View right flex-1 paddingT-10 paddingR-10>
                          {row.state == 1 &&
                            <View style={styles.sign_status} center>
                              <Text font_12 white3 style={styles.sign_status_text}>{row.stateName}</Text>
                            </View>
                          }
                          {row.state != 1 &&
                            <View style={styles.sign_status0} center>
                              <Text font_12 white3 style={styles.sign_status_text0}>{row.stateName}</Text>
                            </View>
                          }
                        </View>
                      </View>
                  </ListItem.Part>
                  <ListItem.Part>
                    <View row marginT-23 marginL-22>
                      <Image source={Assets.signed.icon_time_signed}/>
                      <Text font_14 gray2>签到</Text>
                      <Text font_14 gray2 marginL-15>{_signTime}</Text>
                      <View right flex-1>
                        {row.state == 1
//|| row.state != 1
                          && <YSButton
                              type={'bordered'}
                              style={styles.btn_sign}
                              caption={'考场拍照'}
                              text_style={styles.btn_sign_text}
                              disable={false}
                              onPress={() => this.onSign(row)} />
                        }
                      </View>
                    </View>

                  </ListItem.Part>
                  <ListItem.Part>
                    <View row flex-1 centerV marginT-2 marginL-22>
                      <Image source={Assets.signed.icon_time_exam}/>
                      <Text font_14 gray2>考试</Text>
                      <Text font_14 gray2 marginL-15>{_examTime}</Text>
                    </View>
                  </ListItem.Part>
              </ListItem.Part>
          </ListItem>
      );
  }

  render(){
    let block_list_view = <ListView
        dataSource={ds.cloneWithRows(this.props.class_sign_list)}
        renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
    />

    return (
      <View flex style={styles.container}>
        <View centerH bg-blue>
          <Text marginB-9 style={styles.modalTitle}>监考考场拍照</Text>
        </View>
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>{this.props.place_info.examName}</Text>
              <Text gray2 font_14_20 marginL-80 marginR-15>{`考试人数:${this.props.place_info.studentCount}`}</Text>
            </View>
            <View centerV row marginT-15 paddingL-15>
              <Image source={Assets.home.icon_branch_focus} style={styles.icon} />
              <Text marginL-11 blue font_14_20>{this.props.place_info.stationName}</Text>
            </View>
            <View centerV row marginT-10 paddingL-15>
              <Image source={Assets.home.icon_addr_focus} style={styles.icon} />
              <Text marginL-11 blue font_14_20>{this.props.place_info.placeAddress}</Text>
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
    android: {
      marginTop: 15
    },
    ios: {
      marginTop: 35
    }
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
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#4B9FFF',
    width: 60,
    height: 20
  },
  sign_status_text: {
    color: '#4B9FFF',
    fontSize: 12,
  },
  sign_status0: {
    borderRadius: 10,
    backgroundColor: '#D6D6D6',
    width: 60,
    height: 20
  },
  sign_status_text0: {
    color: '#FFFFFF',
    fontSize: 12,
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
    var place_info = {};
    var class_sign_list = [];
    if (store.exam && store.exam.place_info) {
        place_info = store.exam.place_info || {};
    }
    if(store.exam && store.exam.class_sign_list){
      class_sign_list = store.exam.class_sign_list
    }
    return {
        place_info,
        class_sign_list
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //GetExamClassSign: bindActionCreators(GetExamClassSign, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(ExamTakePhoto);
