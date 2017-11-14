import React, { Component } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native'

import styles from './styles'

const BASEURL = 'http://192.168.0.101:8000/api'
const TIMEOUT = 5000

class RideInfo extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      info : {}
    }

    this._fetchInfo = this._fetchInfo.bind(this)
  }

  async _fetchInfo() {
    const { id } = this.props
    
    try {
      const res = await fetch(`${ BASEURL }/rides/${ id }`)
      const data = await res.json()
      
      this.setState({
        info : {...data}
      })

    } catch (e) {
      // const self = this
      // self.setState({ rides : rides, errorFetch : true })
      // setTimeout(() => {
      //   self.setState({ errorFetch : false })
      // }, TIMEOUT)
    }
  }

  componentWillMount() {
    this._fetchInfo()
  }

  render() { 
    console.log(this.state)
    return (
      <ScrollView style={ styles.container }>
        <View>
          <Text> At least this works </Text>
        </View>
      </ScrollView>
    )
  }
}

export default RideInfo