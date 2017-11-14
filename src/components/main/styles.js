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
    height : height * 0.07,
    flexDirection : 'row',
    shadowOffset : { width : 0, height : 4},
    shadowOpacity : 0.06,
    shadowColor : 'black',
  },
  headerContent : {
    height : height * 0.07,
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  },
  greeting : {
    fontSize : 18,
  },
  logout : {
    marginLeft : 10,
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
  listItem : {
    backgroundColor : 'transparent',
    justifyContent : 'center',
    alignItems : 'center',
    paddingTop : 10,
    paddingBottom : 10,
    borderBottomColor : '#aaa',
    borderBottomWidth : 1,
  },
  errorText : {
    textAlign : 'center',
    color : 'red'
  },
  messageBox : {
    paddingTop : 40,
    flex : 1,
    backgroundColor : 'transparent',
    // justifyContent : 'center',
    alignItems : 'center',
  }
})

export default styles