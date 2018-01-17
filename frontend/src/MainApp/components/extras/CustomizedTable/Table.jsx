import React, { Component } from 'react'
// import Ripple from 'react-toolbox/lib/ripple/Ripple'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import Paginate from './Paginate'

// const RippableIcon = Ripple({ spread : 2 })(FontIcon)

const CheckMark = props => (
  <div className={ `checkmark${ props.isChecked ? ' checked' : '' }` } onClick={ props.onSelect }>
    <FontIcon value="check"/>
  </div>
  // <div className={ `checkmark${ props.isChecked ? ' checked' : '' }` } onClick={ props.onSelect }>
  //   <RippableIcon value="check"/>
  // </div>
)

class SearchBar extends Component{
  state = { searchQry : '', spanTop : false }

  constructor(props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onFocus = this._onFocus.bind(this)
  }

  _onChange(e) {
    const { value } = e.target

    return this.setState({ searchQry : value }, () => {
      const { onSearchChange = null } = this.props

      if(onSearchChange) return onSearchChange(value)
    })
  }

  _onFocus(spanTop) {
    return this.setState({ spanTop })
  }

  render() {
    const { spanTop, searchQry } = this.state
    const { rightDropDown : DropDown } = this.props
    const spanClass = `search-bar_placeholder${ spanTop || searchQry.length ? ' top' : '' }`
    const shouldCloseAppear = searchQry.length > 0
    const closeIconClass = `search-bar_icon close${ shouldCloseAppear ? ' appear' : '' }`

    return (
      <div className="search-bar">
        <div className="search-bar_input-field">
          <FontIcon value="search" className="search-bar_icon"/>
          <input
            placeholder="Check on server for a Date"
            className="search-bar_input"
            type="text"
            onChange={ this._onChange }
            value={ searchQry }
            onFocus={ () => this._onFocus(true) }
            onBlur={ () => this._onFocus(false) }
          />
          <span className={ spanClass }>Search</span>
          <FontIcon
            value="close"
            className={ closeIconClass }
            onClick={ () => this.setState({ searchQry : '' }) }
          />
          {
            DropDown &&
            <DropDown />
          }
        </div>
      </div>
    )
  }
} 

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
  state = { isClosed : true }

  constructor(props) {
    super(props)

    this._toggleContent = this._toggleContent.bind(this)
  }

  _toggleContent() {
    const { isClosed } = this.state

    return this.setState({ isClosed : !isClosed })
  }

  componentWillReceiveProps(/* props */) {
    return this.setState({ isClosed : true })
  }

  render() {
    const {
      colorToMatchRow = 'white',
      rowToMatchProp = null,
      selected,
      onSelectRow,
      item,
      headerProps,
      index,
      template,
      colorProps,
      colorPropToMatch
    } = this.props

    const { isClosed } = this.state

    const isSelected = selected.includes(index)
    const colorSign = colorProps && colorPropToMatch 
                      ? colorProps[ '' + item[colorPropToMatch] ] 
                      ? colorProps[ '' + item[colorPropToMatch] ]
                      : 'transparent'
                      : null

    const rowColor = item[ rowToMatchProp ] ? { backgroundColor : colorToMatchRow } : {}

    return (
      <div className={ `table-row${ isSelected ? ' selected' : '' }` }>
        <div className="table-row-content" style={ rowColor }>
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
          {
            colorSign &&
            <span className="colormark" style={{ backgroundColor : colorSign }} />
          }
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

class TableBody extends Component{
  render() {
    const { total = 0, limit = 10, onPaginate, skip = 0, data, onSearchChange = null, headerProps = [0,1,2,3] } = this.props

    return (
      <div className="table">
        <SearchBar onSearchChange={ onSearchChange }/>
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
            : // <div className="table-no-content"> There is no content available </div>
            [...Array(limit).keys()].map((_, i) => (
              <div key={ i }className="skeleton-data">
                {
                  [...headerProps].map((_, j) => (
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
              </div>
            ))
          }
        </div>
        <Paginate {...{ total, limit, skip, onPaginate }} />
      </div>
    )
  }
}

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