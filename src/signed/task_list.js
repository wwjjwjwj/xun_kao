/**
 * 监考任务
 * @providesModule TaskList
 * @flow
 */

//
import React from 'react';
import { StyleSheet, TouchableOpacity, PixelRatio,
  ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Colors, View, Text, TextInput, TextArea,
  Modal, Button, Assets, Image, ListItem
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

const TASK = [
  {
    name: '监考任务1',
    desc: '开考前5分钟，拍摄试卷袋照片。'
  },
  {
    name: '监考任务2',
    desc: '开考后30分钟，拍摄考场全景照片，拍摄缺考签到表'
  }
]

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class TaskList extends React.Component {
  constructor(props) {
      super(props);
      var p = props.navigation.state.params;
      this.state = {
        //data_list: TASK,
        data_list: p.task_list,
        notice_text: p.notice_text,
      };
      (this: any).gotoNotice = this.gotoNotice.bind(this);
  };
  componentWillMount() {
  }

  gotoNotice(){
    this.props.navigation.navigate('noticeDetail', {notice_text: this.state.notice_text});
  }

  renderRow(row, id) {
      return (
          <ListItem
              activeBackgroundColor={Colors.dark60}
              activeOpacity={0.3}
              height={105}
              //onPress={(item) => this.onLookView('View', row)}
              animation="fadeIn"
              easing="ease-out-expo"
              duration={1000}
              useNativeDriver
              containerStyle={styles.list_wrap}
          >
              <ListItem.Part column>
                  <ListItem.Part>
                      <Text blue font_17>监考任务{parseInt(id) + 1}</Text>
                  </ListItem.Part>
                  <ListItem.Part>
                    <View row marginT-23>
                        <Image source={Assets.signed.icon_task_gray}/>
                        <Text black2 font_14 marginL-9 numberOfLines={3}>{row.content}</Text>
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
        <TouchableOpacity onPress={()=>this.gotoNotice()}>
        <View bg-blue4 centerV row style={styles.notice_title}>
          <Text blue font_17 marginL-15>监考须知</Text>
          <View right flex-1>
            <Image source={Assets.signed.icon_next_blue}/>
          </View>
        </View>
        </TouchableOpacity>
        <KeyboardAwareScrollView ref='scroll' keyboardShouldPersistTaps="handled">
          {block_list_view}
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
    backgroundColor: '#F1F1F1',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  notice_title: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    borderColor: '#2E66E7',
    borderWidth: 1,
  },

  list_wrap: {
    backgroundColor: YSColors.whiteBackground,
    marginTop: 15,
    borderRadius: 5,

    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 1,
    paddingBottom: 15
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
module.exports = connect(select, mapDispatchToProps)(TaskList);
