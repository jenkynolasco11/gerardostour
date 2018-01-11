import React from 'react'
import {
  // ActionSheet,
  // Container,
  // Header,
  // Left,
  // Body,
  // Right,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
} from 'native-base'

import { connect } from 'react-redux'
// import { requestLogout } from '../../store/actions'

import styles from './styles'

// const BUTTONS = ['Log out', 'Cancel']
// const onPress = logout => (
//   ActionSheet.show({
//     destructiveButtonIndex : 0,
//     cancelButtonIndex : 1,
//     options : BUTTONS,
//     title : "Are you sure you want to log out?"
//   }, index => {
//     if(index === 0) return logout()
//   })
// )

const FooterComponent = props => {
  const { active } = props

  const textClr = { style : styles.textColor5 }
  const textIfInactive = { style : active ? styles.textWhite : styles.textInactive }
  const iconIfInactive = { style : active ? styles.textColor5 : styles.textInactive }

  return (
    <Footer style={[ styles.footer, styles.color3 ]}>
      <FooterTab>
        <Button
          onPress={ null }
          // disabled={ !active }
          style={ styles.color3 }
        >
          <Icon style={ styles.textColor5 } name="information-circle"/>
          <Text style={ styles.textWhite }> More Info </Text>
        </Button>
      </FooterTab>
      <FooterTab>
        <Button style={ styles.color3 }>
          <Icon style={ styles.textColor5 } name="qr-scanner"/>
          <Text style={ styles.textWhite }> Scanner </Text>
        </Button>
      </FooterTab>
      <FooterTab>
        <Button
          onPress={ null }
          disabled={ !active }
          style={ styles.color3 }
        >
          <Icon { ...iconIfInactive } name="play"/>
          <Text { ...textIfInactive }> Start Ride </Text>
        </Button>
      </FooterTab>
    </Footer>
  )
}

const mapStateToProps = state => {
  const { auth } = state

  return {
    active : auth.isActive
  }
}

const mapDispatchToProps = dispatch => ({
  // 
})

export default connect(mapStateToProps)(FooterComponent)