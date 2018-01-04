import React from 'react'

export const getMinDate = () => {
  const date = new Date()

  date.setDate(date.getDate() - 1)

  return date
}

// export const dropDownData = data => {
//   const { id, ...rest } = data

//   return {
//     ...rest,
//     value : id
//   }
// }

export const FormatBusItem = bus => (
  <div className="bus-item">
    <div className="">
      <strong>{ bus.name }</strong>
      <p>
        <em><strong>Seats :</strong>{`${ bus.seats }`}</em>
        <em><strong>Luggage :</strong>{`${ bus.luggage }`}</em>
      </p>
    </div>
    <div className="">
      <p>Driver : { `${ bus.driver.firstname } ${ bus.driver.lastname }` }</p>
      <em>{ bus.alias }</em>
    </div>
  </div>
)