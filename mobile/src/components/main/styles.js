import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native'

import Store from '../../store'

const { width, height } = Dimensions.get('window')

const { settings } = Store.getState()

const offset = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight
// const mainColor = '#accecd'
// const secondColor = '#458d8b'

const styles = StyleSheet.create({
  container : {
    flex : 1,
    paddingTop : 30,
  },
  header : {
    // backgroundColor : settings.color3,
    // ...Platform.select({
    //   ios : {
    //     shadowOffset : { height : 0, width : 0 },
    //     shadowOpacity : 0,
    //   }
    // }),
    borderBottomWidth : 0,
  },
  footer : { borderTopWidth : 0 },
  activeButton : { width : 144 },
  // Color themes
  color1 : { backgroundColor : settings.color1 },
  color2 : { backgroundColor : settings.color2 },
  color3 : { backgroundColor : settings.color3 },
  color4 : { backgroundColor : settings.color4 },
  color5 : { backgroundColor : settings.color5 },
  textWhite : { color : 'white'},
  textInactive : { color : 'gray' },
  textColor1 : { color : settings.textColor1 },
  textColor2 : { color : settings.textColor2 },
  textColor3 : { color : settings.textColor3 },
  textColor4 : { color : settings.textColor4 },
  textColor5 : { color : settings.textColor5 },
})

// export const statusBarColor = settings.color3

export default styles