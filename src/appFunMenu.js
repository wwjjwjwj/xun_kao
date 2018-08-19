import { Assets } from 'react-native-ui-lib';
const AllMenuIcons = [
    //====================固定功能区域======================
    {
        key: 'WorkLog',
        routeName: 'departmentIndex',//路由对照表
        icon: Assets.workbench.ico1,
        name: '工作日志',
    },
    {
        key: 'FileCollection',
        routeName: 'fileCollection',//路由对照表
        icon: Assets.workbench.ico2,
        name: '文件收藏',
    },
    {
        key: 'Memo',
        routeName: 'memo',//路由对照表
        icon: Assets.workbench.ico3,
        name: '备忘录',
    },
    {
        key: 'Notice',
        routeName: 'notice',//路由对照表
        icon: Assets.workbench.ico4,
        name: '通知消息',
    },

    //====================动态功能区域======================
    {
        key: 'Others',//功能组
        icon: Assets.workbench.ico13,
        name: '其他',
        bgcolor: '#19BFA4',
    },
    {
        key: 'OU',//功能组
        icon: Assets.workbench.ico12,
        name: '组织架构管理',
        bgcolor: '#19BFA4',
    },
    {
        key: 'OU_DepartmentManage',
        routeName: 'departmentIndex',//路由对照表
        icon: Assets.workbench.ico5,
        name: '部门管理',
        bgcolor: '#19BFA4'
    },
    {
        key: 'OU_UserManage',
        routeName: 'employeeIndex',//路由对照表
        icon: Assets.workbench.ico6,
        name: '员工管理',
        bgcolor: '#29C5D2'
    },
    {
        key: 'OU_RoleManage',
        routeName: 'roleManageList',//路由对照表
        icon: Assets.workbench.ico7,
        name: '角色管理',
        bgcolor: '#2CB5F6'
    },
    {
        key: 'Schema',//功能组
        icon: Assets.workbench.ico14,
        name: '盟校体系管理',
        bgcolor: '#19BFA4',
    },
    {
        key: 'Schema_CourseManage',
        routeName: 'courseIndex',//路由对照表
        icon: Assets.workbench.ico8,
        name: '课程管理',
        bgcolor: '#FA5A55'
    },
    {
        key: 'Schema_SchoolManage',
        routeName: 'schoolIndex',//路由对照表
        icon: Assets.workbench.ico9,
        name: '盟校管理',
        bgcolor: '#FF7748'
    },
    {
        key: 'Schema_CourseAuthorityManage',
        routeName: 'courseAuthorityManage',//路由对照表
        icon: Assets.workbench.ico10,
        name: '课程授权管理',
        bgcolor: '#19BFA4'
    },
    {
        key: 'FileSystem_List',
        routeName: 'fileList',//路由对照表
        icon: Assets.workbench.ico11,
        name: '文件资料',
        bgcolor: '#19BFA4'
    },
    {
        key: 'Notification_Manage',
        routeName: 'noticeManage_index',//路由对照表
        icon: Assets.workbench.ico4,
        name: '通知消息管理',
        bgcolor: '#2CB5F6'
    },
]

export function getMenuIcon(menuInfo) {
    let { key } = menuInfo;
    let icon = AllMenuIcons.find(a => a.key == key);
    if (!icon) {
        icon = { icon: Assets.workbench.ico4, bgcolor: '#2CB5F6' }//default icon
    }
    return { ...menuInfo, ...icon }
}