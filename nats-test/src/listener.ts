import nats, {Message} from 'node-nats-streaming';
import {randomBytes} from "crypto";
import TicketCreatedListener from "./events/ticket-created-listener";

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

    new TicketCreatedListener(stan, true).listen()
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




