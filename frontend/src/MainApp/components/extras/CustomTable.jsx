import React, { Component } from 'react'
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'
import Paginate from 'react-paginate'

import { formatDate, formatHour, formatPhone } from '../../utils'

import './custom-table.scss'

const formatField = (val, key) => {
  // console.log('val => ', val)
  // console.log('key => ', key)
  switch(key) {
    case 'date' : 
      return formatDate(val)
    case 'time' :
      return formatHour(val)
    case 'phoneNumber' : 
      return formatPhone(val)
    default:
      return val
  }
}

class CustomTable extends Component { 
  constructor(props) {
    super(props)
    
    this.state = {
      selected : []
    }

    this.onRowSelect = this.onRowSelect.bind(this)
    this.renderNavigationBar = this.renderNavigationBar.bind(this)
  }

  onRowSelect(selected) {
    const { getSelectedRows } = this.props
    
    this.setState({
      selected : [].concat(selected)
    }, () => getSelectedRows(selected))
  }

  // getSelectedRows() {
    
  // }
  // onPageSelect(e) {
  //   console.log(e)
  //   // console.log()
  // }

  renderNavigationBar(pages) {
    const { skip = 0, onPaginate } = this.props

    return (
      <div className="table-pagination">
        <Paginate
          class
          breakLabel="..."
          pageCount={ pages }
          pageRangeDisplayed={ 3 }
          marginPagesDisplayed={ 1 }
          onPageChange={ onPaginate }
          forcePage={ skip }
          pageClassName="table-pagination-page"
        />
      </div>
    )
  }

  render() {
    const { data, header, count = 100, limit = 10, onSort } = this.props

    const pages = Math.ceil(count / limit)
    const headKeys = header.map(i => Object.values(i)[ 0 ])
    const dataKeys = header.map(i => Object.keys(i)[ 0 ] )

    return (
      <div className="table-content">
        <div className="table-content-data">
          <Table className="" multiSelectable onRowSelect={ this.onRowSelect }>
            <TableHead>
              {
                headKeys.map((itm, indx) => (
                  <TableCell
                    style={{ cursor : 'pointer' }}
                    key={ indx }
                    onClick={ () => onSort(dataKeys[ indx ]) }
                  > 
                    { itm }
                  </TableCell>
                ))
              }
            </TableHead>
            {
              // 0 &&
              data.map((row, indx) => 
                <TableRow key={ indx } selected={ this.state.selected.indexOf(indx) !== -1 }>
                {
                  dataKeys.map((key, i) => ( <TableCell key={ i }>{ formatField(row[ key ], key) }</TableCell> ))
                }
                </TableRow>
              )
            }
          </Table>
          { 
            data.length
            ? null
            : <div className="table-no-content"> There is no content available </div>
          }
          { this.renderNavigationBar(pages) }
        </div>
      </div>
    )
  }
}

export default CustomTable