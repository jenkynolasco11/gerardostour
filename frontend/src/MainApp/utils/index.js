export const formatHour = t => `${ ('00' + (t % 12 ? (t % 12) + 1 : 1)).slice(-2) }:00 ${ t > 10 && t !== 23 ? 'PM' : 'AM' }`

export const formatDate = d => {
  const date = new Date(d)

  const day = `00${ date.getDay() + 1 }`.slice(-2)
  const month = `00${ date.getMonth() + 1 }`.slice(-2)
  const year = date.getFullYear()

  return `${ day }-${ month }-${ year }`
}

export const formatPhone = phone => {
  const phoneRegx = /(\d{3})(\d{3})(\d{4})/g.exec(phone)
  return `(${ phoneRegx[ 1 ] }) ${ phoneRegx[ 2 ] }-${ phoneRegx[ 3 ] }`
}