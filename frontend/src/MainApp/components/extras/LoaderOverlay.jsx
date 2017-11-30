import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProgressBar from 'react-toolbox/lib/progress_bar'

import { fetchingStatus } from '../../store-redux/actions'

import './loaderstyle.scss'

class LoaderOverlay extends Component{
  render() {
    const {
      isError,
      errorMsg,
      onSnackbarClearError,
      loading = 1
    } = this.props

    return (
      <div 
        className="loader-overlay" 
        // style={{ opacity : loading ? '1' : '0' }}
      >
        <ProgressBar 
          type="linear"
          mode="indeterminate"
          multicolor
        />
      </div>
    )
  }
}

// const mapDispatchToProps = dispatch => ({
//   onSnackbarClearError : () => {
//     dispatch(showError(false))
//     dispatch(errorMessage(''))
//   }
// })

// const mapStateToProps = state => {
//   const { isFetching } = state.app

//   return { isFetching }
// }
export default LoaderOverlay
// export default connect(mapStateToProps)(LoaderOverlay)