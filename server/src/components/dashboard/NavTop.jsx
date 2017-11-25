import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { retrieveCurrentUser, logUserOut, toggleMenu } from '../../store-redux/actions'

const BurgerMenu = props => {
  const { slideDash, isMenuOpen, toggle } = props

  return (
    <div 
      className="burger-menu"
      onClick={ () => {
        slideDash(isMenuOpen)
        props.toggle(!isMenuOpen)
      }}
    >
      <div className={`toggle-menu  ${ isMenuOpen ? 'open' : '' }`} />
    </div>
  )
}

const LogOutButton = props => (
  <div className="logout-button" onClick={ props.logout }>
    { 'Logout' }
  </div>
)

class NavBar extends Component{
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getLoggedUser()
  }

  render() {
    const { isMenuOpen, toggle, user, slideDash, logout } = this.props

    return (
      <nav className="navbar">
        <BurgerMenu {...{ isMenuOpen, toggle, slideDash }} />
        <div className="logged-user">
          { 
            user.firstname
            ? <span>
              { 
                `Hi, ${ user.firstname } ${ user.lastname }` 
              }
              </span>
            : <span> Retrieving user... </span>
          }
        </div>
        <LogOutButton {...{ logout }} />
      </nav>
    )
  }
}

NavBar.PropTypes = {
  //
  slideDash : PropTypes.func,
}

const mapStateToProps = state => {
  const { user, isMenuOpen } = state.meta

  return { user, isMenuOpen }
}

const mapDispatchToProps = dispatch => ({
  getLoggedUser : () => dispatch(retrieveCurrentUser()),
  logout : () => dispatch(logUserOut()),
  toggle : isOpen => dispatch(toggleMenu(isOpen)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)