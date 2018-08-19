/**
 * Created by Administrator on 4/14/2017.
 * @providesModule Menus
 * @flow
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  ListView
} from 'react-native';
import YSColors from 'YSColors';
import YSWHs from 'YSWHs';
import YSFontSizes from 'YSFontSizes';
import { BorderRadiuses, Colors, ThemeManager, ListItem, Text, View } from 'react-native-ui-lib';
import YSI18n from 'YSI18n';

class Menus extends React.Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    let menus = [
      { name: '课程组管理', url: 'courseTeamIndex' },
      { name: '教师管理', url: 'teacherIndex' },
      { name: '盟校授课管理', url: 'courseAuthIndex' },
      { name: '课程管理', url: 'courseIndex' },
      { name: '员工管理', url: 'employeeIndex' },
      { name: '部门管理', url: 'departmentIndex' },
      { name: '角色管理', url: 'roleManageList' },
      { name: '消息管理', url: 'messgeManageList' },
      { name: '接收消息', url: 'getMessgeList' },
      { name: '总部盟校管理', url: 'LeagueSchool' },
      { name: '我的备忘录', url: 'myBakeUpfile' },
      { name: '新闻详情', url: 'newsdetail' }

    ];
    this.state = {
      dataSource: ds.cloneWithRows(menus),
      onEdit: false,
      updating: false,
    };
  }

  onItemPressed(routeName) {
    this.props.navigation.navigate(routeName)
  }

  renderRow(row, id) {
    return (
      <ListItem
        activeBackgroundColor={Colors.dark60}
        activeOpacity={0.3}
        height={77.5}
        onPress={() => {
          this.onItemPressed(row.url)
        }}
        animation="fadeIn"
        easing="ease-out-expo"
        duration={1000}
        useNativeDriver
      >
        <ListItem.Part middle column containerStyle={[styles.border, { paddingRight: 17 }]}>
          <ListItem.Part containerStyle={{ marginBottom: 3 }}>
            <Text dark10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>{row.name}</Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  render() {
    return (
      <View paddingH-s2>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ThemeManager.dividerColor,
  },
});
module.exports = (Menus);
