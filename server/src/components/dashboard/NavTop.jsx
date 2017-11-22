import React, { Component } from 'react'
import PropTypes from 'prop-types'

const BurgerMenu = props => (
  <div className="burger-menu" onClick={ props.toggle }>
    <div className={`toggle-menu  ${ props.closed ? '' : 'open' }`} />
  </div>
)

class NavBar extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { closed, toggle } = this.props
    return (
      <nav className="navbar">
        <BurgerMenu {...{ closed, toggle }} />
      </nav>
    )
  }
}

NavBar.PropTypes = {
  hideMenu : PropTypes.bool,
  toggleMenu : PropTypes.func,
}

export default NavBar