import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer'
import { List, ListItem, ListDivider, ListSubHeader } from 'react-toolbox/lib/list'

import { toggleDrawer } from '../../store-redux/actions'

import linkList from './links-list.json'

const { links } = linkList

const SubList = props => (
  <List ripple>
    <ListSubHeader caption={ props.header }/>
    <ListDivider />
    {
      props.items.map((itm, i) => (
        <Link key={ i } to={ itm.route }>
          <ListItem caption={ itm.name } selectable onClick={ props.onOverlayClick }/>
        </Link>
      ))
    }
  </List>
)

class DrawerComponent extends Component{
  render() {
    const { isDrawerOpen, onOverlayClick } = this.props

    return (
      <NavDrawer active={ isDrawerOpen } onOverlayClick={ onOverlayClick } permanentAt="lg" scrollY>
        {
          links.map((link, i) => (
            // <ListItem></ListItem>
            <SubList key={i} { ...{ ...link, onOverlayClick }} />
          ))
        }
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

// TODO : USE DROPDOWN ON THIS ONE, INSTEAD OF THE USUAL LINK IN LISTITEM