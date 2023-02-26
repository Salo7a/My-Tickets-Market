import {natsWrapper} from "./nats-wrapper";
import {OrderCreatedListener} from "./events/listeners/order-created-listener";

const shutdown = () => {
    natsWrapper.client.on('close', () => {
        console.log('Closing NATS Connection');
        process.exit()
    });
    natsWrapper.client.close();
}
const startup = async () => {
    if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID Has To Be Defined");
    if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID Has To Be Defined");
    if (!process.env.NATS_URL) throw new Error("NATS_URL Has To Be Defined");

    process.on('SIGINT', () => shutdown());
    process.on('SIGTERM', () => shutdown());

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        new OrderCreatedListener(natsWrapper.client).listen()
    } catch (e) {
        console.log(e);
    }
}

startup();