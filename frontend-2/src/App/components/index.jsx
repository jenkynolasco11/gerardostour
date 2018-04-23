import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'

// import { LOG_USER_IN } from '../store/actions/app'

// import Login from './Login'
import Dashboard from './Dashboard'

import './styles.scss'

class Main extends Component {
    render() {
        return <Dashboard />
    }
}

const mapStateToProps = state => {
    const { app } = state

    return {
        isLoggedIn : app.isLoggedIn
    }
}

export default connect(mapStateToProps)(Main)
