import { Toast, ActionSheet } from 'native-base'
import axios from 'axios'

import { APIURL } from '../../config'

export const showMessage = (text, type='success') => {
  // Toast.toastInstance._root.closeToast()

  Toast.show({
    text,
    type,
    duration : 2000,
    position : 'bottom',
    buttonText : 'Close',
    style : { backgroundColor : '#242c3b' },
    onClose : () => console.log('Toast closed')
  })
}

export const showActionSheet = (BUTTONS, ACTIONS) => {
  // console.log(JSON.stringify(ActionSheet))
  // ActionSheet.actionSheetInstance._root.closeActionSheet()
  // const onPress = logout => (
  ActionSheet.show({
    destructiveButtonIndex : 0,
    cancelButtonIndex : 1,
    options : BUTTONS,
    title : "Are you sure you want to log out?"
  }, index => {
    if(ACTIONS[ index ]) ACTIONS[ index ]()
    // if(index === 0) return logout()
  })
  // )
}

export const formatHour = t => `${ ('00' + (t % 12 ? (t % 12) + 1 : 1)).slice(-2) }:00 ${ t > 10 && t !== 23 ? 'PM' : 'AM' }`

export const formatDate = d => {
  const date = new Date(d)

  const day = `00${ date.getDate() }`.slice(-2)
  const month = `00${ date.getMonth() + 1 }`.slice(-2)
  const year = date.getFullYear()

  const newDate = `${ day }-${ month }-${ year }`

  return newDate
}

export const formatPhone = phone => {
  const phoneRegx = /(\d{3})(\d{3})(\d{4})/g.exec(phone)
  return `(${ phoneRegx[ 1 ] }) ${ phoneRegx[ 2 ] }-${ phoneRegx[ 3 ] }`
}

export const retrieveRide = async id => {
  try {
    const { data } = await axios.get(`${ APIURL }/ride/${ id }`)

    if(data.ok) return data.data.ride
  } catch (e) {
    console.log(e)
  }

  return null
}

export const retriveTicketsByRide = async rideId => {
  try {
    const { data } = await axios.get(`${ APIURL }/ticket/all/${ rideId }`)

    if(data.ok) return data.data.tickets
  } catch (e) {
    console.log(e)
  }

  return []
}