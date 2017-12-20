import React, { Component } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar'

import { showSnackBar } from '../../store-redux/actions'

class RTSnackBar extends Component{
  render() {
    const {
      showSnackbar,
      snackbarMessage,
      onSnackClose
    } = this.props

    return (
      <Snackbar
        action="Dismiss"
        timeout={ 5000 }
        type="cancel"
        onTimeout={ onSnackClose }
        onClick={ onSnackClose }
        active={ showSnackbar }
        label={ snackbarMessage }
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onSnackClose : () => dispatch(showSnackBar({ showSnackBar : false, snackbarMessage : '' }))
})

const mapStateToProps = state => {
  const { snackbarMessage, showSnackbar } = state.app

  return { snackbarMessage, showSnackbar }
}

export default connect(mapStateToProps, mapDispatchToProps)(RTSnackBar)