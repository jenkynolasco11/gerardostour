import React from 'react'
// import { RefreshControl } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Content, List, ListItem, Text, Left, Right, Body, View, Icon } from 'native-base'

import { formatHour } from '../../utils'

import styles from './styles'

const ContentComponent = props => {
  const { rides/*, refreshing */} = props
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
        rides &&
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
                    <Left style={{ maxWidth : '20%' }}>
                      <Text style={ styles.textColor4 }>
                        <Icon  style={ styles.textColor4 }name="paper"/>
                        {
                          `  ${ obj.seatsOccupied }`
                        }
                      </Text>
                    </Left>
                    <Body>
                      <Text style={[ styles.textWhite, { fontSize : 14 }]}>
                        { `From ${ obj.frm } to ${ obj.to } at ${ formatHour(obj.time) }` }
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

export default ContentComponent
