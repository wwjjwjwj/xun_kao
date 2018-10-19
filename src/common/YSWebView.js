/*
* @flow
* @providesModule YSWebView
*/

'use strict';

import {
  StyleSheet,
  View,
  WebView,
  Dimensions,
} from 'react-native';
import React from 'react';
import YSColors from 'YSColors';

const { width, height } = Dimensions.get('window');
//import YSLoading from 'YSLoading';

class YSWebView extends React.Component {
  state = {
    isLoading: true
  }
  render() {
    let url = this.props.url;
    //let block_loading =this.state.isLoading?<YSLoading />:null;
    if(url){
      return (
        <View style={styles.container}>
          <WebView
            style={{ width: width, height: height }}
            source={{ uri: url, method: 'GET' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            onLoadEnd={() => { this.setState({isLoading:false}) }}
          />
          {block_loading}
        </View>
      )
    }else if(this.props.source){
      return (
        <View style={styles.container}>
          <WebView
            style={{ width: width, height: height }}
            source={{ html: this.props.source, baseUrl: '' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            bounces={false}
            onLoadEnd={() => { this.setState({isLoading:false}) }}
          />
          {/*block_loading*/}
        </View>
      )
    }
    ;
  };
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
});
module.exports = YSWebView;
