/*
 * 部门首页
 * @flow
 * @providesModule DepartmentIndex
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
import { Toast } from 'antd-mobile-rn';
import { defaultPageSize } from '../../env';
import YSpage from 'YSpageControl';

//编辑模式
import DepartmentEdit from './department_edit';
//搜索模式
import SearchForm from './searchForm';
//业务处理
import { departmentListQuery } from '../../actions/organization';

class DepartmentIndex extends React.Component{
  static navigationOptions = ({ navigation }) => {
      return {
          title: YSI18n.get('部门管理'),
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
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    props.navigation.setParams({
        onAdd: () => {
            //新增
            this.onLookView('Create', {})
        },
        onSearch: () => {
            //搜索
            this.onLookView('Search', {})
        }

    });
    this.all_department_list = [];
    this.state = {
      //departmentType: 1,    //从用户登录信息中取
      status: 1,
      data_list: [],

      dataSource: ds.cloneWithRows([]),
      onEdit: false,
      updating: false,
      currentDataModel: null,
      editMode: 'Manage',//Edit,Create,View,Delete,Manage
      pageIndex: 1,
      //all_department_list: []
    };
    (this: any).getData = this.getData.bind(this);
  }

  getData(){
    var that = this;
    this.props.departmentListQuery(this.state.status, this.state.pageIndex, defaultPageSize)
      //api调用成功
      .then((response) => {
        if(response.result){
          var _list = response.data.data_list;

          this.setState({
            data_list: _list,
          });

          _list.map(node => {
            that.departDataIterator(node);
          })

        }
      })
      //api调用失败,提示登录名或密码错误
      .catch((response) => {
        Toast.fail(response.message || YSI18n.get('loginFailed'));
      })
  }

  componentWillMount() {
    this.getData();
  }

  //浏览视图
  onLookView = (op, item) => {
      this.setState({
          editMode: op,//编辑模式
          currentDataModel: item,//编辑对象
      });
      switch (op) {
          case 'View':
              this.props.navigation.navigate('DepartmentDetail', { department: item, all_department_list: this.all_department_list });
              break;
          case 'Search':
              this.setState({ editMode: 'Search' })
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

  departDataIterator(node: Object){
    if(!node){
      return null;
    }
    var that = this;
    if(node.Department){
      var a_d_list = this.all_department_list;

      a_d_list.push({
        value: node.Department.DepartmentID,
        title: node.Department.DepartmentName,
        parent_value: node.Department.ParentID
      });
      this.all_department_list = a_d_list

      if(node.Child){
        node.Child.map((_node, i) => {
          that.departDataIterator(_node);
        })
      }

    }
  }

  departIterator(node: Object){
    if(!node){
      return null;
    }
    var that = this;
    if(node.Department){
      var node_children = [];
      var node_info =
        <TouchableOpacity onPress={() => this.onLookView('View', node.Department)}>
            <View row spread flex-1 marginT-22>
              {node.Department.ParentID == '00000000-0000-0000-0000-000000000000' ?
                <View row centerV>
                    <View style={styles.block_dot} bg-blue30 marginR-10 />
                    <Text dark10 text70 numberOfLines={1}>{node.Department.DepartmentName}</Text>
                </View>
                :
                <View row centerV marginL-40>
                    <View style={styles.block_dot} bg-blue30 marginR-10 />
                    <Text dark10 text70 numberOfLines={1}>{node.Department.DepartmentName}</Text>
                </View>
              }
                <Text text80 dark40>{node.Department.Status == 1 ? '启用' : '停用'}</Text>
            </View>
        </TouchableOpacity>
      if(node.Child){
        node.Child.map((_node, i) => {
          var node_child = that.departIterator(_node);
          node_children.push(node_child);
        })
      }
      return (
        <View key={node.Department.DepartmentID}>
          {node_info}
          {node_children}
        </View>
      )
    }
  }

  render() {

    var that = this;
    var block_content = this.state.data_list.map((data, index) => {
      return that.departIterator(data);
    });

    let block_space = <View style={styles.block_space}></View>

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

    return (
        <View style={styles.container} paddingH-13 >

            {/* 搜索返回结果列表才显示 */}
            {this.state.showSearchData && block_search_title}

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {block_content}
                {block_space}
            </ScrollView>

            {/* 搜索返回结果列表才显示 */}
            {this.state.showSearchData && block_button_clear}

            {/* 编辑模式 */}
            <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Create'} animationType={'fade'}>
                <View bg-white flex>
                    <DepartmentEdit
                      editMode={'Create'}
                      //currentDataModel={this.state.currentDataModel}
                      viewCallback={this.viewCallback}
                      all_department_list={this.all_department_list}
                    />
                </View>
            </Modal>

            {/* 搜索模式 */}
            <Modal onRequestClose={this.viewCallback} visible={this.state.editMode === 'Search'} animationType={'fade'}>
                <View bg-white flex>
                    <SearchForm editMode={'Search'} current search={() => {
                          this.setState({ showSearchData: 'true', editMode: 'Manage' });
                        }}
                        viewCallback={(dataModel) => {
                            this.setState({ editMode: 'Manage' });
                        }}
                        all_department_list={this.all_department_list}
                    />
                </View>
            </Modal>
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
        departmentListQuery: bindActionCreators(departmentListQuery, dispatch),
    };
}
module.exports = connect(select, mapDispatchToProps)(DepartmentIndex);
