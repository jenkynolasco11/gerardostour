import React from 'react'

import Table from './Table'

import './style.scss'

const CustomTable = props => {
  const { className = '' } = props

  return (
    <div className={ `custom-table ${ className }` }>
      <Table { ...props } />
    </div>
  )
}

export default CustomTable