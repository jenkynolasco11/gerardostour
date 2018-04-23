import React from 'react'
import { Link } from 'react-router-dom'
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer'
import { List, ListItem, ListDivider, ListSubHeader } from 'react-toolbox/lib/list'
import { Link as NavLink } from 'react-toolbox/lib/link'

import linkList from './links-list.json'

const { links } = linkList

const SubList = props => (
  <List ripple>
    <ListSubHeader caption={ props.header }/>
    <ListDivider />
    {
      props.items.map((itm, i) => (
        <Link key={ i } to={ itm.route }>
          <ListItem caption={ itm.name } selectable onClick={ props.onOverlayClick } leftIcon={ itm.iconName } />
        </Link>
      ))
    }
  </List>
)

const DrawerComponent = props => {
  const { isDrawerOpen, onOverlayClick } = props

  return (
    <NavDrawer active={ isDrawerOpen } onOverlayClick={ onOverlayClick } permanentAt="lg" scrollY>
      {
        links.map((link, i) => (
          <SubList key={i} { ...{ ...link, onOverlayClick }} />
        ))
      }
    </NavDrawer>
  )
}

export default DrawerComponent

// TODO : USE DROPDOWN ON THIS ONE, INSTEAD OF THE USUAL LINK IN LISTITEM
