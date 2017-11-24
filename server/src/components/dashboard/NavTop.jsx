import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { retrieveCurrentUser, logUserOut } from '../../store-redux/actions'

const BurgerMenu = props => (
  <div className="burger-menu" onClick={ props.toggle }>
    <div className={`toggle-menu  ${ props.closed ? '' : 'open' }`} />
  </div>
)

const LogOutButton = props => (
  <div className="logout-button" onClick={ props.logout }>
    { "Logout" }
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
    const { closed, toggle, user } = this.props
    return (
      <nav className="navbar">
        <BurgerMenu {...{ closed, toggle }} />
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
        <LogOutButton logout={ this.props.logout } />
      </nav>
    )
  }
}

NavBar.PropTypes = {
  hideMenu : PropTypes.bool,
  toggleMenu : PropTypes.func,
}

const mapStateToProps = state => {
  const { user } = state.meta

  return { user }
}

const mapDispatchToProps = dispatch => ({
  getLoggedUser : () => dispatch(retrieveCurrentUser()),
  logout : () => dispatch(logUserOut()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)