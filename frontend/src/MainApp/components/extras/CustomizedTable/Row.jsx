import React, { Component } from 'react'
// import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import Checkmark from './Checkmark'

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
          <Checkmark onSelect={ () => onSelectRow(index) } isChecked={ isSelected } />
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

export default Row