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
      index : 3,
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

  // _onAllowTab(tabName, isDisabled) {
  //   this.setState({ [ tabName ] : isDisabled })
  // }

  // _willEnableAddressTab() {
  //   const { firstname, lastname, email, phoneNumber } = this.props.person
    
  //   const shouldEnable = verifyFields([
  //     { val : firstname.length, min : 2 },
  //     { val : lastname.length, min : 2 },
  //     { val : phoneNumber.length, min : 10 },
  //     { val : email, emtpy : true, match : /[a-z0-9_.-]*@[a-z0-9]*\.[a-z]{2,6}/ },
  //   ])

  //   // console.log(`Should enable ? ${ shouldEnable }`)
  //   return shouldEnable
  // }

  // _willEnablePaymentTab() {
  //   const {
  //     to,
  //     from,
  //     willPick,
  //     willDrop,
  //     pickUpAddress,
  //     dropOffAddress,
  //     // date,
  //     // time,
  //     ticketMany,
  //     luggage,
  //   } = this.props

  //   const shouldEnable = verifyFields([
  //     { val : to, min : 1 },
  //     { val : from, min : 1 },
  //     { val : { ...pickUpAddress }, dependsOn : willDrop},
  //     { val : { ...dropOffAddress }, dependsOn : willPick},
  //     { val : ticketMany, min : 1 },
  //     { val : luggage, min : 0 },
  //   ])

  //   return shouldEnable
  // }

  // componentWillReceiveProps(newProps) {
  //   const tab2Disable = this._willEnableAddressTab()
  //   // const tab3Disable = this._willEnablePaymentTab()
  //   const tab4Disable = true

  //   this.setState({ tab2Disable, /*tab3Disable,*/ tab4Disable })
  // }

  render() {
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
            // disabled={ /*tab3Disable*/ tab2Disable }
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