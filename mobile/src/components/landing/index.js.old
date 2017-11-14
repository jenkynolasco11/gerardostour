import React, { Component } from 'react'

import { connect } from 'react-redux'

import Main from '../main'
import Auth from '../auth'

const Landing = props => {
  if(props.auth) return <Main />
  else return <Auth />
}

const mapStateToProps = state => ({
  auth : state.user.isAuth,
})

export default connect( mapStateToProps )(Landing)