/*
 * 通用设置宽高
 * @providesModule YSWHs
 * @flow
 */

import Dimensions from 'Dimensions';
import {
  Platform,
  PixelRatio
} from 'react-native';
const { width, height } = Dimensions.get('window');
if (Platform.isPad) {
  var scale = Dimensions.get('window').width / 750
} else {
  var scale = Dimensions.get('window').width / 375;
}

//设计图就是这个机型 iphone6
var scale_w = Dimensions.get('window').width / 375;
var scale_h = Dimensions.get('window').height / 667;

var density_basic = 2;  //设计图使用的iphone6的屏幕密度
var density_current = PixelRatio.get(); //当前设备屏幕密度
//设计图的单位是 px，而这里获取到的都是 pt/dp，所以需要转换
//dp = px / density
function to_dp(iphone6_px){
  var phone_current_px = iphone6_px / density_basic * density_current;

  var phone_current_dp = phone_current_px / density_current;

  return Math.round(phone_current_dp);

  //100 / 2 * 3 / 3
}

const header = Platform.OS == 'ios' ? 64 : 56
module.exports = {
  width: undefined,
  height: undefined,
  header_height: header,
  width_window: width,
  height_window: height,
  scale_rx: scale,
  borderWidth: 1,
  buttonHeight:48* scale,
  block_margin: Math.round(13 * scale),

  login: {
    front_top: to_dp(120),
    front_left: to_dp(32),

  }
};
