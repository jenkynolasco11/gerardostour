import React, { Component } from 'react'
import {
  View,
  ScrollView,
  // FlatList,
  Text,
  // TouchableOpacity
} from 'react-native'

import styles from './styles'

import ListItem from './ListItem'
import RideInfo from '../rideinfo'

const BASEURL = 'http://192.168.0.101:8000/api'
const TIMEOUT = 5000

class Body extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      rides : [],
      errorFetch : false,
      fetching : false,
    }

    this._fetchData = this._fetchData.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this._renderExtraMessage = this._renderExtraMessage.bind(this)
    this._renderListItems = this._renderListItems.bind(this)
  }

  _onScroll(e) {
    // TODO : If scroll is > 120, call _fetchData
    // console.log(e.nativeEvent.contentOffset)
  }

  async _fetchData() {
    const { rides } = this.state

    try {
      this.setState({ fetching : true })

      const res = await fetch(`${ BASEURL }/rides/all`)
      const data = await res.json()

      return this.setState({
        rides : [].concat(rides, data.rides),
        fetching : false,
      })

    } catch (e) {
      const self = this
      self.setState({ rides : rides, errorFetch : true })
      return setTimeout(() => {
        self.setState({ errorFetch : false, fetching : false })
        return setTimeout(self._fetchData, TIMEOUT)
      }, TIMEOUT)
    }
  }

  _renderExtraMessage() {
    return (
      <View style={ styles.messageBox }>
      {
        this.state.errorFetch 
        ? <Text style={ styles.errorText }>Error fetching data</Text>
        : <Text style={{}}>Fetching Data</Text>
      }
      </View>
    )
  }

  _renderListItems() {
    const { onPress } = this.props

    const listItem = (ride, index) => <ListItem {...{ key : index, index, ride, onPress}}/>

    return (
      <View style={ styles.body }>
      {
        this.state.rides.map( listItem )
      }
      </View>
    )
  }

  componentWillMount() {
    this._fetchData()
  }

  render() { 
    return (
      <ScrollView
        // style={ styles.container }
        onScroll={ this._onScroll }
        keyboardDismissMode={ 'on-drag' }
        scrollEventThrottle={ 100 }
      >
        {
          this.state.errorFetch || this.state.fetching 
          ? this._renderExtraMessage()
          : this._renderListItems()
        }
      </ScrollView>
    )
  }
}

export default Body