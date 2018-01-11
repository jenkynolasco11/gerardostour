import React from 'react'
import { Footer, FooterTab, Button, Icon, Text } from 'native-base'

import { connect } from 'react-redux'
import { requestRides } from '../../store/actions'

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
  const { active, bus, fetchRides } = props

  const textClr = { style : styles.textColor5 }
  const textIfInactive = { style : active ? styles.textWhite : styles.textInactive }
  const iconIfInactive = { style : active ? styles.textColor5 : styles.textInactive }

  return (
    <Footer style={[ styles.footer, styles.color3 ]}>
      <FooterTab>
        <Button
          onPress={ () => fetchRides(bus)}
          disabled={ !active }
          style={ styles.color3 }
        >
          <Icon { ...iconIfInactive } name="bus"/>
          <Text { ...textIfInactive }> Rides </Text>
        </Button>
      </FooterTab>
      <FooterTab>
        <Button style={ styles.color3 }>
          <Icon style={ styles.textColor5 } name="settings"/>
          <Text style={ styles.textWhite }> Settings </Text>
        </Button>
      </FooterTab>
    </Footer>
  )
}

// const mapDispatchToProps = dispatch => ({
//   rides : bus => dispatch(requestRides(bus))
// })

// const mapStateToProps = state => {
//   const { auth } = state

//   return { active : auth.isActive, bus : auth.bus }
// }

export default FooterComponent//connect(mapStateToProps, mapDispatchToProps)(FooterComponent)