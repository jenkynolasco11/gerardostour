import React from 'react'
import { MdMenu } from 'react-icons/lib/md/'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Button from 'react-toolbox/lib/button/Button'

const LogoutButton = props => (
  <Button
    className="logout-button"
    label="logout"
    onClick={ props.logout }
    style={{ color : 'white' }}
    mini
  />
)

const Header = props => {
  const { onMenuClick, logout, headerTitle = '' } = props

  // console.log(headerTitle)

  return (
    <AppBar
      title="Dashboard"
      onLeftIconClick={ onMenuClick }
      leftIcon={ <MdMenu /> }
    >
      <h3 className="app-bar__title">{ headerTitle }</h3>
      <LogoutButton logout={ logout } />
    </AppBar>
  )
}

export default Header
