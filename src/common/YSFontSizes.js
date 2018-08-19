/*
* 定义字体大小
* @flow
* @providesModule YSFontSizes
*/

import Dimensions from 'Dimensions';
import {
  Platform,
} from 'react-native';

const LOCATION_SIZES = {
  'TITLE': 20,
  'CONTENT': 12
};

if (Platform.isPad) {
  var scale = Dimensions.get('window').width / 750
} else {
  var scale = Dimensions.get('window').width / 375;
}

module.exports = {
  title: Math.round(20 * scale),
  content: Math.round(12 * scale),
  xs: Math.round(9 * scale),
  sm: Math.round(12 * scale),
  md:Math.round(14 * scale),
  lg:Math.round(16 * scale),
  xl:Math.round(18 * scale),
};
