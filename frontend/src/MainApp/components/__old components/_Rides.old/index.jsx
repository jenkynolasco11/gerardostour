import React, { Component } from 'react'

import RideList from './RideList'

class RidesDash extends Component{
  constructor(props) {
    super(props)

    // this.state = {
    //   render : true
    // }

    // this.asyncRerender = this.asyncRerender.bind(this)
  }

  // asyncRerender() {
  //   const self = this
  //   // TODO : CHECK WHAT THE FUCK IS HAPPENING IN HERE!!!!!!
  //   setTimeout(() => self.setState({ render : true }), 10)
  // }

  render() {
    // const { render } = this.state
    // console.log('about to render -> Ride')
    return (
      <div className="rides">
        <p>Rides List</p>
        <RideList />
      </div>
    )
  }
}

export default RidesDash