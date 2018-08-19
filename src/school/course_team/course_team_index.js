/*
 * 课程组首页
 * @flow
 * @providesModule CourseTeamIndex
 */

'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import YSI18n from 'YSI18n';
import { ListItem, Avatar, Modal, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
//import { Toast } from 'antd-mobile-rn';
import YSToast from 'YSToast';
import YSpage from 'YSpageControl';
//组件实例模板方法引入
import { loadBizDictionary, onSearch, onPageIndexChange, onShowSizeChange } from 'ComponentExt';
import {defaultPageSize} from '../../env';

//编辑模式
import CourseTeamEdit from './course_team_edit';
//业务处理
import { courseTeamListQuery } from '../../actions/course';
import { allOrgUserQuery } from '../../actions/user';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class CourseTeamIndex extends React.Component{
  static navigationOptions = ({ navigation }) => {
      return {
          title: YSI18n.get('课程组管理'),
          headerRight: (
              <View row>
                  <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.params.onAdd()
                  }}>
                      <Image source={Assets.icons.add} />
                  </TouchableOpacity>
              </View>

          ),
      }
  }
  constructor(props) {
    super(props);
    props.navigation.setParams({
        onAdd: () => {
            //新增
            this.onLookView('Create', {})
        },

    });

    this.state = {
      data_list: [],

      onEdit: false,
      currentDataModel: null,
      editMode: 'Manage',//Edit,Create,View,Delete,Manage
    };
    (this: any).getData = this.getData.bind(this);
    (this: any).getAllUserData = this.getAllUserData.bind(this);
  }

  getData(){
    var that = this;
    this.props.courseTeamListQuery()
      //api调用成功
      .then((response) => {
        if(response.result){
          var _list = response.data.data_list;
          var _courses = response.data.all_course_list;

          this.setState({
            data_list: _list,
            all_course_list: _courses
          });
        }
      })
      //api调用失败,提示登录名或密码错误
      .catch((response) => {
        let { Toast } = this;
        Toast.fail(response.message || YSI18n.get('loginFailed'));
      })
  }
  getAllUserData(){
    var that = this;
    this.props.allOrgUserQuery()
      //api调用成功
      .then((response) => {
        if(response.result){
          var _list = response.data.data_list;

          this.setState({
            all_user_list: _list
          });
        }
      })
      //api调用失败,提示登录名或密码错误
      .catch((response) => {
        let { Toast } = this;
        Toast.fail(response.message || YSI18n.get('loginFailed'));
      })
  }

  componentWillMount() {
    this.getData();
    this.getAllUserData();
  }

  //浏览视图
  onLookView = (op, item) => {
      this.setState({
          editMode: op,//编辑模式
          currentDataModel: item,//编辑对象
      });
      switch (op) {
          case 'View':
              this.props.navigation.navigate('CourseTeamDetail', { currentDataModel: item });
              break;
      }
  };
  //视图回调
  viewCallback = (dataModel) => {
      if (dataModel) {
          //如果需要更新，则刷新
          if(dataModel.is_changed){
            this.getData();
          }
      }
      this.setState({ editMode: 'Manage' });
  }

  renderRow(row, id) {

    return (
      <ListItem
        activeBackgroundColor={Colors.dark60}
        activeOpacity={0.3}
        height={77.5}
        onPress={(item) => {
          if(row.auth_count > 0){
            this.onLookView('View', row)
          }
          else {
            this.onLookView('Create', row)
          }
        }}
        animation="fadeIn"
        easing="ease-out-expo"
        duration={1000}
        useNativeDriver

      >
        <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
            <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                <Text dark10 text70 numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>{row.CourseTeamName}</Text>
                <Text dark60 text90 style={{ marginTop: 2 }}>{row.TotalTeachers}个</Text>
            </ListItem.Part>
            <ListItem.Part>
                <Text style={{ flex: 1, marginRight: 10 }} text80 dark40 numberOfLines={1}>负责人：{row.LeaderName}</Text>
            </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  render() {
    var that = this;
    let block_listView = <ListView
        //dataSource={this.state.dataSource}
        dataSource={ds.cloneWithRows(this.state.data_list)}
        renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
    />

    let block_space = <View style={styles.block_space}></View>

    return (
        <View style={styles.container} paddingH-13 >

            {block_listView}

            {/* 编辑模式 */}
            <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                <View bg-white flex>
                    <CourseTeamEdit
                      editMode={'Create'}
                      currentDataModel={this.state.currentDataModel}
                      viewCallback={this.viewCallback}
                      all_course_list={this.state.all_course_list}
                      all_user_list={this.state.all_user_list}
                    />
                </View>
            </Modal>

            <YSToast ref={(toast) => this.Toast = toast} />
        </View>

    );
  }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
    },
    block_dot: {
        height: 4,
        width: 4,
    },
    list_wrap: {
        backgroundColor: 'transparent'
    },
    block_space:{
        height:23
    }

});

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
        courseTeamListQuery: bindActionCreators(courseTeamListQuery, dispatch),
        allOrgUserQuery: bindActionCreators(allOrgUserQuery, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(CourseTeamIndex);
