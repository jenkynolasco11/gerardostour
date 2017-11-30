import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// import Drawer from 'react-toolbox/lib/drawer/Drawer'
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer'
import { List, ListItem, ListDivider, ListSubHeader } from 'react-toolbox/lib/list'

import { toggleDrawer } from '../../store-redux/actions'

import { connect } from 'react-redux'

const linkList = [
  // {
  //   header : 'consultas',
  //   items : ['viajes', 'tickets', 'rutas']
  // },
  {
    header : 'crear',
    items : [
      {
        name : 'Viajes',
        route : 'ride',
      },
      {
        name : 'Tickets',
        route : 'ticket'
      }
    ]
  },
]

const SubList = props => (
  // <List ripple selectable>
  [
    <ListSubHeader caption={ props.header }/>,
    <ListDivider />,
    // {
    props.items.map((itm, i) => (
      <Link key={ i } to={ `/${ itm.route }` }>
        <ListItem caption={ itm.name } selectable onClick={ props.onOverlayClick }/>
      </Link>
    ))
  ]
    // }
  // </List>
)

class DrawerComponent extends Component{
  render() {
    const { isDrawerOpen, onOverlayClick } = this.props

    return (
      <NavDrawer active={ isDrawerOpen } onOverlayClick={ onOverlayClick } permanentAt="lg" scrollY>
        <List ripple>
          {
            linkList.map((link, i) => (
              // <ListItem></ListItem>
              <SubList key={i} { ...{ ...link, onOverlayClick }} />
            ))
          }
        </List>
      </NavDrawer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  //
  onOverlayClick : () => dispatch(toggleDrawer(false))
})

const mapStateToProps = state => {
  const { isDrawerOpen } = state.app

  return { isDrawerOpen }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent)