import React from 'react'

import Checkmark from './Checkmark'

import './header.scss'

const Header = props => (
  <div className="table-header">
    <Checkmark onSelect={ props.onSelectAll } />
    {
      props.headerProps &&
      props.headerProps.map((header, i) => (
        <div
          key={ i }
          className="table-header-item"
          onClick={ () => props.onSort(header.value) }
          style={
            header.flex 
            ? { flex : header.flex }
            : {}
          }
        >
        <strong>
          { 
            header.label
            ? header.label
            : header.value
          }
        </strong>
        </div>
      ))
    }
  </div>
)


export default Header