import React from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native'
import styles from './styles'

const ListItem = ({ index, ride, onPress }) => {
  // TODO : This is an Anti-pattern
  const opacity = new Animated.Value(0)
  const key = index + 'lv'
  const { 
    id, 
    passengers, 
    status, 
  } = ride


  // console.log(ride)

  // const enddate = new Date(date)
  // const year = enddate.getFullYear()
  // const month = ('0' + (enddate.getMonth() + 1)).slice(-2)
  // const day = ('0' + (enddate.getDay() + 1)).slice(-2)

  // const fulldate = `${ month }/${ day }/${ year }`

  return (
    <TouchableOpacity key={key} onPress={ () => onPress(id, passengers) }>
      <Animated.View 
        key={ index + 'anmvew' }
        style={ [styles.listItem, { opacity }] }
        onLayout={() => {
          Animated.timing(opacity, {
            toValue : 1,
            duration : 300,
            delay : (20 * index) + 10,
            easing : Easing.linear
          }).start()
        }}
      >
        <Text style={ styles.listItemText }>{`Carrera #: ${ id }`}</Text>
        <Text style={ styles.listItemText }>{`Cant. Pasajeros: ${ passengers }`}</Text>
        <Text style={ styles.listItemText }>{`Estado: ${ status }`}</Text>
        {/* <Text style={ styles.listItemText }>{`Fecha completado: ${ fulldate }`}</Text> */}
        <View style={ styles.separator }/>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default ListItem