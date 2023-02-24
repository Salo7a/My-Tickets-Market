import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import {Order, OrderStatus, Ticket} from "../models";

let mongo: MongoMemoryServer;

declare global {
    var login: () => string[];
    var createOrder: (eventTitle: string, ticketPrice: number, userId: string) => any;
}

jest.setTimeout(20000);
jest.mock('../nats-wrapper');

beforeAll(async () => {
    process.env.JWT_KEY = "test";
    // Create a MongoDB memory server
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    // Connect to the created MongoDB
    mongoose.set('strictQuery', true); // Preparation for mongoose v8 changes
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.login = () => {
    // Generate a JWT Payload
    const userData = {
        "id": "123456",
        "email": "test@example.com",
        "fullName": "John Doe"
    };

    // Create the JWT
    const userJWT = jwt.sign(userData, process.env.JWT_KEY!);

    // Create session object
    const session = {jwt: userJWT};

    // Convert session object to string
    const sessionJWT = JSON.stringify(session);

    // Encode session string using base64
    const encodedSessionJWT = Buffer.from(sessionJWT).toString('base64');

    // Return the cookie `session=${Base64Session}; path=/; secure; httponly`
    return [`session=${encodedSessionJWT}; path=/; secure; httponly`];
}

global.createOrder = async (eventTitle: string, ticketPrice: number, userId: string) => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: eventTitle,
        price: ticketPrice
    });

    await ticket.save();

    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60);

    const order = Order.build({expiresAt: expiration, status: OrderStatus.Created, ticket, userId})

    await order.save();

    return order;
}