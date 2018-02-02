import mailer from 'nodemailer'

import config from './secret.config'

class Mailer {
    oauthconf = null
    mailer = null

    constructor() {
        this.oauthconf = config
        // this.mailer = mailer.createTransport(config)

        // console.log(this.oauthconf)
    }

    async sendEmail({ to, from, subject, text }) {
        // console.log(this.mailer)
        const mailr = mailer.createTransport(this.oauthconf)
        return mailr.sendMail({ to, from, subject, text })
    }

    async sendTicketReceipt(data) {
        // console.log(this.mailer)
        // Data => {
        //     to,
        //     from,
        //     email,
        //     firstname,
        //     lastname,
        //     ticketsQty,
        //     totalAmount,
        //     ticketId,
        //     luggage,
        //     luggagePrice,
        //     date,
        //     time,
        //     card,
        //     pickUpAddress as pick,
        //     dropOffAddress as drop,
        // }
        try {
            const isVerified = await this.mailer.verify()

            // console.log(a)

            // console.log('verified')
            if(!isVerified) return false

            const x = await this.sendEmail({
                to : 'jenky_nolasco@hotmail.com',
                from : 'Jenky Nolasco <jenky.nolasco@gmail.com>',
                subject : 'This is a test',
                text : 'Hello darkens, my old friend!',
            })

            console.log('sent')

            return true

        } catch (e) {
            // console.log(e)

            return false
        }
    }
}

export default Mailer