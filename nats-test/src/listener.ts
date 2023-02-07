import nats, {Message} from 'node-nats-streaming';
import {randomBytes} from "crypto";

console.clear();

const stan = nats.connect('ticketing', `listener-${randomBytes(4).toString('hex')}`, {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected!');

    stan.on('close', () => {
        console.log('Closed NATS Connection');
        process.exit();
    })

    const options = stan.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setDurableName('listener');
    const subscription = stan.subscribe('ticket:created', 'listener-qGroup', options);

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received Message #${msg.getSequence()}, Containing: ${data}`);
        }

        msg.ack();
    })
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());