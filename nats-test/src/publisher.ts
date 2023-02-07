import nats from 'node-nats-streaming';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected!');
    const data = JSON.stringify({
        id: "1234",
        title: "Event",
        price: 800
    });

    stan.publish('ticket:created', data, () => {
        console.log('msg published');
    })
})