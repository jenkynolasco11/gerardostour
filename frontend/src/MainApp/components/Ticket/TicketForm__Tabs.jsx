import React, { Component } from 'react'
import { Tabs, Tab } from 'react-toolbox/lib/tabs'
// import { Card } from 'react-toolbox/lib/card'
import { MdPerson, MdContentPaste, MdDirectionsBus, MdAttachMoney } from 'react-icons/lib/md'

import TicketPersonal from './TicketForm__Personal'
// import TicketPayment from './TicketForm__Payment'
import TicketReview from './TicketForm__Review'
import TicketTrip from './TicketForm__Trip'

class TicketTabs extends Component{
  state = { index : 0 }

  constructor(props) {
    super(props)

    this.onTabChange = this.onTabChange.bind(this)
    this.onTabNext = this.onTabNext.bind(this)
  }

  onTabChange(index) {
    return this.setState({ index })
  }

  onTabNext(next=1) {
    const { index } = this.state

    return this.setState({ index : index + next })
  }

  render() {
    // const { isModify } = this.props

    return (
      <Tabs fixed index={ this.state.index } onChange={ this.onTabChange }>
        <Tab icon={ <MdPerson /> } label="Personal Info"> 
          <TicketPersonal { ...this.props } onTabNext={ this.onTabNext }/>
        </Tab>
        <Tab icon={ <MdDirectionsBus /> } label="Trip Info" >
          <TicketTrip { ...this.props } onTabNext={ this.onTabNext }/>
        </Tab>
        {/*
          <Tab icon={ <MdAttachMoney /> } label="Payment Info" >
            <TicketPayment { ...this.props } onTabNext={ this.onTabNext }/>
          </Tab>
        */}
        <Tab icon={ <MdContentPaste /> } label="Review Info">
          <TicketReview { ...this.props } onTabNext={ this.onTabNext }/>
        </Tab>
      </Tabs>
    )
  }
}

export default TicketTabs