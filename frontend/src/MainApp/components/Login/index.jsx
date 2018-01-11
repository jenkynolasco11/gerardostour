import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Input } from 'react-toolbox/lib/input'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button/Button'

import { logUserIn } from '../../store-redux/actions'

import './login.scss'

class Login extends Component{
  constructor(props) {
    super(props)

    this.state = {
      username : '',
      password : ''
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
      <form onSubmit={ this._onSubmit } className="login-form">
        <Card className="login">
          <CardTitle title="Login"/>
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
            />
          </CardActions>
        </Card>
      </form>
      // </Layout>
    )
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
    login : (username, password) => logUserIn(username, password),
}, dispatch)

export default connect(null,mapDispatchToProps)(Login)