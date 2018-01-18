import React from 'react'
// import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

export const filterTicket = ({ ticketType = 'REGULAR', ...rest }) => {

  const {
    ticketQty,
    message,
    person,
    payment,
    ...body
  } = rest

  const data = { ticketQty, ...body, ...person, ...payment, ticketType }

  if(ticketType === 'PACKAGE') return { ...data, message, luggageQty : 0 }
  if(ticketType === 'VIP') return { ...data, message }
  if(ticketType === 'SPECIAL') return { ...data, message, to : 'N/A', frm : 'N/A', ride : -1 }
  if(ticketType === 'AIRPORT') return { ...data, message, to : 'N/A', frm : 'N/A', ride : -1, willDrop : false }

  return data
}

export const getMinDate = () => {
  const date = new Date()

  date.setDate(date.getDate() - 1)

  return date
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

export const onlyNumber = (val = 0, prev = Infinity) => {
  if(!val) return 0
  if(prev <= val) return parseInt(prev, 10)
  if(/[\d]/g.test(val)) return parseInt(val, 10)

  return 0
}

export const dropDownData = data => {
  const { id, ...rest } = data

  return {
    ...rest,
    value : id
  }
}

export const FormatBusItem = bus => (
  <div className="bus-item">
    <div className="">
      <strong>{ bus.name }</strong>
      {/*
        <p>
          <em><strong>Seats :</strong>{`${ bus.seats }`}</em>
          <em><strong>Luggage :</strong>{`${ bus.luggage }`}</em>
        </p>
      */}
    </div>
    <div className="">
      <p>Driver : { `${ bus.driver.firstname } ${ bus.driver.lastname }` }</p>
      <em>{ bus.alias }</em>
    </div>
  </div>
)

export const FormatRideItem = ride => (
  <div className="ride-item">
    {
      ride.label === 'none' &&
      <p> None </p>
    }
    <div className="ride-item_route">
    {
      ride.frm && ride.to &&
      <p>
        <em><strong>From :</strong>{`${ ride.frm }`}</em>
        <em><strong>To :</strong>{`${ ride.to }`}</em>
      </p>
    }
    </div>
    <div className="ride-item_bus">
    {
      ride.bus &&
      <p><strong>Bus :</strong> { `${ ride.bus.name }` }</p>
    }
    </div>
  </div>
)
// export const dropDownData = data => {
//   const { id, ...rest } = data

//   return {
//     ...rest,
//     value : id
//   }
// }

// export const verifyFields = (fields) => {
//   for(let i = 0; i < fields.length; i++) {
//     const field = fields[i]
  
//     if(field.min && field.val < field.min) {
//       // console.log('about to return, not complying with min')
//       return true
//     }
//     else if(field.match && !field.match.test(field.val)) {
//       if(field.empty) continue
//       return true
//     }
//     else if(field.dependsOn) {
//       if(!field.dependsOn) continue
//       const { street, city, state, zipcode } = field.val
//       const shouldDisable = verifyFields([
//         { val : zipcode, min : 5 },
//         { val : street, min : 6 },
//         { val : state, min : 4 },
//         { val : city, min : 3 },
//       ])
//       console.log('Should Disable? ' + shouldDisable)
//       return shouldDisable
//     }
//   }

//   return false
// }
