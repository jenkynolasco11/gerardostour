import React, { Component } from 'react'
import { MdMenu } from 'react-icons/lib/md/'

// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
// import Button from 'react-toolbox/lib/button/Button'
// import Navigation from 'react-toolbox/lib/navigation/Navigation'
// import Link from 'react-toolbox/lib/link/Link'
// import Ripple from 'react-toolbox/lib/ripple/Ripple'

import { toggleDrawer, logUserOut } from '../../store-redux/actions'

// const LogoutButton = props => (
//   <Button
//     className="logout-button"
//     label="logout"
//     onClick={ props.logout }
//     accent
//     mini
//   />
// )

// const mapToProps = dispatch => ({
//   logout : () => dispatch(logUserOut())
// })

// const RippleLink = Ripple({ spread : 2 })(
  
// )

// const RTLogout = connect(null, mapToProps)(LogoutButton)

class NavBar extends Component{
  render() {
    const { onMenuClick } = this.props
    
  return (
      <AppBar
        title="Dashboard"
        onLeftIconClick={ onMenuClick }
        leftIcon={ <MdMenu /> }
        // rightIcon={ <RTLogout /> }
      >
      {/*
        <Navigation type="horizontal">
          { Ripple }
        </Navigation>
      */}
      </AppBar>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onMenuClick : () => dispatch(toggleDrawer(true))
})

const mapStateToProps = state => {
  const { isDrawerOpen } = state.app

return { isDrawerOpen }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)