import React, { Component } from 'react'
import { Platform, Linking, Icon as RNIcon } from 'react-native'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Content, List, ListItem, Text, H1, H3, Button, Icon, Body, Left } from 'native-base'

import styles from './styles'

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

    const url = `${ Platform.OS === 'ios' ? 'telprompt:' : 'tel:' }`

    return (
      <Content>
        <List>
          {
            tickets.map((ticket, i) => {
              // console.log(ticket)
              const { person, dropOffAddress, pickUpAddress } = ticket

              const fullname = `${ person.firstname } ${ person.lastname }`
              const pick = pickUpAddress !== 'none' 
                            ? `${ pickUpAddress.street }, ${ pickUpAddress.city }, ${ pickUpAddress.state } ${ pickUpAddress.zipcode }`
                            : null

              const drop = dropOffAddress !== 'none' 
                            ? `${ dropOffAddress.street }, ${ dropOffAddress.city }, ${ dropOffAddress.state } ${ dropOffAddress.zipcode }`
                            : null

              return (
                <List key={ i }>
                  <ListItem noBorder itemDivider style={ styles.color2 }>
                    <Left>
                      {
                        ticket.package && 
                        <Icon style={ styles.textColor5 } name="briefcase" /> 
                      }
                      <Text style={ styles.textColor5 }>{ `Ticket #${ ticket.id }` }</Text>
                    </Left>
                    <Body>
                      <Text style={ styles.textColor4 }>{ fullname }</Text>
                    </Body>
                  </ListItem>
                  <ListItem noBorder style={ styles.color1 }>
                    <Button
                      transparent={ Platform.OS === 'android' }
                      style={ styles.color1 }
                      onPress={ () => Linking.openURL(`${ url }${ person.phoneNumber}`).catch(console.error) }
                    > 
                      <Icon style={ styles.textColor4 } name="call" />
                      <Text style={ styles.textWhite }>{ person.phoneNumber }</Text>
                    </Button>
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
                  {
                    ticket.package && 
                    <ListItem noBorder style={ styles.color1 }>
                      <Left>
                        <MCIcon style={[ styles.textColor5, styles.icon ]} name="weight" />
                        <Text style={ styles.textWhite }>
                          { 
                            ticket.package.weight 
                            ? parseFloat(ticket.package.weight).toFixed(1) 
                            : 0.0
                          }
                        </Text>
                        {
                          ticket.package.message &&
                          <Text note>{ ticket.package.message }</Text>
                        }
                      </Left>
                    </ListItem>
                  }
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