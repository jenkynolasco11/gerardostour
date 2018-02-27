import React, { Component } from 'react'
import { Platform, Linking, Icon as RNIcon } from 'react-native'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Content, List, ListItem, Text, H1, H3, Button, Icon, Body, Left, Right, View } from 'native-base'

import styles from './styles'

/*
  {
      "_id": {
         "person": "5a90537a4653e6f66e554e42",
         "dropOffAddress": {
            "_id": "5a90537e4653e6f66e555071",
            "state": "MA",
            "city": "Boston",
            "street": "5479 Consectetuer, Road",
            "zipcode": 27446,
            "modifiedAt": "2018-02-23T17:46:38.319Z",
            "createdAt": "2018-02-23T17:46:38.319Z",
            "__v": 0
         }
      },
      "total": 1,
      "confirmed": 1,
      "notConfirmed": 0,
      "person": {
         "_id": "5a90537a4653e6f66e554e42",
         "firstname": "Orlando",
         "lastname": "Fletcher",
         "phoneNumber": "9688871583",
         "email": "Ut.tincidunt@eget.net",
         "modifiedAt": "2018-02-23T17:46:34.865Z",
         "createdAt": "2018-02-23T17:46:34.865Z",
         "__v": 0
      }
   },
 */

class ContentComponent extends Component {
  state = { tickets : [] }

  componentWillReceiveProps(props) {
    const { tickets = [] } = props

    if(tickets.length) this.setState({ tickets })
  }

  componentDidCatch(e, info) {
    console.log(e)
    console.log(info)
    console.log('Error while fetching the data... Maybe?')

    return this.setState({ tickets : [] })
  }

  render() {
    const { tickets } = this.props

    // const url = `${ Platform.OS === 'ios' ? 'telprompt:' : 'tel:' }`

    return (
      <Content>
        <List>
          {
            tickets.map((ticket, i) => {
              // console.log(ticket)
              const { person, _id } = ticket
              const { dropOffAddress, pickUpAddress } = _id
              {/* console.log(dropOffAddress) */}

              const fullname = `${ person.firstname } ${ person.lastname }`

              const pick = pickUpAddress
                            ? `${ pickUpAddress.street }, ${ pickUpAddress.city }, ${ pickUpAddress.state } ${ pickUpAddress.zipcode }`
                            : null

              const drop = dropOffAddress
                            ? `${ dropOffAddress.street }, ${ dropOffAddress.city }, ${ dropOffAddress.state } ${ dropOffAddress.zipcode }`
                            : null
              {/* console.log(ticket.notConfirmed) */}
              return (
                <List key={ i }>
                  <ListItem noBorder itemDivider style={ styles.color2 }>
                    <Left>
                      <Text style={ styles.textColor5 }>
                        <Icon style={ styles.textColor5 } name="paper"/>
                        { `  ${ ticket.total - ticket.packages }` }
                      </Text>
                    </Left>
                    <Body>
                      <Text style={[ styles.textColor4, { textAlign : 'center', fontSize : 14 } ]}>{ fullname }</Text>
                    </Body>
                    <Right style={{ flex : 1, marginRight : 10 }}>
                      <Text style={ styles.textColor5 }>
                        <Icon style={ styles.textColor5 } name="briefcase"/>
                        { `  ${ ticket.packages }` }
                      </Text>
                    </Right>
                  </ListItem>
                  {
                    pick &&
                    <ListItem noBorder style={ styles.color1 }>
                      <Button
                        transparent={ Platform.OS === 'android' }
                        style={ styles.color1 }
                        onPress={ () => Linking.openURL(`https://maps.google.com/?q=${ pick }`).catch(console.log) }
                      >
                        <Icon style={ styles.textColor4 } name="home" />
                        <Text note>{ pick }</Text>
                      </Button>
                    </ListItem>
                  }
                  {
                    drop &&
                    <ListItem style={ styles.color1 } noBorder>
                      <Button
                        transparent={ Platform.OS === 'android' }
                        style={ styles.color1 }
                        onPress={ () => Linking.openURL(`https://maps.google.com/?q=${ drop }`).catch(console.log) }
                      >
                        <Icon style={ styles.textColor4 } name="pin" />
                        <Text note>{ drop }</Text>
                      </Button>
                    </ListItem>
                  }
                  <ListItem noBorder style={ styles.color1 }>
                    <Button
                      transparent={ Platform.OS === 'android' }
                      style={ styles.color1 }
                      onPress={ null }
                    >
                      <Icon style={ styles.textColor4 } name="mail" />
                      <Text style={ styles.textWhite }>Notify Passenger</Text>
                    </Button>
                  </ListItem>
                </List>
              )
            })
          }
        </List>
      </Content>
    )
  }
}

export default ContentComponent
