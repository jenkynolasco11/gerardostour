import React, { Component } from 'react'

import TableBody from './Body'

class Table extends Component {
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