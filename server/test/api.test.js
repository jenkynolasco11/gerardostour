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
  // console.log(this)
  // this.timeout(10000)

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
    // const srvr = app()
    try {
      // await deleteAllCollections()
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
        commonExpects(res, 200, true, 'array', '')
        body.data.forEach(id => {
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

  it('Should query all ticket', done => {
    agent
      .get('/api/v1/ticket/all')
      .end((err, res) => {
        const { body } = res

        commonExpects(res, 200, true, 'object', '')
        expect(body.data).to.haveOwnProperty('tickets')
        expect(body.data.tickets).to.be.an('array')
        expect(body.data.tickets).to.be.length.gte(4)
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
          expect(body.data.receipt.cardBrand).to.be.length(4)
          expect(body.data.receipt.cardLastDigits).to.be.length(4)
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