/*
* 颜色值
* @flow
* @providesModule YSColors
*/

const LOCATION_COLORS = {
  'HERBST': '#00E3AD',
  'HERBST A': '#00E3AD',
  'HERBST B': '#00E3AD',
  'HACKER X': '#4D99EF',
  'HACKER Y': '#CF72B1',
  'COWELL': '#6A6AD5',
  'COWELL C': '#6A6AD5',
  'FOOD TENT': '#FFCD3B',
};

function colorForLocation(location: ?string): string {
  if (!location) {
    return 'black';
  }

  var color = LOCATION_COLORS[location.toUpperCase()];
  if (!color) {
    console.warn(`Location '${location}' has no color`);
    color = 'black';
  }
  return color;
}

function colorForTopic(count: number, index: number): string {
  const hue = Math.round(360 * index / (count + 1));
  return `hsl(${hue}, 74%, 65%)`;
}



module.exports = {

  darkText: '#000000',
  lightText: '#FFFFFF',
  whiteBackground: '#fff',
  splitlineColor: '#e6e6e6',
  default_bjcolor: '#f5f5f5',
  default_color: '#333',
  AppMainColor: '#74001A',
  disableButton:'#CCCCCC',
  placeHolderColor:'#CCCCCC',
  vaildSuccess:'#65c060',
  validError:'#fa5a55',
  unselectedTintColor:'#9A9394',
  graytext:'#666666',

  login: {
    bg: 'rgba(251, 251, 251, 1.0)',
    border: '#000000'
  }

};
