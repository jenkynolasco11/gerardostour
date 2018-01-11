import { StyleSheet, Dimensions } from 'react-native'

import Store from '../../store'

const { height, width } = Dimensions.get( 'window' )
const hwidth = width > height
               ? height
               : width

const { settings } = Store.getState()

// console.log(settings)

const styles = StyleSheet.create({
  login : { backgroundColor : settings.color1 },
  empty : { flex : 1 },
  content : {
    flex : 2 ,
    alignItems : 'center',
    justifyContent : 'center',
  },
  form : { width : 220 },
  input : {
    borderColor : 'white',
    marginTop : 12,
    textAlign : 'center',
  },
  underline : { borderColor : 'white' },  
  button : {
    marginTop : 40,
    backgroundColor : settings.color5
  },
  text : { color : 'white' },
  createdBy : {
    fontSize : 10,
    color : 'white',
    bottom : 10,
    position : 'absolute'
  }
})

export default styles