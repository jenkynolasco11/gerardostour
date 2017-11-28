import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Drawer from 'react-toolbox/lib/drawer/Drawer'

import { toggleDrawer } from '../../store-redux/actions'

import { connect } from 'react-redux'

class DrawerComponent extends Component{
  render() {
    const { isDrawerOpen, onOverlayClick } = this.props

    return (
      <Drawer active={ isDrawerOpen } onOverlayClick={ onOverlayClick } />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  //
  onOverlayClick : () => dispatch(toggleDrawer(false))
})

const mapStateToProps = state => {
  const { isDrawerOpen } = state.app

  return { isDrawerOpen }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent)