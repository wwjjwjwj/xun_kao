import DatePickerView from 'antd-mobile-rn/lib/date-picker-view/locale/zh_CN';
import DatePicker from 'antd-mobile-rn/lib/date-picker/locale/zh_CN';
import InputItem from 'antd-mobile-rn/lib/input-item/locale/zh_CN';
import Pagination from 'antd-mobile-rn/lib/pagination/locale/zh_CN';
import Picker from 'antd-mobile-rn/lib/picker/locale/zh_CN';
import SearchBar from 'antd-mobile-rn/lib/search-bar/locale/zh_CN';


const App = {
  Setting: '设置',
  Tip: '提示',
  Pre: '上一页',
  Next: '下一页',
  Total: '共${total}条数据',
  Loading: '加载中...',
  Posting: '提交中...',
  PostSuccess: '操作成功',
  Create: '新增',
  Edit: '编辑',
  Delete: '删除',
  View: '查看',
  Detail: '详情',
  Cancel: '取消',
  OK: '确定',
  Save: '保存',
  Search: '搜索',
  Select: '请选择',
  All: '全部',

  Languages: '多语言',
  Languages_zh: '中文',
  Languages_en: '英文',

  dic_Status_0: '启用',
  dic_Status_1: '停用',
  PleaseInput: '请输入内容',
  PleaseChoose: '请选择',
  DeleteConfirmTitle: '删除确认',
  DeleteConfirmContent: '你确定要删除吗?',

  //内置字典项
  dic_Status_0: '停用',
  dic_Status_1: '启用',
  dic_YesNo_0: '否',
  dic_YesNo_1: '是',
  dic_Allow_0: '拒绝',
  dic_Allow_1: '允许',
  dic_Sex_1: '男',
  dic_Sex_2: '女',


  logout: '退出登录',
  logout_tip: '你确定要退出登录吗？',
  login: '登录',
  loginPending: '登录中...',
  loginFailed: '登录失败',
  loginSuccess: '登录成功',
  account: '账号',
  account_tips: '请输入账号',
  account_empty: '登录账号不能为空',
  account_error: '登录账号为12位员工号',
  password: '密码',
  password_tips: '请输入密码',
  password_empty: '密码不能为空',
  password_error: '密码不能少于6位',
  homePage: '首页',

  news: '动态',
  news_full: '神墨动态',
  my: '我',
  workbench: '工作台',


  creator: '创建人',
  createdate: '创建日期',
  auditor: '审核人',
  auditdate: '审核日期',
  loading: '数据加载中...',
  read: '阅读',

  // 资讯 开始
  evaluationtext: '评论',
  followed: '已关注',
  just: '刚刚',
  minutesago: '分钟前',
  hoursago: '小时前',
  daysago: '天前',

  //角色管理
  RoleManage: '角色管理',
  RoleName: '角色名称',
  RoleName_empty: '角色名称为空',
  RoleDescription: '角色描述',
  RoleStatus: '角色状态',
  RolePersons: '授权人数',
  RoleFuns: '功能权限',

  //消息通知
  Department:'部门',
  Employees:'员工',
  School:'盟校',
  Parents: '家长',
  AddRecipient:'添加接收人',
  Recipient:'接收人',
  EmployeesText:'员工(${receiveParamText})',
  DepartmentText:'部门(${receiveParamText})',
  SchoolText:'盟校(${receiveParamText})',
  Title:'标题',
  PleaseTitle:'请输入标题',
  IsTop:'是否置顶',
  TopNum:'置顶天数',
  Content:'内容',
  Savedraft:'存储草稿',
  Photograph:'拍照',
  Photoalbum:'从手机相册选择',
  HeadAll:'总部(全部)',
  SchoolAll:'盟校(全部)',
  ParentsAll:'家长(全部)',
  Post:'提交',
  Unread :'未阅读',
  Read:'已阅读',
  HeadTotal:'总部(${this.state.data_list_total}人)',
  DepartmentTotal:'部门(${this.state.data_list_total}人)',
  SchoolTotal:'盟校(${this.state.data_list_total}人)',
  ParentsTotal:'家长(${this.state.data_list_total}人)',
  Send:'已发送',
  WaitSend:'待发送',
  Empty:'请输入文字搜索相关内容',
  NoticeManage:'通知消息管理',
}

export default {
  locale: 'zh',
  Pagination,
  DatePicker,
  DatePickerView,
  InputItem,
  Picker,
  SearchBar,

  App,
};