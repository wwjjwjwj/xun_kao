'use strict';
import { Assets } from 'react-native-ui-lib';

Assets.loadAssetsGroup('logo', {
    app_logo: require('./assets/logo.png'),
});
Assets.loadAssetsGroup('login', {
  img_bg: require('./assets/img_login_bg.png'),
  icon_user: require('./assets/icon_user.png'),
  icon_pwd: require('./assets/icon_pwd.png'),
  icon_school: require('./assets/icon_school.png')
});

Assets.loadAssetsGroup('sex', {
    ico1: require('../assets/small_boy.png'),
    ico2: require('../assets/small_girl.png'),
});

Assets.loadAssetsGroup('icons', {
    search: require('../assets/nav_search.png'),
    add: require('../assets/nav_add.png'),
    edit: require('../assets/nav_compile.png'),
    addUserPhoto: require('../assets/add_image.png'),
    dropdown: require('../assets/chevronDown.png'),
    small_add: require('../assets/small_add.png'),
    link_color: require('../assets/small_link_color.png'),
    close: require('../assets/log_in_del_r.png'),
    add_file: require('../assets/add_file.png'),
    extra: require('../assets/small_into.png'),
    comment: require('../assets/comment.png'),
    activity: require('../assets/join_activity.png'),
    setting: require('../assets/nav_set.png'),
    del: require('../assets/log_in_del.png'),
    empty: require('../assets/big_memorandum_no.png'),
    remove: require('../assets/memorandum_delete.png'),
    attention_1: require('../assets/attention_normal.png'),
    attention_2: require('../assets/attention_active.png'),
    comment_g: require('../assets/comment_g.png'),
    commend_active: require('../assets/small_commend_active.png'),
    commend_normal: require('../assets/small_commend_normal.png'),
});

Assets.loadAssetsGroup('workbench', {
    ico1: require('../assets/log_book.png'),
    ico2: require('../assets/collect.png'),
    ico3: require('../assets/memo.png'),
    ico4: require('../assets/inform.png'),
    ico5: require('../assets/department.png'),
    ico6: require('../assets/staff_management.png'),
    ico7: require('../assets/role_management.png'),
    ico8: require('../assets/course_management.png'),
    ico9: require('../assets/franchisee.png'),
    ico10: require('../assets/authorization.png'),
    ico11: require('../assets/data.png'),
    ico12: require('../assets/organization_chart.png'),
    ico13: require('../assets/franchisee_school.png'),
    ico14: require('../assets/other.png'),
});
