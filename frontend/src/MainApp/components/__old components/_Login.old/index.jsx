import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'

const main = document.getElementById('main')

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password : '',
      username : '',
      isError : false,
      errorMessage : ''
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e, which) {
    let { password, username } = this.state

    if(which === 'u') username = e.target.value
    else password = e.target.value

    return this.setState({ password, username })
  }

  async onSubmit(evnt) {
    evnt.preventDefault()
    const { username, password } = this.state
    const self = this

    // Sanitize this shyte!!
    const inputs = { username, password }

    function error(errorMessage) {
      self.setState({ errorMessage, isError : true })
      return setTimeout(() => self.setState({ errorMessage : '', isError : false }), 5000)
    }

    try {
      const { data } = await axios.post('/admin/auth/login', inputs)

      if(data.ok) return window.location.href += '/admin/auth'

      return error(data.msg)
      // return this.setState({ errorMessage : data.msg, isError : true })
    } catch (e) {
      // console.log('Error!!!!!!!!!!!!!!', e) 
      // this.setState({ errorMessage : e.message, isError : true })
      return error('Error at the server. Please try again later.')
    }
  }

  renderError(msg) {
    // console.log(msg)
    return <p>{ msg }</p>
  }

  render() {
    // console.log('rendering!!')
    const { password, username, isError, errorMessage } = this.state
    // console.log(this.state)
    return (
      <form className="login">
        <input name="username" onChange={ e => this.onChange(e, 'u') } placeholder="Username" type="text" value={ username }/>
        <input name="password" onChange={ e => this.onChange(e, 'p') } placeholder="Password" type="password" value={ password }/>
        <input type="submit" value="Login" onClick={ this.onSubmit } />
        { isError ? this.renderError(errorMessage) : null }
      </form>
    )
  }
}

render(<LoginForm />, main)

// export default LoginForm