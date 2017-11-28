import React, { Component } from 'react'
import { Input } from 'react-toolbox/lib/input'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
// import Layout  from 'react-toolbox/lib/layout/Layout'
import Button from 'react-toolbox/lib/button/Button'

import './login.scss'

class Login extends Component{
  constructor(props) {
    super(props)

    this.state = {
      username : '',
      password : '',
    }

    this._onInputChange = this._onInputChange.bind(this)
  }

  _onInputChange(value, name) {
    this.setState({ [ name ] : value })
  }

  render() {
    return (
      // <Layout>
        <Card className="login">
          <CardTitle
            title="Login"
            subtitle="this should look pink"
          />
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
              label="Login"
              onClick={ () => console.log('button clicked!' )}
            />
          </CardActions>
        </Card>
      // </Layout>
    )
  }
}

export default Login