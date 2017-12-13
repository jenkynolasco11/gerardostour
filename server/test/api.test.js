import mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiPromise from 'chai-as-promised'
import chaiHttp from 'chai-http'
import app from '../src/app'

import { User, deleteAllCollections } from '../src/models'

chai.use(chaiHttp)

let agent = null
let srv = null

const userData = {
  firstname : 'jenky',
  lastname : 'lastname',
  email : 'jenky@nolasco.com',
  phoneNumber : '3479742990',
  username : 'jenkybumba11',
  password : '12345',
  position : 'SUPERUSER',
  status : 'ACTIVE',
}

const ticketData = {
  frm : 'NY',
  to : 'PA',
  departureDate : new Date(new Date().setHours(0,0,0,0)),
  departureTime : 11,
  howMany : 4,
  luggage : 3,
  firstname : 'Jenky',
  lastname : 'Nolasco',
  phoneNumber : '3479742990',
  email : 'jenky.nolasco@gmail.com',
  willPick : true,
  willDrop : false,
  pickUpAddress : {
    street : '116 Sherman Ave',
    city : 'New York',
    state : 'NY',
    zipcode : 10034
  },
  dropOffAddress : null,
  totalAmount : 134.15,
  cardBrand : 'VISA',
  cardLastDigits : '4242',
  paymentType : 'CARD',
  status : 'NEW',
  fee : 100.15,
  extraFee : 34,
  _isLocal : true,
}

const rideData = {
  bus : null,
  routeTo : 'NY',
  routeFrom : 'PA',
  status : 'PENDING',
  time : 3, // 4:00 AM
  date : new Date(new Date().setHours(0,0,0,0)),
}

describe('Api => Users', () => {
  function commonExpects(res, status, ok, dataType, msg) {
    expect(res).to.be.status(status)
    expect(res.body).to.be.an('object')
    expect(res.body).to.haveOwnProperty('message')
    expect(res.body.message).to.have.eql(msg)
    expect(res.body).to.haveOwnProperty('ok')
    expect(res.body.ok).to.be.eql(ok)
    expect(res.body).to.haveOwnProperty('data')
    expect(res.body.data).to.be.an(dataType)
  }

  before(async() => {
    try {
      // await User.findOneAndRemove({ username : userData.username })
      srv = await app()

      agent = chai.request.agent(srv)
    } catch (e) { }
  })

  it('Should create an user', done => {
    agent
      .post('/api/v1/user/save')
      .send(userData)
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('username')
        expect(body.data.username).to.be.eql(userData.username)

        done()
      })
  })

  it('Should query the user', done => {
    agent
      .get(`/api/v1/user/${ userData.username }`)
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('user')
        expect(body.data.user).to.have.all.keys('username', 'person', 'position', 'status')
        expect(body.data.user.person).to.have.all.keys('email', 'firstname', 'lastname', 'phoneNumber')
        expect(body.data.user.status).to.be.eql(userData.status)
        expect(body.data.user.position).to.be.eql(userData.position)
        expect(body.data.user.person.phoneNumber).to.be.eql(userData.phoneNumber)

        done()
      })
  })

  it('Should modify the user', done => {
    agent
    .put(`/api/v1/user/${ userData.username }/modify`)
    .send({ position : 'DRIVER' })
    .end((err, res) => {
      const { body } = res
      commonExpects(res, 200, true, 'object', '')
      expect(body.data).to.haveOwnProperty('user')
      expect(body.data.user).to.have.all.keys('username', 'person', 'position', 'status')
      expect(body.data.user.person).to.have.all.keys('email', 'firstname', 'lastname', 'phoneNumber')
      expect(body.data.user.status).to.be.eql(userData.status)
      expect(body.data.user.position).to.be.eql('DRIVER')
      expect(body.data.user.person.phoneNumber).to.be.eql(userData.phoneNumber)

      done()
    })
  })

  it('Should delete the user', done => {
    agent
    .put(`/api/v1/user/${ userData.username }/delete`)
    .send({ position : 'DRIVER' })
    .end((err, res) => {
      const { body } = res
      commonExpects(res, 200, true, 'null', 'User deleted successfully!')

      agent
        .get(`/api/v1/user/${ userData.username }`)
        .end((err, res) => {
          const { body } = res
          commonExpects(res, 200, true, 'object', '')
          expect(body.data).to.haveOwnProperty('user')
          expect(body.data.user).to.have.all.keys('username', 'person', 'position', 'status')
          expect(body.data.user.person).to.have.all.keys('email', 'firstname', 'lastname', 'phoneNumber')
          expect(body.data.user.status).to.be.eql('DELETED')
          expect(body.data.user.person.phoneNumber).to.be.eql(userData.phoneNumber)

          done()
        })
    })
  })

  after(async () => {
    // await deleteAllCollections()
    await User.findOneAndRemove({ username : userData.username })

    srv.close()
  })
})

describe('Api => Tickets', () => {
  function commonExpects(res, status, ok, dataType, msg) {
    expect(res).to.be.status(status)
    expect(res.body).to.be.an('object')
    expect(res.body).to.haveOwnProperty('message')
    expect(res.body.message).to.have.eql(msg)
    expect(res.body).to.haveOwnProperty('ok')
    expect(res.body.ok).to.be.eql(ok)
    expect(res.body).to.haveOwnProperty('data')
    expect(res.body.data).to.be.an(dataType)
  }

  before(async() => {
    try {
      srv = await app()

      agent = chai.request.agent(srv)
    } catch (e) { }
  })

  it('Should create a ticket', done => {
    agent
      .post('/api/v1/ticket/save')
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(ticketData)
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('tickets')
        expect(body.data.tickets).to.be.an('array')

        body.data.tickets.forEach(id => {
          expect(id).to.be.an('number')
        })

        done()
      })
  })

  it('Should query a ticket', done => {
    agent
      .get('/api/v1/ticket/2')
      .end((err, res) => {
        const { body } = res

        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('id')
        expect(body.data.id).to.be.eql(2)
        expect(body.data).to.haveOwnProperty('person')
        expect(body.data.person).to.haveOwnProperty('firstname')
        expect(body.data.person.firstname).to.be.eql('Jenky')

        done()
      })
  })

  it('Should query all ticket (at least ten)', done => {
    agent
      .get('/api/v1/ticket/all')
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('tickets')
        expect(body.data.tickets).to.be.an('array')
        expect(body.data.tickets).to.be.length.gte(4).and.length.lte(10)
        expect(body.data.tickets).to.have.any.keys([0,1,2,3])

        body.data.tickets.forEach(ticket => {
          expect(ticket).to.deep.include.any.keys('id', '_id', 'person.firstname', 'person.email', 'status', 'to', 'from', 'person')
          expect(ticket).to.haveOwnProperty('willPick')
          if(ticket.willPick) expect(ticket.pickUpAddress).to.be.an('object')
          expect(ticket).to.haveOwnProperty('willDrop')
          if(ticket.willDrop) expect(ticket.dropOffAddress).to.be.an('object')
        })
        
        done()
      })
  })

  it('Should query a receipt', done => {
    agent
      .get('/api/v1/ticket/3/receipt')
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('receipt')
        expect(body.data.receipt).to.have.any.keys('fee', 'extraFee', 'ticketsIssued')
        expect(body.data.receipt.ticketsIssued).to.be.an('array')
        expect(body.data.receipt.ticketsIssued).to.include.members([1,2,3,4])
        if(body.data.receipt.paymentType === 'CARD') {
          expect(body.data.receipt.cardBrand).to.be.an('string').of.length.gte(4)
          expect(body.data.receipt.cardLastDigits).to.be.an('number')
        }
        expect(body.data.receipt.fee).to.be.an('number')
        expect(body.data.receipt.extraFee).to.be.an('number')

        done()
      })
  })

  it('Should update status of 2 tickets', done => {
    agent
      .put('/api/v1/ticket/modify/status')
      .send({ ticketIds : [ 1, 4 ], status : 'REDEEMED' })
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'null', '')

        agent
          .get('/api/v1/ticket/all?status=REDEEMED')
          .end((err, res) => {
            const { body } = res
            commonExpects(res, 200, true, 'object', '')
            expect(body.data).to.haveOwnProperty('tickets')
            expect(body.data.tickets).to.be.an('array')
            expect(body.data.tickets).to.be.lengthOf(2)
            expect(body.data.tickets).to.have.all.keys([0,1])

            body.data.tickets.forEach(ticket => {
              expect(ticket).to.haveOwnProperty('status')
              expect(ticket.status).to.be.eql('REDEEMED')
            })

            done()
          })
      })
  })

  it('Should delete the tickets', done => {
    agent
      .put('/api/v1/ticket/delete')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ tickets : [ 1,2,3,4 ] })
      .end((err, res) => {
        commonExpects(res, 200, true, 'null', 'Tickets deleted!')

        done()
      })
  })

  after(async () => {
    // await deleteAllCollections()

    srv.close()
  })
})

// TODO : WRITE MORE TESTS FOR RIDE
// TEST TO DO : MODIFY/ASSIGN BUS
// TEST TO DO : QUERY BY DATE/HOUR
describe('Api => Rides', () => {
  function commonExpects(res, status, ok, dataType, msg) {
    expect(res).to.be.status(status)
    expect(res.body).to.be.an('object')
    expect(res.body).to.haveOwnProperty('message')
    expect(res.body.message).to.have.eql(msg)
    expect(res.body).to.haveOwnProperty('ok')
    expect(res.body.ok).to.be.eql(ok)
    expect(res.body).to.haveOwnProperty('data')
    expect(res.body.data).to.be.an(dataType)
  }

  before(async() => {
    try {
      srv = await app()

      agent = chai.request.agent(srv)
    } catch (e) { }
  })

  it('Should create a ride', done => {
    agent
      .post('/api/v1/ride/save')
      .send(rideData)
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')

        expect(body.data).to.haveOwnProperty('ride')
        expect(body.data.ride).to.be.an('number')

        done()
      })
  })

  it('Should query all the rides (at least 10)', done => {
    agent
      .get('/api/v1/ride/all')
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')

        expect(body.data).to.haveOwnProperty('rides')
        expect(body.data.rides).to.be.an('array')
        expect(body.data.rides).to.be.length.lte(10)

        body.data.rides.forEach(ride => {
          expect(ride).to.have.any.keys('id', 'bus', 'luggage', 'seatsOccupied', 'status', 'routeTo', 'routeFrom')
          expect(ride.routeTo).not.to.be.empty
          expect(ride.routeFrom).not.to.be.empty
          if(ride.bus) expect(ride.bus).to.have.any.keys('name', 'id', 'status', 'seats', 'luggage')
        }) 

        expect(body.data).to.haveOwnProperty('count')
        expect(body.data.count).to.be.gte(1)

        done()
      })
  })

  it('Should query one ride', done => {
    agent
      .get('/api/v1/ride/1')
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('ride')
        expect(body.data.ride).to.have.any.keys('id', 'bus', 'luggage', 'seatsOccupied', 'status', 'routeTo', 'routeFrom')
        expect(body.data.ride.routeTo).not.to.be.empty
        expect(body.data.ride.routeFrom).not.to.be.empty

        if(body.data.ride.bus) expect(body.data.ride.bus).to.have.any.keys('name', 'id', 'status', 'seats', 'luggage')

        done()
      })
  })

  it('Should modify a ride', done => {
    agent
      .put('/api/v1/ride/5/modify')
      .send({ status : 'FINISHED' })
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        
        agent
          .get('/api/v1/ride/5')
          .end((err, res) => {
            const { body } = res
            commonExpects(res, 200, true, 'object', '')
            expect(body.data).to.haveOwnProperty('ride')
            expect(body.data.ride).to.haveOwnProperty('status')
            expect(body.data.ride.status).to.be.eql('FINISHED')

            done()
          })
      })
  })

  it('Should cancel a ride', done => {
    agent
      .put('/api/v1/ride/1/modify')
      .send({ status : 'CANCELLED' })
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')
        
        agent
          .get('/api/v1/ride/1')
          .end((err, res) => {
            const { body } = res
            commonExpects(res, 200, true, 'object', '')
            expect(body.data).to.haveOwnProperty('ride')
            expect(body.data.ride).to.haveOwnProperty('status')
            expect(body.data.ride.status).to.be.eql('CANCELLED')

            done()
          })
      })
  })

  it('Should query all the rides (Except cancelled or finished)', done => {
    agent
      .get('/api/v1/ride/all?nonstatus=FINISHED,ASSIGNED,CANCELLED')
      .end((err, res) => {
        const { body } = res
        commonExpects(res, 200, true, 'object', '')

        expect(body.data).to.haveOwnProperty('rides')
        expect(body.data.rides).to.be.an('array')
        expect(body.data.rides).to.be.length.lte(10)

        body.data.rides.forEach(ride => {
          expect(ride).to.have.any.keys('id', 'bus', 'luggage', 'seatsOccupied', 'status', 'routeTo', 'routeFrom')
          expect(ride.routeTo).not.to.be.empty
          expect(ride.routeFrom).not.to.be.empty
          expect(ride.status).not.to.be.eql('FINISHED').and.not.to.be.eql('CANCELLED')
          if(ride.bus) expect(ride.bus).to.have.any.keys('name', 'id', 'status', 'seats', 'luggage')
        }) 

        expect(body.data).to.haveOwnProperty('count')
        expect(body.data.count).to.be.gte(1)

        done()
      })
  })

  after(async () => {
    // await deleteAllCollections()

    srv.close()
  })
})