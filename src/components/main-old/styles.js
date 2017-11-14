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
  aligned : {
    display : 'flex',
    flexDirection : 'row',
    alignSelf : 'stretch'
  },
  textInfo : {
    width : width * 0.2,
    textAlign : 'right',
    marginRight : 10
  },
  column : {
    flexDirection : 'column'
  },
  button : {
    backgroundColor : '#3563eb',
    alignItems : 'center',
    justifyContent: 'center',
    marginTop : 5,
    // marginBottom : 20,
    // alignSelf : 'center',
    height : 30,
    width : width * 0.35,
    // right : 20,
    borderRadius : 4,
    // marginTop : -10
  },
  buttons : {
    marginTop : 10,
    flex : 1,
    // justifyContent : 'space-around',
    alignItems : 'center',
    // backgroundColor : 'red'
  },
  buttonText : {
    fontSize : width * 0.045
  },
  text : {
    color : 'white'
  },
  textResult : {
    color : secondColor
  },
  flex_1 : {
    flex : 1
  },
  flex_2 : {
    flex : 2
  },
  flex_3 : {
    flex : 3
  },
  flex_4 : {
    flex : 4,
  },
  header : {
    borderBottomWidth : 1,
    borderBottomColor : secondColor,
  },
  headerInfo : {
    justifyContent : 'center'
  }, 
  body : {
    // backgroundColor : 'yellow'
  }
})

export default styles