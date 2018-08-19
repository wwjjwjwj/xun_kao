/*
 * 盟校程授权首页
 * @flow
 * @providesModule CourseAuthIndex
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

import SearchForm from './searchForm';
//编辑模式
import CourseAuthEdit from './course_auth_edit';
//业务处理
import { courseAuthListQuery } from '../../actions/course';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class CourseAuthIndex extends React.Component{
  static navigationOptions = ({ navigation }) => {
      return {
          title: YSI18n.get('盟校课程授权管理'),
          headerRight: (
              <View row>
                  <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.params.onSearch()
                  }}>
                      <Image source={Assets.icons.search} />
                  </TouchableOpacity>
              </View>

          ),
      }
  }
  constructor(props) {
    super(props);
    props.navigation.setParams({
        onSearch: () => {
            //新增
            this.onLookView('Search', {})
        },

    });

    this.state = {
      pagingSearch: {
        pageIndex: 1,
        pageSize: defaultPageSize,
        organizationName: '',
        courseSpecialtys: ''
      },
      data_list: [],
      //dataSource: this.ds.cloneWithRows([]),
      data_list_total: 0,

      onEdit: false,
      currentDataModel: null,
      editMode: 'Manage',//Edit,Create,View,Delete,Manage
      showSearchData: false
    };
    //(this: any).getData = this.getData.bind(this);
    this.onPageIndexChange = onPageIndexChange.bind(this);
    this.onShowSizeChange = onShowSizeChange.bind(this);
    this.onSearch = onSearch.bind(this);
  }

  fetch(pagingSearch){
    var that = this;
    this.props.courseAuthListQuery(pagingSearch)
      //api调用成功
      .then((response) => {
        if(response.result){
          var _list = response.data.data_list;
          var _all_course = response.data.all_course_list;

          this.setState({
            data_list: _list,
            all_course_list: _all_course,
            //dataSource: that.ds.cloneWithRows(_list),
            data_list_total: 100
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
    this.onSearch();
  }

  //浏览视图
  onLookView = (op, item) => {
      this.setState({
          editMode: op,//编辑模式
          currentDataModel: item,//编辑对象
      });
      switch (op) {
          case 'View':
              this.props.navigation.navigate('courseAuthDetail', { currentDataModel: item, all_course_list: this.state.all_course_list });
              break;
      }
  };
  //视图回调
  viewCallback = (dataModel) => {
      if (dataModel) {
          //如果需要更新，则刷新
          if(dataModel.is_changed){
            this.onSearch();
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
                <Text dark10 text70 numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>{row.organization.OrganizationName}</Text>
                <Text dark60 text90 style={{ marginTop: 2 }}>{row.auth_count}个</Text>
            </ListItem.Part>
            <ListItem.Part>
                <Text style={{ flex: 1, marginRight: 10 }} text80 dark40 numberOfLines={1}>授权课程：{row.auth_count ? row.auth_courses.map(c => c.course.courseName + " ") : '暂无'}</Text>
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
    let block_search_title = <View row centerH marginV-40><Text text80 blue30 centerH >{YSI18n.get('以下为全部搜索内容')}</Text></View>
    let block_button_clear = <View row centerH marginV-40><Button
        label={YSI18n.get('清除搜索内容')}
        outline
        size='large'
        centerH
        onPress={() => this.setState({ showSearchData: false })}
        borderRadius={9}
        text60
        marginB-s4 />
    </View>

    let block_space = <View style={styles.block_space}></View>

    return (
        <View style={styles.container} paddingH-13 >

            {this.state.showSearchData && block_search_title}
            {block_listView}
            {this.state.showSearchData && block_button_clear}

            {this.state.data_list_total > this.state.pagingSearch.pageSize &&
              <YSpage
                onPageIndexChange={this.onPageIndexChange}
                pageIndex={this.state.pagingSearch.pageIndex}
                pageSize={this.state.pagingSearch.pageSize}
                data_list={this.state.data_list || []}
                data_list_total={this.state.data_list_total || 0}
              />
            }

            {/* 编辑模式 */}
            <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                <View bg-white flex>
                    <CourseAuthEdit
                      editMode={'Create'}
                      currentDataModel={this.state.currentDataModel}
                      viewCallback={this.viewCallback}
                      all_course_list={this.state.all_course_list}
                    />
                </View>
            </Modal>

            {/* 搜索模式 */}
            <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'fade'}>
                <View bg-white flex>
                    <SearchForm editMode={'Search'} current search={(result) => {
                        var pagingSearch = this.state.pagingSearch;
                        pagingSearch.pageIndex = 1;
                        pagingSearch.organizationName = result.organizationName;
                        pagingSearch.courseSpecialtys = result.courseSpecialtys.value;
                        this.setState({ showSearchData: 'true', editMode: 'Manage', pagingSearch: pagingSearch });
                        this.fetch(pagingSearch);
                      }}
                      viewCallback={(dataModel) => {
                        this.setState({ editMode: 'Manage' });
                      }}
                      all_course_list={this.state.all_course_list}
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
        courseAuthListQuery: bindActionCreators(courseAuthListQuery, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(CourseAuthIndex);
