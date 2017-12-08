import React, { Component } from 'react'
import { Tabs, Tab } from 'react-toolbox/lib/tabs'
import { Card } from 'react-toolbox/lib/card'
import { MdPerson, MdContentPaste, MdDirectionsBus, MdAttachMoney } from 'react-icons/lib/md'

import TicketPersonal from './TicketPersonal'
import TicketPayment from './TicketPayment'
import TicketAddress from './TicketAddress'
import TicketReview from './TicketReview'

// import { verifyFields } from '../../utils'

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
      <Card className="ticket-form">
        <Tabs fixed index={ this.state.index } onChange={ this.onTabChange }>
          <Tab icon={ <MdPerson /> } label="Personal Information"> 
            <TicketPersonal { ...this.props } />
           </Tab>
          <Tab
            // disabled={ tab2Disable }
            icon={ <MdDirectionsBus /> }
            label="Trip Information"
          >
            <TicketAddress { ...this.props } />
          </Tab>
          <Tab
            disabled={ /*tab3Disable*/ isModify }
            icon={ <MdAttachMoney /> }
            label="Payment Information"
          >
            <TicketPayment { ...this.props } />
          </Tab>
          <Tab
            // disabled={ /*tab4Disable*/ tab2Disable }
            icon={ <MdContentPaste /> }
            label="Review Information"
          >
            <TicketReview { ...this.props } />
          </Tab>
        </Tabs>
      </Card>
    )
  }
}

export default TicketTabs