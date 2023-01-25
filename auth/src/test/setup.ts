import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";

let mongo: MongoMemoryServer;

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
})