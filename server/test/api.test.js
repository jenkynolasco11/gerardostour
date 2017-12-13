import mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiPromise from 'chai-as-promised'
import chaiHttp from 'chai-http'
import app from '../src/app'

import { deleteAllCollections } from '../src/models'

chai.use(chaiHttp)

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

// let ticket = null
let agent = null
let srv = null

describe('Api => Tickets', () => {
  before(async() => {
    // const srvr = app()
    try {
      await deleteAllCollections()
      srv = await app()

      agent = chai.request.agent(srv)
    } catch (e) {
      
    }
    // console.log(agent)
  })

  it('Should create a ticket', done => {
    agent
      .post('/api/v1/ticket/save')
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(ticketData)
      .end((err, res) => {
        const { body } = res
        expect(res).to.be.status(200)
        expect(body).to.be.an('object')
        expect(body).to.haveOwnProperty('message')
        expect(body.message).to.have.eql('')
        expect(body).to.haveOwnProperty('ok')
        expect(body.ok).to.be.true
        expect(body).to.haveOwnProperty('data')
        expect(body.data).to.be.an('array')
        expect(body.data).to.include(1).and.include(2).and.include(3).and.include(4)


        done()
      })
  })

  it('Should query a ticket', done => {
    agent
      .get('/api/v1/ticket/2')
      .end((err, res) => {
        const { body } = res
        expect(res).to.be.status(200)
        expect(body).to.be.an('object')
        expect(body).to.haveOwnProperty('message')
        expect(body.message).to.be.eql('')
        expect(body).to.haveOwnProperty('ok')
        expect(body.ok).to.be.true
        expect(body).to.haveOwnProperty('data')
        expect(body.data).to.be.an('object')
        expect(body.data).to.haveOwnProperty('id')
        expect(body.data.id).to.be.eql(2)
        expect(body.data).to.haveOwnProperty('person')
        expect(body.data.person).to.haveOwnProperty('firstname')
        expect(body.data.person.firstname).to.be.eql('Jenky')

        done()
      })
  })

  it('Should query all ticket', done => {
    agent
      .get('/api/v1/ticket/all')
      .end((err, res) => {
        const { body } = res
        expect(res).to.be.status(200)
        expect(body).to.be.an('object')
        expect(body).to.haveOwnProperty('message')
        expect(body.message).to.be.eql('')
        expect(body).to.haveOwnProperty('ok')
        expect(body.ok).to.be.true
        expect(body).to.haveOwnProperty('data')
        expect(body.data).to.haveOwnProperty('tickets')
        expect(body.data.tickets).to.be.an('array')

        done()
      })
  })

  it('Should delete the tickets', done => {
    agent
      .put('/api/v1/ticket/delete')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ tickets : [ 1,2,3,4 ] })
      .end((err, res) => {
        const { body } = res

        expect(res).to.be.status(200)
        expect(body).to.be.an('object')
        expect(body).to.haveOwnProperty('message')
        expect(body.message).to.have.eql('Tickets deleted!')
        expect(body).to.haveOwnProperty('ok')
        expect(body.ok).to.be.true
        expect(body).to.haveOwnProperty('data')
        expect(body.data).to.be.null

        done()
      })
  })

  after(async () => {
    await deleteAllCollections()

    srv.close()
  })
})