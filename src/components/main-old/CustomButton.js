import React from 'react'
import { 
  View,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native'

import styles from './styles'

const AvailableButton = props => {
  const buttonStyle = [
    styles.button
  ]

  if(props.bgColor) buttonStyle.push({bgColor})

  return (
  <TouchableOpacity 
    onPressOut={ props.onPress }
    activeOpacity={ 0.7 }
  >
    <View style={ [ buttonStyle ] }>
      <Text style={ [ styles.text, styles.buttonText ] }>
        { 
          props.text 
        }
      </Text>
    </View>
  </TouchableOpacity>
)}

export default AvailableButton