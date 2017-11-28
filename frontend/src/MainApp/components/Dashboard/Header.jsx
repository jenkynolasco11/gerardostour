import React, { Component } from 'react'
import { MdMenu } from 'react-icons/lib/md/'

// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'

import { toggleDrawer } from '../../store-redux/actions'

class NavBar extends Component{
  render() {
    const { onMenuClick } = this.props
    
return (
      <AppBar
        title="Dashboard"
        onLeftIconClick={ onMenuClick }
        leftIcon={ <MdMenu /> }
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  //
  onMenuClick : () => dispatch(toggleDrawer(true))
})

const mapStateToProps = state => {
  const { isDrawerOpen } = state.app

return { isDrawerOpen }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)