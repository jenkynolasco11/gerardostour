import React from 'react'
import Paginate from 'react-paginate'

import './paginate.scss'

const CustomPaginate = props => (
  <div className="table-pagination">
    <Paginate
      class
      breakLabel="..."
      pageCount={ Math.ceil(props.total / props.limit) }
      pageRangeDisplayed={ 3 }
      marginPagesDisplayed={ 1 }
      onPageChange={ props.onPaginate }
      forcePage={ props.skip }
      pageClassName="table-pagination-page"
    />
  </div>
)

export default CustomPaginate