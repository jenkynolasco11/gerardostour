import React, { Component } from 'react'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import './searchbar.scss'

class SearchBar extends Component{
  state = { spanTop : false }

  constructor(props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onFocus = this._onFocus.bind(this)
    this._onKeyPress = this._onKeyPress.bind(this)
  }

  _onChange(e) {
    const { value } = e.target
    const { onSearchChange } = this.props

    if(onSearchChange) return onSearchChange(value)
  }

  _onFocus(spanTop) {
    return this.setState({ spanTop })
  }

  _onKeyPress({ key, repeat }) {
    if(repeat) return

    const { onSearchEnter = null } = this.props
    const { searchQry } = this.state

    if(key === 'Enter' && onSearchEnter) return onSearchEnter(searchQry)
  }

  render() {
    const { spanTop } = this.state
    const { rightDropDown : DropDown, searchPlaceholderText, searchString = '' } = this.props
    const spanClass = `search-bar_placeholder${ spanTop || searchString.length ? ' top' : '' }`
    const shouldCloseAppear = searchString.length > 0
    const closeIconClass = `search-bar_icon close${ shouldCloseAppear ? ' appear' : '' }`
    const placeholder = searchPlaceholderText || "Check on server"

    return (
      <div className="search-bar">
        <div className="search-bar_input-field">
          <FontIcon value="search" className="search-bar_icon"/>
          <input
            placeholder={ placeholder }
            className="search-bar_input"
            type="text"
            onChange={ this._onChange }
            value={ searchString }
            onFocus={ () => this._onFocus(true) }
            onBlur={ () => this._onFocus(false) }
            onKeyDown={ e => this._onKeyPress(e) }
          />
          <span className={ spanClass }>Search</span>
          <FontIcon
            value="close"
            className={ closeIconClass }
            onClick={ () => this._onChange({ target : { value : '' }}) }
          />
        </div>
        {
          DropDown && 
          <div className="search-bar_dropdown">
            <span>Search By:</span>
            { React.cloneElement(DropDown) }
          </div>
        }
      </div>
    )
  }
} 

export default SearchBar