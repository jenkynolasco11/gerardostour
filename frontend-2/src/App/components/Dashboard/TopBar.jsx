import React, { PureComponent as Component } from 'react'

import './topbar.scss'

class TopBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="topbar">
                <div>
                    <h4 className="topbar__title">Dashboard</h4>
                </div>
            </div>
        )
    }
}

export default TopBar
