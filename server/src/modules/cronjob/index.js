import { CronJob } from 'cron'

const cron = new CronJob('*/5 * * * * *', () => {
    console.log('Ticking...')
}).start()
