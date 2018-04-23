import React, { PureComponent as Component } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/lib/fa'

import './sidebar.scss'

class SideBar extends Component {
    state = { isOpen : false }

    constructor(props) {
        super(props)

        this._toggleMenu = this._toggleMenu.bind(this)
    }

    _toggleMenu() {
        const { isOpen } = this.state

        return this.setState({ isOpen : !isOpen })
    }

    render() {
        const { isOpen } = this.state

        return (
            <div className={ `sidebar${ isOpen ? ' is-open' : '' }` }>
                <div className="sidebar__logo">
                    <h4>Gerardo Transportation</h4>
                </div>
                <div className="sidebar__toggle-button" onClick={ this._toggleMenu }>
                    {
                        isOpen
                        ? <FaChevronRight />
                        : <FaChevronLeft />
                    }
                </div>
            </div>
        )
    }
}

export default SideBar
