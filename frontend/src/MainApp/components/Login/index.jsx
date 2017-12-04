import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'react-toolbox/lib/input'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button/Button'

import { tryLogin, /*checkAuthentication*/ } from '../../store-redux/actions'

import './login.scss'

class Login extends Component{
  constructor(props) {
    super(props)

    this.state = {
      username : 'jenky',
      password : 'lllll',
    }

    this._onInputChange = this._onInputChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _onInputChange(value, name) {
    this.setState({ [ name ] : value })
  }

  _onSubmit(e) {
    if(e) e.preventDefault()

    const { username, password } = this.state

    this.props.login(username, password)
  }

  render() {
    return (
      // <Layout>
      <form onSubmit={ this._onSubmit }>
        <Card className="login">
          <CardTitle title="Login" />
          <Input
            name="username"
            label="Username"
            type="text"
            value={ this.state.username }
            onChange={ value => this._onInputChange(value, 'username') }
            maxLength={ 16 }
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={ this.state.password }
            onChange={ value => this._onInputChange(value, 'password') }
          />
          <CardActions className="actions">
            <Button
              className="login-button"
              type="submit"
              label="Login"
              onClick={ this._onSubmit }
            />
          </CardActions>
        </Card>
      </form>
      // </Layout>
    )
  }

  // componentWillMount() {
  //   console.log('gotta check this guy out!')
  //   this.props.checkLogin()
  // }
}

const mapDispatchToProps = dispatch => {
  return {
    login : (username, password) => dispatch(tryLogin({ username, password})),
    // checkLogin : () => dispatch(checkAuthentication())
  }
}

export default connect(null,mapDispatchToProps)(Login)

// export default Login