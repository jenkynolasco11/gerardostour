import React from 'react'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import Checkmark from './Checkmark'

import './header.scss'

const Header = props => (
  <div className="table-header">
    <Checkmark onSelect={ props.onSelectAll } />
    {
      props.headerProps &&
      props.headerProps.map((header, i) => {
        const { sortOptions : sort } = props
        // const { sortBy = null, sortOrder = null } = sortOptions
        const selected = sort ? sort.sortBy === header.value : false
        const headerClassName = selected ? ' selected' : ''

        return (
          <div
            key={ i }
            className={ `table-header-item${ headerClassName }` }
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
            {
              selected &&
              <FontIcon value={ `arrow_${ sort.sortOrder === 1 ? 'upward' : 'downward' }` } />
            }
          </div>
        )
      })
    }
  </div>
)


export default Header
