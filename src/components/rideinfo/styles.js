import { 
  StyleSheet,
  Dimensions
} from 'react-native'

const { width, height } = Dimensions.get('window')

const mainColor = '#accecd'
const secondColor = '#458d8b'

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : mainColor,
    paddingTop : 30,
  },
  header : {
    // backgroundColor : 'blue',
    height : height * 0.07,
    flexDirection : 'row',
    borderBottomWidth : 1,
    borderBottomColor : '#333333',
    alignItems : 'flex-end',
    // padding : 10,
  },
  headerContent : {
    height : height * 0.07,
    flex : 1,
    // backgroundColor : 'red',
    justifyContent : 'center',
    alignItems : 'center',
  },
  greeting : {
    // alignSelf : 'center',
    // flex : 1,
    fontSize : 18,
    // textAlign : 'center',
    // alignContent : 'center',
    // justifyContent : 'center',
    // alignItems : 'center',
  },
  logout : {
    width : width * 0.25,
    height : height * 0.06,
    backgroundColor : '#3563eb',
    borderRadius : 2,
    justifyContent : 'center',
    alignItems : 'center'
  },
  logoutText : { 
    color : 'white',
    fontSize : 14
  },
  body : {
    
  }
})

export default styles