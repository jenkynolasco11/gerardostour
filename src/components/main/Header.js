import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import styles from './styles'

const LogoutButton = props => (
  <TouchableOpacity
    onPress={() => { props.logOut(props.id) }}
    activeOpacity={ 0.6 }
  >
    <View style={ styles.logout }>
      <Text style={ styles.logoutText }>{ 'Logout' }</Text>
    </View>
  </TouchableOpacity>
)

const HeaderContent = props => (
  <View style={ styles.headerContent }>
    <Text style={ styles.greeting }>{ `Hi, ${props.name}` }</Text>
    {/* <LogoutButton {...props} /> */}
  </View>
)

const Header = props => (
  <View style={ [styles.header] }>
    <View style={{ flex : 1, justifyContent : 'center' }}>
      <LogoutButton {...props}/>
    </View>
    <HeaderContent {...props}/>
  </View>
)

export default Header