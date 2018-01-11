import { StatusBar, StyleSheet, Platform } from 'react-native'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight

const styles = StyleSheet.create({
  statusBar : {
    height : STATUSBAR_HEIGHT,
  }
})

export default styles