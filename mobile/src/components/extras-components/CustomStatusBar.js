import React from 'react'
import PropTypes from 'prop-types'
import { View, StatusBar } from 'react-native'

import styles from './styles'

const CustomStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[ styles.statusBar, { backgroundColor }] }>
    <StatusBar backgroundColor={ backgroundColor } {...props} />
    {
      props.header &&
      React.cloneElement(props.header)
    }
  </View>
)

CustomStatusBar.propTypes = {
  translucent : PropTypes.bool,
  animated : PropTypes.bool,
  barStyle : PropTypes.oneOf([ 'default', 'light-content', 'dark-content' ]),
  hidden : PropTypes.bool,
  networkActivityIndicatorVisible : PropTypes.bool,
  showHiddenTransition : PropTypes.oneOf([ 'slide', 'fade' ]),
  backgroundColor : PropTypes.string,
}

export default CustomStatusBar

// Example of background for status bar
/*
  import React, {
    Component,
  } from 'react';
  import {
    AppRegistry,
    StyleSheet,
    View,
    StatusBar,
    Platform,
  } from 'react-native';

  const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );

  class DarkTheme extends Component {
    render() {
      return (
        <View style={styles.container}>
          <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
          <View style={styles.appBar} />
          <View style={styles.content} />
        </View>
      );
    }
  }

  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
  const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    statusBar: {
      height: STATUSBAR_HEIGHT,
    },
    appBar: {
      backgroundColor:'#79B45D',
      height: APPBAR_HEIGHT,
    },
    content: {
      flex: 1,
      backgroundColor: '#33373B',
    },
  });

  AppRegistry.registerComponent('App', () => DarkTheme);
 */