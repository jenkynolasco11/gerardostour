import React, { Component } from 'react'
import { 
  View, 
  Text,
  TextInput,
} from 'react-native'

import styles from './styles'

const DriverInfo = props => (
  <View style={ [ styles.aligned, styles.column ] }>
    <View style={ styles.aligned }>
      <Text style={ [ styles.textInfo, styles.text ] }>ID:</Text>
      <Text style={ [ styles.textResult] }>
        { 
          `${ ('00000000' + props.id).slice(-8) }` 
        }
      </Text>
    </View>
    <View style={ styles.aligned }>
      <Text style={ [ styles.textInfo, styles.text ] }>Name:</Text>
      <Text style={ [ styles.textResult ] }>{ `${ props.name }` }</Text>
    </View>
  </View>
)

const DriverRoute = props => (
  <View style={ [ styles.aligned, styles.column ] }>
      <View style={ styles.aligned }>
      <Text style={ [ styles.textInfo, styles.text ] }>From:</Text>
      <Text style={ [ styles.textResult ] }>{ `${ props.from || '-' }` }</Text>
    </View> 
    <View style={ styles.aligned }>
      <Text style={ [ styles.textInfo, styles.text ] }>To:</Text>
      <Text style={ [ styles.textResult ] }>{ `${ props.to || '-' }` }</Text>
    </View>
  </View>
)

const Driver = props => {
  const {
    id,
    name,
    from,
    to
  } = props

  return (
    <View style={ [ styles.flex_1, styles.headerInfo ] }>
      <DriverInfo {...{ name, id}}/>
      <DriverRoute {...{ from, to}}/>
    </View>
  )
}

export default Driver