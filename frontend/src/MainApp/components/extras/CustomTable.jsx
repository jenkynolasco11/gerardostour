import React, { Component } from 'react'
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'
import Paginate from 'react-paginate'

import './custom-table.scss'

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
    this.setState({ selected : [].concat(selected) })
  }

  onPageSelect(e) {
    console.log(e)
    // console.log()
  }

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
    const { data, header, count = 100, limit = 10 } = this.props
    const pages = Math.ceil(count / limit)
    const headKeys = header.map(i => Object.values(i)[ 0 ])
    const dataKeys = header.map(i => Object.keys(i)[ 0 ] )

    return (
      <div className="table-content">
        <div className="table-content-data">
          <Table className="" multiSelectable onRowSelect={ this.onRowSelect }>
            <TableHead>
              {
                headKeys.map((itm, indx) => <TableCell key={ indx }> { itm } </TableCell> )
              }
            </TableHead>
            {
              data.map((row, indx) => 
                <TableRow key={ indx } selected={ this.state.selected.indexOf(indx) !== -1 }>
                {
                  dataKeys.map((key, i) => ( <TableCell key={ i }>{ row[ key ] }</TableCell> ))
                }
                </TableRow>
              )
            }
          </Table>
        </div>
        { this.renderNavigationBar(pages) }
      </div>
    )
  }
}

export default CustomTable