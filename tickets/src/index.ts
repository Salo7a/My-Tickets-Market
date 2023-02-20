import {app} from "./app";
import mongoose from "mongoose";
import {natsWrapper} from "./nats-wrapper";

const shutdown = () => {
    mongoose.connection.close(() => {
        console.log('MongoDB Connection Closed');
    })
    natsWrapper.client.on('close', () => {
        console.log('Closing NATS Connection');
        process.exit()
    });
    natsWrapper.client.close();
}
const startup = async () => {
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY Has To Be Defined");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI Has To Be Defined");
    if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID Has To Be Defined");
    if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID Has To Be Defined");
    if (!process.env.NATS_URL) throw new Error("NATS_URL Has To Be Defined");

    process.on('SIGINT', () => shutdown());
    process.on('SIGTERM', () => shutdown());

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        mongoose.set('strictQuery', true); // Preparation for mongoose v8 changes
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connection Established");
    } catch (e) {
        console.log(e);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    })
}

startup();