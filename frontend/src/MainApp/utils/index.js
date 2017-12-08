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


export const verifyCard = number => {

  // Visa => 16, starts with 4
  if(/^4/.test(number) && number.length === 16) return 'VISA'

  // American Express => 15, starts with 3, second either 4 or 7
  else if(/^3[47]/.test(number) && number.length >= 15) return 'AMERICAN EXPRESS'

  // MasterCard => 16, starts with 5, second from 1 to 5, ranges 510000 to 559999, starts with 2 and second is 2 to 7, ranges 222100 to 272099
  else if(/^(5[1-5]|2[2-7])/.test(number) && number.length >= 16 ){
    const card = Number(number.slice(0,6))
    if((card > 222099 && card < 272100) || (card > 509999 && card < 560000)) return 'MASTERCARD'
  }

  return ''
}