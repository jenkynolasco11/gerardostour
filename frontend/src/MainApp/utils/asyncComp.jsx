import React, { Component } from 'react'

const asyncComp = (importComp, name) => class AsyncComponent extends Component{
  state = {
    component : null
  }

  // componentDidCatch(e, info) {
  //   console.log('On Bruh!')
  //   console.log(e)
  //   console.log(info)
  // }

  async componentWillMount() {
    if(name) console.log(`About to mount ${ name }`)

    const { default : component } = await importComp()

    this.setState({ component })
  }

  render() {
    const C = this.state.component

    return (C ? <C  {...this.props } /> : null)
  }
}

export default asyncComp