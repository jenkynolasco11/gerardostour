import React, { Component } from 'react'
import {
  View,
  ScrollView,
  // FlatList,
  Text,
  // TouchableOpacity
} from 'react-native'

import styles from './styles'

// import ListItem from './ListItem'
import ListView from './ListView'
import RideInfo from '../rideinfo'

import { BASEURL, TIMEOUT } from '../../../config'

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
      self.setState({ rides, errorFetch : true })
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
    const { rides } = this.state

    return (
      <ListView {...{ onPress, rides }} />
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