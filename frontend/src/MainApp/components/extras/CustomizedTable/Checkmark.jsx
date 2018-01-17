import React, { Component } from 'react'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

const CheckMark = props => (
  <div className={ `checkmark${ props.isChecked ? ' checked' : '' }` } onClick={ props.onSelect }>
    <FontIcon value="check"/>
  </div>
  // <div className={ `checkmark${ props.isChecked ? ' checked' : '' }` } onClick={ props.onSelect }>
  //   <RippableIcon value="check"/>
  // </div>
)

export default CheckMark