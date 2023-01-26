import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../app";

let mongo: MongoMemoryServer;

declare global {
    var login: () => Promise<string[]>;

}
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
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.login = async () => {
    const userData = {
        "email": "test@example.com",
        "password": "password",
        "firstName": "John ",
        "lastName": "Doe "
    };
    const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);
    const cookie = response.get("Set-Cookie");
    return cookie;
}