import React, { PureComponent as Component } from 'react'
import { AppBar } from 'react-toolbox/lib/app_bar'

import './dashboard.scss'

class Dashboard extends Component {
    render() {
        return (
            <div className="dashboard">
                <AppBar />
            </div>
        )
    }
}

export default Dashboard
