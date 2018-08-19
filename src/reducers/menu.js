'use strict';

const initialState = {
  items: [],
  roles: [],
  navpath: [],
  dailyFuns: [],//日常功能
};

function menu(state = initialState, action = {}) {
  switch (action.type) {
    case ('LOGGED_OUT'):
      {
        return {
          ...state,
          items: [],
          roles: [],
        }
      }
    case 'GET_ALL_MENU':
      {
        //根据情况设置菜单可见（仅显示app上支持的菜单）
        var allMenus = action.data.menus;
        allMenus.filter((a) => {
          var visible = false;
          if (!a.child) {
            visible = true;
          }
          (a.child || []).map((child) => {
            child.visible = (child.support || '').indexOf('app') != -1;
            visible = visible || child.visible;
          });
          a.visible = visible;
        })
        return {
          ...state,
          items: allMenus,
          roles: action.data.roles
        };
      }
    default:
      return state;
  }
}

module.exports = menu;