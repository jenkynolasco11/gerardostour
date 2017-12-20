import React, { Component } from 'react'
// import { Ripple } from 'react-toolbox/lib/ripple'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import Paginate from './Paginate'

const CheckMark = props => (
  <div className={ `checkmark${ props.isChecked ? ' checked' : '' }` } onClick={ props.onSelect }>
    <FontIcon value="check"/>
  </div>
)

const TableHeader = props => (
  <div className="table-header">
    <CheckMark onSelect={ props.onSelectAll } />
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

class TableRow extends Component {
  state = {
    isClosed : true
  }

  constructor(props) {
    super(props)

    this._toggleContent = this._toggleContent.bind(this)
  }

  _toggleContent() {
    const { isClosed } = this.state

    return this.setState({ isClosed : !isClosed })
  }

  render() {
    const { selected, onSelectRow, item, headerProps, index, template } = this.props
    const { isClosed } = this.state

    const isSelected = selected.includes(index)

    return (
      <div className={ `table-row${ isSelected ? ' selected' : '' }` }>
        <div className="table-row-content">
          <CheckMark onSelect={ () => onSelectRow(index) } isChecked={ isSelected } />
          <div className="header" onClick={ this._toggleContent }>
            {
              headerProps.map((obj, i) => (
                <div 
                  key={ i } 
                  className="header-item" 
                  style={
                    obj.flex
                    ? { flex : obj.flex }
                    : {}
                  }
                >
                { item[ obj.value ] }
                </div>
              ))
            }
          </div>
        </div>
        <div className={ `table-row-content body${ isClosed ? ' closed' : '' }` }>
          {
            template
            ? React.cloneElement(template, item)
            : null
          }
        </div>
      </div>
    )
  }
}

const TableBody = props => {
  const { total = 0, limit = 10, onPaginate, skip = 0 } = props

  return (
    <div className="table">
      <TableHeader { ...props } />
      <div className="table-body">
        {
          props.data &&
          props.data.map(
            (item, i) => <TableRow key={ i } index={ i } item={ item } { ...props }/> 
          )
        }
        { 
          props.data &&
          props.data.length
          ? null
          : <div className="table-no-content"> There is no content available </div>
        }
      </div>
      <Paginate {...{ total, limit, skip, onPaginate }} />
    </div>
  )
}

class Table extends Component {
  // state = {
  //   selected : []
  // }

  constructor(props) {
    super(props)

    this._onSelectRow = this._onSelectRow.bind(this)
    this._onSelectAll = this._onSelectAll.bind(this)
  }

  _onSelectAll() {
    const { onRowSelect, data, selected } = this.props
    let newSelected = []

    if(!selected.length) newSelected = [].concat([...Array(data.length).keys()])

    if(onRowSelect) return onRowSelect(newSelected)
    return null
  }

  _onSelectRow(row) {
    const { onRowSelect, selected } = this.props
    let newSelected = []

    if(selected.includes(row)) newSelected = selected.filter(i => i !== row)
    else newSelected = [].concat(selected, row).sort((a,b) => a - b)
    
    if(onRowSelect) return onRowSelect(newSelected)
    return null
  }

  render() {
    return (
      <TableBody
        selected={ this.props.selected }
        onSelectAll={ this._onSelectAll }
        onSelectRow={ this._onSelectRow }
        { ...this.props }
      />
    )
  }
}

export default Table