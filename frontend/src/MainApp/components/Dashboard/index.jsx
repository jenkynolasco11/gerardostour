import React, { PureComponent as Component } from 'react'
// import Socket from 'socket.io-client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Layout from 'react-toolbox/lib/layout/Layout'

import Header from './Header'
import Drawer from './Drawer'
import Body from './Body'

// Import styles
import './style.scss'
import { toggleDrawer, logUserOut } from '../../store-redux/actions'

class Dashboard extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const { logout, onMenuClick, isDrawerOpen, onOverlayClick, headerTitle } = this.props

    return (
      <Layout className="dashboard">
        <Header {...{ logout, onMenuClick, headerTitle }}/>
        <Body />
        <Drawer {...{ isDrawerOpen, onOverlayClick }} />
      </Layout>
    )
  }
}

// const Dashboard = props => {
//   const { logout, onMenuClick, isDrawerOpen, onOverlayClick } = props

//   return (
//     <Layout className="dashboard">
//       <Header {...{ logout, onMenuClick }}/>
//       <Body {...{ }} />
//       <Drawer {...{ isDrawerOpen, onOverlayClick }} />
//     </Layout>
//   )
// }

const mapDispatchToProps = dispatch => bindActionCreators({
  onMenuClick : () => toggleDrawer(true),
  logout : () => logUserOut(),
  onOverlayClick : () => toggleDrawer(false)
}, dispatch)

const mapStateToProps = state => {
  const { isDrawerOpen, headerTitle } = state.app

  return { isDrawerOpen, headerTitle }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
