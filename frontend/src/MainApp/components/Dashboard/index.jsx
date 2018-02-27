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
  state = {
    header : ''
  }

  constructor(props) {
    super(props)

    this.onHeaderChange = this.onHeaderChange.bind(this)

    // window.socket = Socket('http://localhost:8000')

    // window.socket.on('connect', () => console.log('connected....'))
    // window.socket.emit('test', { data : 1 })
    // window.socket.on('test', console.log)
  }

  onHeaderChange(header) {
    this.setState({ header })
  }

  render() {
    const { logout, onMenuClick, isDrawerOpen, onOverlayClick } = this.props

    return (
      <Layout className="dashboard">
        <Header {...{ logout, onMenuClick, headerTitle : this.state.header }}/>
        <Body setHeader={ this.onHeaderChange } headerTitle={ this.state.header } />
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
  const { isDrawerOpen } = state.app

  return { isDrawerOpen }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
