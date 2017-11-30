import React, { Component } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar'

import { showError, errorMessage } from '../../store-redux/actions'

class RTSnackBar extends Component{
  render() {
    const {
      isError,
      errorMsg,
      onSnackbarClearError
    } = this.props

    return (
      <Snackbar
        action="Dismiss"
        timeout={ 5000 }
        type="cancel"
        onTimeout={ onSnackbarClearError }
        onClick={ onSnackbarClearError }
        active={ isError }
        label={ errorMsg }
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onSnackbarClearError : () => {
    dispatch(showError(false))
    dispatch(errorMessage(''))
  }
})

const mapStateToProps = state => {
  const { isUserLoggedIn, isError } = state.app
  const { errorMsg } = state.meta

  return { isUserLoggedIn, isError, errorMsg }
}

export default connect(mapStateToProps, mapDispatchToProps)(RTSnackBar)