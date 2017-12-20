import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProgressBar from 'react-toolbox/lib/progress_bar'

import './loader.scss'

class LoaderOverlay extends Component{
  render() {
    const { loading } = this.props

    return (
      <div className="custom-loader">
      {
        loading &&
        <div className="overlay">
          <ProgressBar
            type="circular"
            mode="indeterminate"
            multicolor
          />
        </div>
      }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { isLoading } = state.app

  return {
    loading : isLoading
  }
}

export default connect(mapStateToProps)(LoaderOverlay)