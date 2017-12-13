import { BusDetail, Bus, User, Person } from '../../../models'

export const getBusData = async bus => {
  try {
    const { seats, luggage } = await BusDetail.findOne({ bus })
    const { _id, alias, name, status, user } = await Bus.findById(bus)
    const { person, position } = await User.findById(user)
    const { firstname, lastname, phoneNumber } = await Person.findById(person)

    const data = {
      id : _id,
      name,
      alias,
      driver : {
        firstname,
        lastname,
        phoneNumber,
        position,
      },
      status,
      seats,
      luggage
    }

    return data
  } catch (e) {
    console.log(e)
  }

  return null
}

export const saveBus = async data => {
  try {
    const {
      user,
      alias,
      name,
      status = 'STANDBY',
      seats,
      luggage,
    } = data

    const bus = await new Bus({
      user,
      alias,
      name,
      status
    }).save()

    const details = await new BusDetail({
      bus : bus._id,
      seats,
      luggage
    }).save()

    return bus._id
  } catch (e) {
    // Delete bus in case there is an error in here
    console.log(e)
  }

  return null
}
