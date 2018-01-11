import React from 'react'
import { Actions } from 'react-native-router-flux'
import { Header, Left, Body, Right, Button, Icon, Text } from 'native-base'
// import { connect } from 'react-redux'

import { formatHour } from '../../utils'

import styles from './styles'

const HeaderComponent = props => {
  const { ride, rideId } = props

  return (
    <Header
      iosBarStyle="light-content"
      androidStatusBarColor="white"
      noShadow
      style={[ styles.header, styles.color3 ]}
    >
      <Left>
        <Button transparent onPress={ () => Actions.pop() }>
          <Icon name="arrow-back" style={ styles.textColor5 } />
        </Button>
      </Left>
      <Body>
        <Text style={ styles.textWhite }>
          { `Ride ${ rideId }` }
        </Text>
        {
          ride &&
          <Text note>
            { `From ${ ride.frm } to ${ ride.to }` }
          </Text>
        }
      </Body>
      <Right>
        { 
          ride &&
          <Text note>{ formatHour(ride.time) }</Text> 
        }
      </Right>
    </Header>
  )
}

export default HeaderComponent