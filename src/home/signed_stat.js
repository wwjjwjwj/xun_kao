//4 签到场次统计

//
import React from 'react';
import { TouchableOpacity, PixelRatio,
  ImageBackground, ScrollView, ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Button, Assets, Image, ListItem
} from 'react-native-ui-lib';
import { List, WhiteSpace, DatePicker, Picker,
  WingBlank,
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
import YSInput from '../common/YSInput';
import YSButton from 'YSButton';
import YSLoading from 'YSLoading';
//4. action
import { GetExamClass } from '../actions/exam';

/*const DATA = [
  {
    examId: 1,
    examName: '第一次月考',
    signTime: '9月20日 08:20-08:59',
    //examTime: '9月20日 09:00-10:30',
    numStu: 28,
    numTotal: 29,
    percent: ((29 - 28) * 100 / 29).toFixed(2),
    status: 1,
    statusName: '签到中',
    numPass: 19,
    numF: 3,
    numUnSign: 1,
    numRepair: 5,
    numNotice: 3,
  },
  {
    examId: 2,
    examName: '第四场',
    signTime: '9月21日 08:20-08:59',
    //examTime: '9月21日 09:00-10:30',
    numStu: 29,
    numTotal: 29,
    percent: ((29 - 29) * 100 / 29).toFixed(2),
    status: 0,
    statusName: '未开始',
    numPass: 19,
    numF: 3,
    numUnSign: 1,
    numRepair: 5,
    numNotice: 3,
  }
];*/

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class SignedStat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //batch: '201809考试批次',
      //exam_num: 2500,
      //branch: '重庆学习中心',
      //branch_addr: '重庆市沙坪坝区沙坪坝正街174号',

      //data_list: DATA,
      data_list: [],
    };
    (this: any).getPlaceInfo = this.getPlaceInfo.bind(this);
  }
  componentDidMount() {
    this.getPlaceInfo();
  }

  getPlaceInfo(){
    let { Toast } = this;
    let { examId, stationId, placeId } = this.props.place_info;
    if(!examId || !stationId || !placeId){
      Toast.info('参数不够，无法取场次数据');
      return;
    }
    this.props.GetExamClass(examId, stationId, placeId)
      .then((response) => {
        //alert(JSON.stringify(response));
        if(response.State == 1){
          this.setState({
            data_list: response.ReData.dataList
          })
          //response.data
        }
      })
      .catch((response) => {
        //alert(JSON.stringify(response));
        Toast.fail(response.ReMsg || YSI18n.get('调用数据失败'));
      })
  }

  //浏览视图
  onLookView = (op, item) => {
      this.setState({
          editMode: op,//编辑模式
          currentDataModel: item,//编辑对象
      });
      switch (op) {
          case 'View':
              this.props.navigation.navigate('oneExamSignedStat', { currentDataModel: item });
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
              activeBackgroundColor={Colors.dark60}
              activeOpacity={0.3}
              height={120}
              onPress={(item) => this.onLookView('View', row)}
              animation="fadeIn"
              easing="ease-out-expo"
              duration={1000}
              useNativeDriver
              containerStyle={styles.list_wrap}
          >
              <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
                  <ListItem.Part containerStyle={{ marginBottom: 0 }}>
                      <View row marginL-20>
                        <Text blue font_17 marginT-17 numberOfLines={1}>{row.orderName} {row.className}</Text>
                        <View right flex-1 paddingT-10 paddingR-10>
                          {row.state == 1 &&
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
                      <Text font_14 gray2 marginL-15>{_signTime}</Text>
                      <View right flex-1>
                        <Image source={Assets.signed.icon_next}/>
                      </View>
                    </View>

                  </ListItem.Part>
                  <ListItem.Part>
                    <View row flex-1 centerV marginT-2 marginL-22>
                      <Image source={Assets.signed.icon_user_num}/>
                      <Text font_14 gray2>签到人数</Text>
                      <Text font_14 blue marginL-15>{row.signCount}</Text>
                      <Text font_14 gray2>/{row.totalStudent}人</Text>
                      <View right marginL-36 row>
                        <Image source={Assets.signed.icon_error_gray}/>
                        <Text font_14 gray2 marginL-6>缺考率</Text>
                        <Text font_14 blue marginL-15>{ row.totalStudent > 0 ? ((row.totalStudent - row.signCount) * 100 / row.totalStudent).toFixed(2) : '0' }%</Text>
                      </View>
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
          <Text marginB-9 style={styles.modalTitle}>签到场次统计</Text>
        </View>
        <View centerH style={styles.bottom}>
          <View bg-white style={styles.bottom_1}>
            <View centerV row style={styles.bottom_1_top}>
              <Text font_18 black marginL-15>{this.props.place_info.examName}</Text>
              <Text gray2 label_input marginL-80 marginR-15>{`考试人数:${this.props.place_info.studentCount}`}</Text>
            </View>
            <View centerV row marginT-15 paddingL-15>
              <Image source={Assets.home.icon_branch_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.props.place_info.stationName}</Text>
            </View>
            <View centerV row marginT-10 paddingL-15>
              <Image source={Assets.home.icon_addr_focus} style={styles.icon} />
              <Text marginL-11 blue label_input>{this.props.place_info.placeAddress}</Text>
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


  //拍照后 确认modal
  modal: {
    width: YSWHs.width_window,
    //height: 292,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 15,
    paddingRight: 12,
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
  line2: {
    width: YSWHs.width_window,
    height: 10,
    backgroundColor: '#F1F1F1'
  },
  line3: {
    width: YSWHs.width_window,
    height: 1,
    backgroundColor: '#D6D6D6'
  },
  btn_upload: {
    backgroundColor: '#FFFFFF',
  },
  btn_upload_text: {
    fontSize: 18,
    color: '#2E66E7'
  },
  btn_scan_text: {
    fontSize: 18,
    color: '#666666'
  },



})

function select(store) {
    var place_info = {};
    if (store.exam && store.exam.place_info) {
        place_info = store.exam.place_info || {};
    }
    return {
        place_info,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        GetExamClass: bindActionCreators(GetExamClass, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(SignedStat);
