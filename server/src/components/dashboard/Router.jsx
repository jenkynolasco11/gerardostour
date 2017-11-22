import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Router extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { which } = this.props

    return (
      <div />
    )
  }
}

Router.PropTypes = {
  which : PropTypes.string,
  // toggleMenu : PropTypes.func,
}

export default Router