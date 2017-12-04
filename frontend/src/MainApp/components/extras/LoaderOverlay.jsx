import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'

import './loader.scss'

class LoaderOverlay extends Component{
  render() {
    return (
      <div className="loader-overlay">
        <ProgressBar
          type="circular"
          mode="indeterminate"
          multicolor
        />
      </div>
    )
  }
}

export default LoaderOverlay