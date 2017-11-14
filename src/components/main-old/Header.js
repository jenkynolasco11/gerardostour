import React, { Component } from 'react'
import { View } from 'react-native'

import DriverInfo from './Driver'
import CustomButton from './CustomButton'

import styles from './styles'

const Header = props => {
  const {
    id,
    name,
    from,
    to
  } = props

  return (
    <View
      style={[
        styles.aligned,
        styles.flex_1,
        styles.header,
      ]}
    >
      <DriverInfo {...{id, name, from, to}} />
      <View style={ styles.buttons }>
        <CustomButton text={'Make Available'} onPress={props.makeAvailable}/>
        <CustomButton text={'Logout'} onPress={props.logout}/>
      </View>
    </View>
  )
}

export default Header