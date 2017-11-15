import React, { Component } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native'
import { Actions } from 'react-native-router-flux'

import Passenger from './PassengerCard'

import styles from './styles'
import { BASEURL, TIMEOUT } from '../../../config'

const Nav = props => (
  <View style={ styles.nav }>
    <TouchableOpacity
      activeOpacity={ 0.7 }
      onPress={ props.onPress }
    >
      <Text style={ styles.backButton }>Back</Text>
    </TouchableOpacity>
    <View>
      <Text style={ styles.infoName }>{ props.name }</Text>
    </View>
  </View>
)

class RideInfo extends Component { 
  constructor(props) {
    super(props)

    this.state = {
      info : [],
      fetching : false,
      errorFetch : false,
      name : 'Fulano',
    }

    this._onSMS = this._onSMS.bind(this)
    this._onCall = this._onCall.bind(this)
    this._onPress = this._onPress.bind(this)
    this._fetchInfo = this._fetchInfo.bind(this)
    this._renderListItems = this._renderListItems.bind(this)
    this._renderExtraMessage = this._renderExtraMessage.bind(this)
  }

  async _fetchInfo() {
    const { id } = this.props
    const { info } = this.state
    
    
    try {
      const res = await fetch(`${ BASEURL }/rides/${ id }/passengers`)
      const data = await res.json()
      
      this.setState({
        info : [].concat(info, data.passengers),
        fetching : false,
      })

    } catch (e) {
      const self = this
      self.setState({ info, errorFetch : true })
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

  _onPress(which, number) {
    return which === 'call' ? this._onCall(number) : this._onSMS(number)
  }

  _onCall(number) {
    return console.log('It\'s calling....')
  }

  _onSMS(number) {
    return console.log('It\'s sending a message....')
  }

  _renderListItems() {
    // const { onPress } = this.props
    const { info } = this.state

    return (
      info.map((passenger, i) => (
        <Passenger 
          key={ i }
          { ...passenger }
          index={ i }
          onPress={ this._onPress }
        />
      ))
    )
  }

  componentWillMount() {
    this._fetchInfo()
  }

  render() { 
    const { name } = this.state

    return (
      <View style={ styles.container }>
        <Nav name={ name } onPress={ () => Actions.pop() } />
        <ScrollView>
        {
          this.state.errorFetch || this.state.fetching 
          ? this._renderExtraMessage()
          : this._renderListItems()
        }
        </ScrollView>
      </View>
    )
  }
}

export default RideInfo