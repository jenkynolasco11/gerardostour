import React from 'react'
import { Header, Left, Body, Right, Button, Icon, Text } from 'native-base'
import { connect } from 'react-redux'

import { showActionSheet } from '../../utils'

import styles from './styles'

const BUTTONS = ['Log out', 'Cancel']
const onPress = logout => {
  return showActionSheet(BUTTONS, { 0 : logout })
}

const HeaderComponent = props => {
  const { active, setActive, bus,/* fetchRides,*/ logout } = props

  return (
    <Header
      iosBarStyle="light-content"
      androidStatusBarColor="white"
      noShadow
      style={[ styles.header, styles.color3 ]}
    >
    
      <Left> 
        {/*
          active &&
          <Button
            transparent
            style={ styles.color3 }
            onPress={ () => fetchRides(bus) }
          >
            <Icon name="cloud-download" style={ styles.textWhite } />
          </Button>
        */}
      </Left>
      <Body>
        <Button
          style={[ active ? styles.color5 : styles.color2, styles.activeButton ]}
          active={ active }
          onPress={ () => setActive(bus, !active) }
        >
          <Icon name="power" style={ active ? styles.textWhite : styles.textColor5 }/>
          <Text>{ active ? 'Active' : 'Inactive' }</Text>
        </Button>
      </Body>
      <Right>
        <Button transparent onPress={ () => onPress(logout) }>
          <Icon name="log-out" style={ styles.textColor5 }/>
        </Button>
      </Right>
    </Header>
  )
}

export default HeaderComponent