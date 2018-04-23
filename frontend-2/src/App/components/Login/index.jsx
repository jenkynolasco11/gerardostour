import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { LOG_USER_IN } from '../../store/actions/app'

import './login.scss'

class Login extends Component {
    state = {
        user : '',
        pass : ''
    }

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(name, value) {
        return this.setState({ [ name ] : value })
    }

    onSubmit(e) {
        e.preventDefault()

        const { user, pass } = this.state

        if(user !== 'jenky' && pass !== '1234') return console.log('Nope!')

        return this.props.logUserIn({ user, pass })
    }

    render() {
        const { user, pass } = this.state

        return (
            <div className="login">
                <form method="POST" onSubmit={ this.onSubmit }>
                    <input type="text" placeholder="username" value={ user } onChange={ e => this.onChange('user', e.target.value) }/>
                    <input type="password" placeholder="password" value={ pass } onChange={ e => this.onChange('pass', e.target.value) }/>
                    <input type="submit" value="Login" />
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    logUserIn : data => LOG_USER_IN(data)
}, dispatch)

export default connect(null, mapDispatchToProps)(Login)
