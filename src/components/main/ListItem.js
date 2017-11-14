import React from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native'
import styles from './styles'

const BASEURL = 'http://192.168.0.101:8000/api'

const ListItem = ({ index, ride, onPress }) => {
  const opacity = new Animated.Value(0)

  const { 
    id, 
    passengers, 
    status, 
    date 
  } = ride

  const enddate = new Date(date)
  const year = enddate.getFullYear()
  const month = ('0' + (enddate.getMonth() + 1)).slice(-2)
  const day = ('0' + (enddate.getDay() + 1)).slice(-2)

  const fulldate = `${ month }/${ day }/${ year }`

  return (
    <TouchableOpacity key={ index } onPress={ () => onPress(id) }>
      <Animated.View 
        style={ [styles.listItem, { opacity }] }
        onLayout={() => {
          Animated.timing(opacity, {
            toValue : 1,
            duration : 300,
            delay : 50 * index,
            easing : Easing.linear
          }).start()
        }}
      >
        <Text>{`Carrera #: ${ id }`}</Text>
        <Text>{`Cant. Pasajeros: ${ passengers }`}</Text>
        <Text>{`Estado: ${ status }`}</Text>
        <Text>{`Fecha completado: ${ fulldate }`}</Text>
        <View style={ styles.separator }/>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default ListItem