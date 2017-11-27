import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Route = props => {
  const Component = props.component

  return <Component {...props.props} />
}

// class Route extends Component{
//   constructor(props) {
//     super(props)
//     console.log('Route works!')
//   }

//   render() {
//     const Component = this.props.component
//     return <Component { ...this.props.props }/>
//   }
// }

Route.PropTypes = { 
  component : PropTypes.func.isRequired,
  key : PropTypes.string
}

Route.defaultProps = {
  component : <div />,
  key : 'none'
}

export default Route