import React, { Component } from 'react'
import PropTypes from 'prop-types'

const MenuItems = props => (
  <ul className="sidebar__menu-list">
   {
      props.items.map( (itm, indx) => (
        <li key={ indx } className={ 'sidebar__menu-list-item' }>
          <a onClick={ e => props.switchComp(e, itm.name) } href={ itm.href }>
            { itm.name }
          </a>
        </li>
     ))
   }
  </ul>
)

const menuItems = [
  {
    name : 'dashboard',
    href : '/dashboard',
  },
  {
    name : 'user',
    href : '/user',
  },
  {
    name : 'rides',
    href : '/rides',
  },
  {
    name : 'driver',
    href : '/driver',
  },
]

class Sidebar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <aside className={`sidebar ${ this.props.hidden ? 'closed' : '' }`}>
        <div className="sidebar__menu">
          <MenuItems items={ menuItems } switchComp={ this.props.switchComp } />
        </div>
      </aside>
    )
  }
}

Sidebar.PropTypes = {
  switchComp : PropTypes.func,
  items : PropTypes.arrayOf(PropTypes.object),
}

export default Sidebar