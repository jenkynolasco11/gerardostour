import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Rte from './Route'

import { addSwitches } from '../../store-redux/actions'

export class Rtr extends Component{
  constructor(props) {
    super(props)

    this.state = {
      components : null,
      initial : '',
      which : '',
    }

    this._mapKeyToComponents = this._mapKeyToComponents.bind(this)
  }

  _mapKeyToComponents(children) {
    const self = this
    const components = {}
    const switches = []
    let initial = ''

    if(Array.isArray(children)) {
      let prefix = 1
      children.forEach( child => {
        let extr = ''

        if(child.props.initial) initial = child.props.name
        if(components[ child.props.name ]) extr = `-${ prefix++ }`

        components[ child.props.name + extr ] = child.props.component
        switches.push(child.props.name)
      })

      if(!initial) initial = children[ 0 ].props.name
    } else {
      initial = children.props.name
      components[ children.props.name ] = children.props.component
      switches.push(children.props.name)
    }

    setTimeout(() => self.props.addSwitches(switches), 10)
    return this.setState({ components, initial, which : initial })
  }

  componentWillMount() {
    const { children } = this.props

    if(children) this._mapKeyToComponents(children)
    else console.log('No children provided to Router. Are you sure you\'re doing it right?')
  }

  componentWillReceiveProps(nextProps) {
    const { which } = nextProps
    const { swhich } = this.state

    if( which !== swhich ) return this.setState({ which })
    console.log('it got here -> ', which, swhich )
  }

  render() {
    const { components, initial, which } = this.state

    if(components) {
      const Component = components[ which ? which : initial ]
      console.log(`Route: About to load: ${ which ? which : initial }` )
      // console.log(components, which, initial)
      return <Component />
    }

    // In case there is no component mounted
    return <div key="no-children" />
  }
}

const mapStateToProps = state => {
  const { which } = state.router

  return { which }
}

const mapDispatchToProps = dispatch => ({
  //
  addSwitches : switches => dispatch(addSwitches(switches))
})

Rtr.PropTypes = {
  which : PropTypes.string,
  // toggleMenu : PropTypes.func,
}

export const Router = connect(mapStateToProps, mapDispatchToProps)(Rtr)
export const Route = Rte

export default {
  Router,
  Route
}
