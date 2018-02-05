import { CronJob, CronTime } from 'cron'

import { Ticket } from '../../models'
// import mailer from '../nodemailer'
import twilio, { sendSMS } from '../twilio'
import { TWILIO_PHONE_NUMBER, HOURS_BEFORE_TO_REMIND } from '../../config'

const msg2HrsBefore = `Gerardo Trans\n\nThis is just a reminder that your ride is in about 2 hours from now.\nGet your ticket ready when your driver arrives.`
const msg10MinsBefore = `GerardoTrans\n\nThis is a reminder that your ride is about to arrive in 10 mins.\nGet your ticket ready!`

const onTickFunction = async () => {
    const tmp = new Date()
    const hour = tmp.getHours() + HOURS_BEFORE_TO_REMIND
    const date = new Date(tmp.setHours(0,0,0,0))

    const conditions = {
        date,
        time : hour,
        reminded : false
    }

    // console.log(conditions)
    // process.exit()
    try {
        const phones = await Ticket.aggregate([
            { $match : conditions },
            { $project : { /* receipt : 1,*/ id : 1, _id : 0, person : 1 }},
            {
                $lookup : {
                    from: 'person',
                    localField: 'person',
                    foreignField: '_id',
                    as: 'person'
                }
            },
            { $unwind : '$person' },
            {
                $group : {
                    _id : {
                        phoneNumber : '$person.phoneNumber',
                        // receipt : '$receipt'
                    },
                    tickts : { $push : '$$ROOT' }
                }
            }
        ])

        // phones.slice(0,1).forEach(({ _id, tickts }) =>
        phones.forEach(({ _id, tickts }) =>
            Promise.resolve(tickts.map(tckt => tckt.id))
            .then(ids => {
                const { phoneNumber : phone } = _id

                /* uncomment after tests */
                // process.nextTick(() => {
                //     sendSMS({ body : msg2HrsBefore, to : phone, from : TWILIO_PHONE_NUMBER })}
                //     const nextReminder = new Date().setHours(hour - 1, 50, 0, 0)

                //     const newCron = new CronJob(nextReminder, () => {
                //         sendSMS({ body : msg10MinsBefore, to : phone, from : TWILIO_PHONE_NUMBER })
                //     })

                //     newCron.start()
                // )

                process.nextTick(() => {
                    sendSMS({ body : msg2HrsBefore, to : '3479742990', from : TWILIO_PHONE_NUMBER }, true)
                    const nextDate = new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 2, 30, 0))
                    // console.log(nextDate)

                    const newCron = new CronJob(nextDate, () => {
                        sendSMS({ body : msg10MinsBefore, to : '3479742990', from : TWILIO_PHONE_NUMBER }, true)
                        // return newCron.stop()
                    })

                    newCron.start()
                })

                // Check this part later
                Ticket.update({ id : { $in : ids }}, { $set : { reminded : true }}, { multi : true }, () => {
                    console.log(`Tickets [${ ids }] have been updated to reminded.`)
                })
            }).catch(console.log)
        )
        // console.log(tckts)
    } catch (e) {
        console.log(e)
    }
}

// const cronTime = new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 1, 0, 0))

const cronOptions = {
    cronTime : '*/10 * * * * *',
    // cronTime,
    onTick : onTickFunction,
    start : true,
    // runOnInit : true
}

const cron = new CronJob(cronOptions)
