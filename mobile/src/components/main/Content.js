import React, { PureComponent as Component } from 'react'
import { AsyncStorage, RefreshControl } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { Content, List, ListItem, Text, Right, Body, View } from 'native-base'

import { requestRides } from '../../store/actions'
import { formatHour } from '../../utils'

import styles from './styles'


// import { BASEURL, TIMEOUT } from '../../../config'

class ContentComponent extends Component{
  state = {
     rides : [],
    //  refreshing : false,
  }

  constructor(props) {
    super(props)

    this._setRidesToState = this._setRidesToState.bind(this)
    // this._onRefresh = this._onRefresh.bind(this)
  }

  async componentWillMount() {
    // const { getRides, bus } = this.props
    const rides = await AsyncStorage.getItem('rides')

    // getRides(bus)

    return this._setRidesToState(JSON.parse(rides))
  }

  _setRidesToState(rideList = null) {
    let rids = rideList

    if(!rids) {
      const { rides } = this.props

      rids = [].concat(rides)
    }

    return this.setState({ rides : rids })
  }

  componentWillReceiveProps(props) {
    // console.log('Receiving props... Refreshing getting false')
    // console.log(props)
    // return this._setRidesToState(props.rides)
    // this.setState({ refreshing : false })

    return this._setRidesToState()
  }

  // async _onRefresh() {
  //   const { getRides, bus } = this.props

  //   this.setState({ refreshing : true })

  //   return getRides(bus)
  // }

  render() {
    const { rides/*, refreshing */} = this.state
    const ONE_HOUR = 60  * 60 * 1000

    return (
      <Content>
      {
        <List
          // refreshControl={
          //   <RefreshControl
          //     refreshing={ refreshing }
          //     onRefresh={ this._onRefresh }
          //   />
          // }
        >
        {
          rides.map((ride, i) => (
            <View key={ i }>
              <ListItem noBorder itemDivider style={ styles.color2 }>
                <Text style={ styles.textColor5 }>{ ride.id }</Text>
              </ListItem>
              <List>
                {
                  ride.results.map((obj, j) => (
                    <ListItem
                      style={ styles.color1 }
                      noBorder={ j === ride.results.length - 1 }
                      key={ '' + i + j }
                      onPress={ () => Actions.push('ride', { rideId : obj.id }) }
                    >
                      <Body>
                        <Text style={ styles.textWhite }>
                          { `From ${ obj.frm } to ${ obj.to } at ${ formatHour(obj.time + 1) }` }
                        </Text>
                      </Body>
                      <Right>
                        { 
                          ((new Date) - new Date(obj.addedAt) ) < ONE_HOUR
                          ? <Text note style={ styles.textColor4 }>NEW!</Text>
                          : null
                        }
                      </Right>
                    </ListItem>
                  ))
                }
              </List>
            </View>
          ))
        }
        </List>
      }
      </Content>
    )
  }
}

// const mapStateToProps = state => {
//   const { ride, auth } = state

//   return {
//     rides : ride.rides,
//     // bus : auth.bus
//   }
// }

// const mapDispatchToProps = dispatch => ({
//   // getRides : bus => dispatch(requestRides(bus))
// })

export default ContentComponent