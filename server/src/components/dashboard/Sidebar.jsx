import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { changeRoute } from '../../store-redux/actions'

const MenuItems = props => (
  <ul className="sidebar__menu-list">
   {
      props.items.map( (itm, indx) => (
        <li 
          onClick={ () => props.switchComp(itm) } 
          key={ indx } className={ 'sidebar__menu-list-item' }
        >
          <span>{ itm }</span>
        </li>
     ))
   }
  </ul>
)

/*
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
*/

class Sidebar extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { menuItems } = this.props
    return (
      <aside className={`sidebar ${ this.props.hidden ? 'closed' : '' }`}>
        <div className="sidebar__menu">
          <MenuItems items={ menuItems } switchComp={ this.props.switchComp } />
        </div>
      </aside>
    )
  }
}

const mapStateToProps = state => {
  const { switches } = state.router

  return { menuItems : switches }
}

const mapDispatchToProps = dispatch => ({
  //
  switchComp : which => dispatch(changeRoute(which)),
})

Sidebar.PropTypes = {
  switchComp : PropTypes.func,
  items : PropTypes.arrayOf(PropTypes.object),
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)