import React, { Component } from 'react'
import { Tabs, Tab } from 'react-toolbox/lib/tabs'
// import { Card } from 'react-toolbox/lib/card'
import { MdPerson, MdContentPaste, MdDirectionsBus, MdAttachMoney } from 'react-icons/lib/md'

import TicketPersonal from './TicketForm__Personal'
import TicketPayment from './TicketForm__Payment'
import TicketReview from './TicketForm__Review'
import TicketTrip from './TicketForm__Trip'

class TicketTabs extends Component{
  constructor(props) {
    super(props)

    this.state = {
      index : 0,
      // tab2Disable : true,
      // tab3Disable : true,
      // tab4Disable : true,
    }

    this.onTabChange = this.onTabChange.bind(this)
    // this._willEnableAddressTab = this._willEnableAddressTab.bind(this)
    // this._willEnablePaymentTab = this._willEnablePaymentTab.bind(this)
    // this._onAllowTab = this._onAllowTab.bind(this)
  }

  onTabChange(index) {
    this.setState({ index })
  }

  render() {
    const { isModify } = this.props
    // const { tab2Disable, tab3Disable, tab4Disable } = this.state

    return (
      <Tabs fixed index={ this.state.index } onChange={ this.onTabChange }>
        <Tab icon={ <MdPerson /> } label="Personal Info"> 
          <TicketPersonal { ...this.props } />
        </Tab>
        <Tab
          // disabled={ tab2Disable }
          icon={ <MdDirectionsBus /> }
          label="Trip Info"
        >
          <TicketTrip { ...this.props } />
        </Tab>
        <Tab
          disabled={ /*tab3Disable*/ isModify }
          icon={ <MdAttachMoney /> }
          label="Payment Info"
        >
          <TicketPayment { ...this.props } />
        </Tab>
        <Tab
          // disabled={ /*tab4Disable*/ tab2Disable }
          icon={ <MdContentPaste /> }
          label="Review Info"
        >
          <TicketReview { ...this.props } />
        </Tab>
      </Tabs>
    )
  }
}

export default TicketTabs