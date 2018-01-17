import React, { Component } from 'react'

import TableRow from './Row'
import SearchBar from './SearchBar'
import TableHeader from './Header'
import TablePaginate from './Paginate'

import './body.scss'

const skeletonRender = (rows, cols) => (
  [...Array(rows).keys()].map((_, i) => (
    <div key={ i }className="skeleton-data">
      {
        <React.Fragment>
          <div className="white-space" />
          {
            [...cols].map((_, j) => (
              <div
                key={ j }
                className="dummy"
                style={
                  _.flex
                  ? { flex : _.flex }
                  : {}
                }
              />
            ))
          }
        </React.Fragment>
      }
    </div>
  ))
)

class Body extends Component{
  render() {
    const { total = 0,
      limit = 10,
      onPaginate,
      skip = 0,
      data,
      onSearchChange = null,
      onSearchEnter = null,
      searchPlaceholderText = '',
      rightDropDown = null,
      headerProps = [0,1,2,3]
    } = this.props

    return (
      <div className="table">
        <SearchBar {...{ onSearchChange, onSearchEnter, rightDropDown, searchPlaceholderText }}/>
        <TableHeader { ...this.props } />
        <div className="table-body">
          {
            data &&
            data.map(
              (item, i) => <TableRow key={ i } index={ i } item={ item } { ...this.props }/> 
            )
          }
          { 
            data &&
            data.length
            ? null
            : skeletonRender(limit, headerProps)
          }
        </div>
        <TablePaginate {...{ total, limit, skip, onPaginate }} />
      </div>
    )
  }
}

export default Body