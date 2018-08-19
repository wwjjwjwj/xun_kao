import DatePickerView from 'antd-mobile-rn/lib/date-picker-view/locale/en_US';
import DatePicker from 'antd-mobile-rn/lib/date-picker/locale/en_US';
import InputItem from 'antd-mobile-rn/lib/input-item/locale/en_US';
import Pagination from 'antd-mobile-rn/lib/pagination/locale/en_US';
import Picker from 'antd-mobile-rn/lib/picker/locale/en_US';
import SearchBar from 'antd-mobile-rn/lib/search-bar/locale/en_US';

const App = {
  Setting:'Setting',
  Tip: 'Tip',
  Pre: 'Pre',
  Next: 'Next',
  Total: 'Total ${total}',
  Loading: 'Loading...',
  Posting: 'Posting...',
  PostSuccess: 'Submitted successfully',
  Create: 'New',
  Edit: 'Edit',
  Delete: 'Delete',
  View: 'View',
  Detail: 'Detail',
  Cancel: 'Cancel',
  OK: 'OK',
  Save: 'Save',
  Search: 'Search',
  Select: 'Please Select',

  All: 'All',
  DeleteConfirmTitle: 'Delete Confirm',
  DeleteConfirmContent: 'Are you sure you want to delete this data?',


  //内置字典项
  Languages:'Languages',
  Languages_zh:'Chineses',
  Languages_en:'English',

  dic_Status_0: 'Enable',
  dic_Status_1: 'Disable',
  dic_YesNo_0: 'No',
  dic_YesNo_1: 'Yes',
  dic_Allow_0: 'Deny',
  dic_Allow_1: 'Allow',
  dic_Sex_1: 'male',
  dic_Sex_2: 'female',

  logout: 'logout',
  logout_tip: 'Are you sure you want to log out?',
  login: 'login',
  loginPending: 'login...',
  loginFailed: 'login failed',
  loginSuccess: 'login success',
  homePage: 'home page',


  news: 'News',
  news_full: 'News',
  my: 'My',
  workbench: 'Workbench',


  creator: 'creator',
  createdate: 'create date',
  auditor: 'auditor',
  auditdate: 'audit date',
  loading: 'loading...',
  read: 'read',

  // 资讯 开始
  evaluationtext: 'evaluation',
  followed: 'followed',
  just: 'just',
  minutesago: 'minutes ago',
  hoursago: 'hours ago',
  daysago: 'days ago',

  //角色管理
  RoleManage: 'Role Manage',
  RoleName: 'Role Name',
  RoleName_empty: 'Please input role name',
  RoleDescription: 'Role Description',
  RoleStatus: 'Role Status',
  RolePersons: 'Authorized number',
  RoleFuns: 'Functional authority',

    //消息通知
    Department:'Department',
    Employees:'Employees',
    School:'School',
    Parents: 'Parents',
    AddRecipient:'Add Recipient',
    Recipient:'Recipient',
    EmployeesText:'Employees(${receiveParamText})',
    DepartmentText:'Department(${receiveParamText})',
    SchoolText:'School(${receiveParamText})',
    Title:'Title',
    PleaseTitle:'Please Title',
    IsTop:'To Top',
    TopNum:'Top Num',
    Content:'Content',
    Savedraft:'Save draft',
    Photograph:'Taking picture',
    Photoalbum:'Photo album',
    HeadAll:'Head All',
    SchoolAll:'School All',
    ParentsAll:'Parents All',
    Post:'Post',
    Unread :'Unread',
    Read:'Read',
    HeadTotal:'Head Total(${this.state.data_list_total})',
    DepartmentTotal:'Department Total(${this.state.data_list_total})',
    SchoolTotal:'School Total(${this.state.data_list_total})',
    ParentsTotal:'Parents Total(${this.state.data_list_total})',
    Send:'Send',
    WaitSend:'WaitSend',
    Empty:'Please enter the text to search for related content',
    NoticeManage:'Notice Manage',
}
export default {
  locale: 'en',
  Pagination,
  DatePicker,
  DatePickerView,
  InputItem,
  Picker,
  SearchBar,
  //应用多语言
  App
};