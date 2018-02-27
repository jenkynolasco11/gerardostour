import React, { Component } from 'react'
import tooltip from 'react-toolbox/lib/tooltip'

import Checkmark from './Checkmark'

const ToolTipSpan = tooltip(props => <span { ...props } /> )

const Span = ({ item, style }) => (
  <ToolTipSpan
    tooltipPosition="left"
    className="colormark"
    style={ style }
    tooltip={ item.type ? item.type : item.status }
  />
)

class Row extends Component{
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
      colorPropToMatch,
      tooltipText = '',
      badge
    } = this.props

    const { isClosed } = this.state

    const isSelected = selected.includes(index)
    const colorSign = colorProps && colorPropToMatch
                      ? colorProps[ '' + item[colorPropToMatch] ]
                      ? colorProps[ '' + item[colorPropToMatch] ]
                      : 'transparent'
                      : null

    const spanStyle = { backgroundColor : colorSign }
    const rowColor = item[ rowToMatchProp ] ? { backgroundColor : colorToMatchRow } : {}

    return (
      <div className={ `table-row${ isSelected ? ' selected' : '' }` }>
        <div className="table-row-content" style={ rowColor }>
          <Checkmark onSelect={ () => onSelectRow(index) } isChecked={ isSelected } />
          <div className="header" onClick={ this._toggleContent }>
            {
              headerProps.map((obj, i) => {
                return (
                  <div
                    key={ i }
                    className="header-item"
                    style={
                      obj.flex
                      ? { flex : obj.flex }
                      : {}
                    }
                  >
                  {
                    badge &&
                    badge.id === obj.value
                    ?
                      <span
                        className="row-badge"
                        style={{
                          backgroundColor : badge.colors[ '' + item[ obj.value ]].bgColor || 'transparent',
                          color : badge.colors[ '' + item[ obj.value ]].textColor || 'black'
                        }}
                      >
                      { badge.colors[ '' + item[ obj.value ] ].caption }
                      </span>
                    : item[ obj.value ]
                    // : item[ obj.value ]
                  }
                  </div>
                )
              })
            }
          </div>
          {
            colorSign &&
            <Span style={ spanStyle } item={ item } />
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

export default Row
