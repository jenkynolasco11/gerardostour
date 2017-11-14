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
  nav : {
    shadowOffset : { width : 0, height : 4 },
    shadowOpacity : 0.06,
    shadowColor : 'black',
    alignItems : 'center',
    flexDirection : 'row',
    justifyContent : 'space-between',
    // justifyContent : 'center',
    height : height * 0.07,
    paddingRight : 20,
    paddingLeft : 20,
  },
  backButton : {
    // marginLeft : 20,
    color : 'blue',
    fontSize : 16,
  },
  infoName : {
    color : 'white',
    fontSize : 20,
    // textAlign : 'flex-end',
    // marginRight : 20
  },
  passengerInfo : {
    alignItems : 'center',
    paddingRight : 20,
    paddingLeft : 20,
    flexDirection : 'row',
    justifyContent : 'space-between'
  }, 
  passengerActions : {
    alignItems : 'center',
    justifyContent : 'space-around',
    flexDirection : 'row',
    // backgroundColor : 'red',
  }, 
  passengerActionsButton : {
    borderRadius : 2,
    alignItems : 'center',
    justifyContent : 'center',
    height : height * 0.05,
    width : width * 0.3,
    backgroundColor : '#3563eb',
  }, 
  passengerText : {
    color : 'white',
    fontSize : 22,
  },
  passengerTextIndex : {
    fontSize : 16,
  },
  passenger : {
    height : height * 0.22,
  },
  separator : {
    backgroundColor : '#f3f3f3',
    marginTop : 3,
    marginBottom : 3,
    height : 1,
    // flex : 1,
  },
})

export default styles