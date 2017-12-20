import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MdMenu } from 'react-icons/lib/md/'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Button from 'react-toolbox/lib/button/Button'

import { toggleDrawer, logUserOut } from '../../store-redux/actions'

const LogoutButton = props => (
  <Button
    className="logout-button"
    label="logout"
    onClick={ props.logout }
    style={{ color : 'white' }}
    mini
  />
)

class NavBar extends Component{
  render() {
    const { onMenuClick, logout } = this.props
    
  return (
      <AppBar
        // style={{ "z-index" : 1 }}
        title="Dashboard"
        onLeftIconClick={ onMenuClick }
        leftIcon={ <MdMenu /> }
        // fixed={ true }
        // scrollHide={ true }
      >
        <LogoutButton logout={ logout } />
      </AppBar>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onMenuClick : () => dispatch(toggleDrawer(true)),
  logout : () => dispatch(logUserOut())
})

const mapStateToProps = state => {
  const { isDrawerOpen } = state.app

  return { isDrawerOpen }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)