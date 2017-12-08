export const formatHour = t => `${ ('00' + (t % 12 ? (t % 12) + 1 : 1)).slice(-2) }:00 ${ t > 10 && t !== 23 ? 'PM' : 'AM' }`

export const formatDate = d => {
  const date = new Date(d)
  // console.log(d)
  // console.log(date)

  const day = `00${ date.getDate() }`.slice(-2)
  const month = `00${ date.getMonth() + 1 }`.slice(-2)
  const year = date.getFullYear()

  const newDate = `${ day }-${ month }-${ year }`
  // console.log(newDate)

  return newDate
}

export const formatPhone = phone => {
  const phoneRegx = /(\d{3})(\d{3})(\d{4})/g.exec(phone)
  return `(${ phoneRegx[ 1 ] }) ${ phoneRegx[ 2 ] }-${ phoneRegx[ 3 ] }`
}

export const onlyNumber = val => {
  if(isFinite(val)) return val

  return ''
}

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
