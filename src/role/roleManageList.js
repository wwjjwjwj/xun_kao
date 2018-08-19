'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, StyleSheet, TouchableOpacity } from 'react-native';
import YSToast from 'YSToast';
import { LoaderScreen, ListItem, Avatar, Modal, View, Text, BasicList, BorderRadiuses, Badge, AvatarHelper, Button, Colors, ThemeManager, Image, Assets } from 'react-native-ui-lib';
import YSpage from 'YSpageControl';
//基本字典接口方法引入
import { loadDictionary } from '../actions/dictionary';
//组件实例模板方法引入
import { loadBizDictionary, onSearch, onPageIndexChange, onShowSizeChange } from 'ComponentExt';
//工具类方法引入
import YSI18n from 'YSI18n';
import { getDictionaryTitle } from 'Util';

//业务接口方法引入
import { getRoleList } from '../actions/role';
import { getUserMenus } from '../actions/user';
//业务数据视图（增、删、改、查)
import EditRole from './editRole';
// import SearchForm from './searchForm';

//列表展示
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class RoleManageList extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: YSI18n.get('RoleManage'),
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
    constructor(props: Props) {
        super(props);
        //组件初始化状态
        this.state = {
            currentDataModel: null,
            editMode: 'Manage',//Edit,Create,View,Delete
            pagingSearch: { pageIndex: 1, pageSize: 20, keyword: '', status: -1 },
            data_list: [],
            data_list_total: 0,
            loading: false,
        };
        //扩展方法用于本组件实例
        this.loadBizDictionary = loadBizDictionary.bind(this);
        this.onSearch = onSearch.bind(this);
        this.onPageIndexChange = onPageIndexChange.bind(this);
        this.onShowSizeChange = onShowSizeChange.bind(this);


        //导航头部事件注册
        props.navigation.setParams({
            onAdd: () => {
                //新增
                this.onLookView('Create', {})
            }
        })
    };

    componentWillMount() {
        //载入需要的字典项
        this.loadBizDictionary(['dic_Status']);
        //首次进入搜索，加载服务端字典项内容
        this.onSearch();

        //载入我的功能菜单
        this.props.getUserMenus().then((response) => {
            console.log(response.data)
        })
    }

    //调用api加载数据
    fetch = (pagingSearch) => {
        if (this.state.editMode === 'Manage') {
            this.setState({ loading: true })
        }
        this.props.getRoleList(pagingSearch)
            //api调用成功
            .then((response) => {
                this.setState({ ...response.data, loading: false })
            })
            //api调用失败,提示错误信息
            .catch((response) => {
                this.setState({ loading: false })
                let { Toast } = this;
                Toast.fail(response.message);
            })
    }

    //浏览视图
    onLookView = (op, dataModel) => {
        this.setState({
            editMode: op,//编辑模式
            currentDataModel: dataModel,//编辑对象
        });
        switch (op) {
            case 'View':
                //明细数据,回调
                this.props.navigation.navigate('roleDetail', { dataModel, viewCallback: this.onViewCallback });
                break;
        }
    };
    //视图回调
    onViewCallback = (dataModel, editMode) => {
        if (dataModel) {
            this.onSearch(true);//刷新数据
        }
        this.setState({ currentDataModel: null, editMode: 'Manage' })
    }

    renderRow(roleItem, id) {
        return (
            <ListItem
                activeBackgroundColor={Colors.dark60}
                activeOpacity={0.3}
                height={80}
                onPress={() => { this.onLookView('View', roleItem) }}
                animation="fadeIn"
                easing="ease-out-expo"
                duration={1000}
                containerStyle={styles.list_wrap}
                useNativeDriver
                style={{ backgroundColor: Colors.white }}
            >
                <ListItem.Part middle column containerStyle={[styles.border, { paddingHorizontal: 17 }]}>
                    <ListItem.Part containerStyle={{ marginBottom: 10 }}>
                        <View row flex-1 centerV>
                            <View style={styles.block_dot} bg-blue30 marginR-10 />
                            <Text dark10 text70 numberOfLines={1}>{roleItem.RoleName}</Text>
                        </View>
                        <Text dark60 text80 style={{ marginTop: 2 }}>{getDictionaryTitle(this.state.dic_Status, roleItem.Status)}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={{ flex: 1 }} text80 dark40 numberOfLines={1}>{YSI18n.get('RoleFuns')}:{roleItem.Functions} {YSI18n.get('RolePersons')}:{roleItem.Persons}</Text>
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        );
    }
    render() {
        let dataSource = ds.cloneWithRows(this.state.data_list);
        let block_listView = <ListView
            dataSource={dataSource}
            renderRow={(row, sectionId, rowId) => this.renderRow(row, rowId)}
        />
        return (
            <View style={styles.container}>
                {block_listView}
                {/* 分页控件 */}
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
                <Modal visible={this.state.editMode === 'Create'} animationType={'fade'}>
                    <View bg-white flex>
                        <EditRole editMode={'Create'} dataModel={{}} viewCallback={this.onViewCallback} />
                    </View>
                </Modal>
                {/* 数据加载动画 */}
                {this.state.loading &&
                    <LoaderScreen
                        color={Colors.blue30}
                        message={YSI18n.get('Loading')}
                        overlay
                    />}
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
        height: 18,
        width: 4,
    },
    list_wrap: {
        backgroundColor: 'transparent'
    }

});

const mapStateToProps = (state) => {
    //基本字典数据
    let { Dictionarys } = state.dic;
    return { Dictionarys };
};

function mapDispatchToProps(dispatch) {
    return {
        //基本字典接口
        loadDictionary: bindActionCreators(loadDictionary, dispatch),

        //各业务接口
        getRoleList: bindActionCreators(getRoleList, dispatch),
        getUserMenus: bindActionCreators(getUserMenus, dispatch),
    };
}
//redux 组件 封装
module.exports = connect(mapStateToProps, mapDispatchToProps)(RoleManageList);