import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import styles from './styles'

const PassengerInfo = props => (
  <View style={ [styles.passengerInfo, { flex : 1 }] }>
    <Text style={ styles.passengerTextIndex }>{ props.index }</Text>
    <Text style={ styles.passengerText }>{ props.name }</Text>
    <View />
  </View>
)

const PassengerAction = props => (
  <View style={ [styles.passengerActions, { flex : 1 }] }>
    <TouchableOpacity onPress={() => props.onPress('call')}>
      <View style={ styles.passengerActionsButton }>
        <Text style={ [styles.passengerText, { color : 'white'}] }> Call </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.onPress('sms')}>
      <View style={ styles.passengerActionsButton }>
        <Text style={ [styles.passengerText, { color : 'white'}] }> SMS </Text>
      </View>
    </TouchableOpacity>
  </View>
)

const PassengerCard = props => (
  <View style={ styles.passenger }>
    <PassengerInfo {...props}/>
    <PassengerAction {...props}/>
    <View style={ styles.separator }/>
  </View>
)

export default PassengerCard