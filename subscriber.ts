import { connect } from 'amqplib'

const run = async () => {
    try {
        const connection = await connect('amqp://localhost')
        const channel = await connection.createChannel()
        await channel.assertExchange('test', 'topic', { durable: true })
        const queue = await channel.assertQueue('my-queue', { durable: true })
        channel.bindQueue(queue.queue, 'test', 'my-command') // связываем очередь с каналом
        channel.consume(queue.queue, message => {
            if (!message) {
                return
            }
            console.log(message.content.toString())
            // channel.ack(message) 
        }, {
            noAck: true
        })
        
    } catch (e) {
        console.error(e)
    }
}

run()