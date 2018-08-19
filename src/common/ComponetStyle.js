import YSColors from 'YSColors';
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index.native';
import ListStyle from 'antd-mobile-rn/lib/list/style/index.native';
import CardStyle from 'antd-mobile-rn/lib/card/style/index.native';
import CheckboxStyle from 'antd-mobile-rn/lib/checkbox/style/index.native'

//登录List样式
export const CustomLoginListStyle = {
  ...ListStyle,
  Body: {
    ...ListStyle.Body,
    borderTopWidth: 0,
  },
  BodyBottomLine: {
    ...ListStyle.BodyBottomLine,
    height: 1
  }
}
//List样式
export const CustomDateListStyle = {
  ...ListStyle,
  Body: {
    ...ListStyle.Body,
    borderTopWidth: 0,
  },

}

//输入框正常缺省样式  
export const InputItem_Normal_Style = {
  ...InputItemStyle,
  container: {
    ...InputItemStyle.container,
    marginLeft: 0,

  },
  input: {
    ...InputItemStyle.input,
    color: YSColors.default_color
  }

}

//输入框输入时样式  
export const InputItem_Focus_Style = {
  ...InputItemStyle,
  container: {
    ...InputItemStyle.container,
    marginLeft: 0,
    borderBottomColor: YSColors.AppMainColor
  },
  input: {
    ...InputItemStyle.input,
    color: YSColors.AppMainColor
  }

}

//验证出错样式
export const InputItem_Error_Style = {
  ...InputItemStyle,
  container: {
    ...InputItemStyle.container,
    marginLeft: 0,
    borderBottomColor: YSColors.vaildError

  },
  input: {
    ...InputItemStyle.input,
    color: YSColors.vaildError
  }

}

//验证成功样式
export const InputItem_Success_Style = {
  ...InputItemStyle,
  container: {
    ...InputItemStyle.container,
    marginLeft: 0,
    borderBottomColor: YSColors.vaildSuccess

  },
  input: {
    ...InputItemStyle.input,
    color: YSColors.vaildSuccess
  }

}

//登录List样式
export const CustomCardStyle1 = {
  ...CardStyle,
  body: {
    ...CardStyle.body,
    paddingVertical: 0,
    borderTopWidth: 0,
  },
  card: {
    ...CardStyle.card,
    borderWidth: 0,

  },
  headerWrap: {
    ...CardStyle.headerWrap,
    marginLeft: 0,

  }
}

export const CustomCardStyle2 = {
  ...CardStyle,
  card: {
    ...CardStyle.card,
    borderWidth: 0,

  },

  headerWrap: {
    ...CardStyle.headerWrap,
    marginLeft: 0,

  },
  body: {
    ...CardStyle.body,
    paddingVertical: 13
  }
}


export const CheckboxStyle1 = {
  ...CheckboxStyle,
  agreeItemCheckbox: {
    ...CheckboxStyle.agreeItemCheckbox,
    marginLeft: 0,
  },
 

}
