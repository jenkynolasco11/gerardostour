import {
  StyleSheet,
  Dimensions
} from 'react-native'

const { height, width } = Dimensions.get( 'window' )
const hwidth = width > height
            ? height
            : width

const styles = StyleSheet.create({
  login : {
    flex : 1,
    // alignSelf : 'stretch',
    backgroundColor : '#accecd',
    justifyContent : 'center',
    alignItems : 'center',
  },
  logo: {
    alignSelf : 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor : 'green'
  },
  inputs : {
    // backgroundColor : 'yellow',
    // alignSelf : 'center',
    // flex : 1,
    // alignItems: 'center',
    // justifyContent : 'center',
    // marginTop : 40,
  },
  input : {
    padding : 6,
    margin : 3,
    backgroundColor : '#eee',
    width : hwidth * 0.7,
    borderRadius : 2
  },
  button : { color : 'white' },
  // image : { width : width * 0.4 },
  // aligned : {
  //   marginTop : 10,
  //   justifyContent : 'center',
  //   flexDirection : 'row'
  // },
  loginButton : {
    backgroundColor : '#3563eb',
    // marginTop : 40,
    padding : 0,
    shadowColor : 'black',
    shadowOffset : { width: 0, height: 1 },
    shadowOpacity : 0.4,
    shadowRadius : 1,
  },
  trademark : {
    position : 'absolute',
    fontSize : 10,
    bottom : 30,
    color : 'white',
  },
  error : {
    // position : 'absolute',
    color : 'red',
  }
})

export default styles