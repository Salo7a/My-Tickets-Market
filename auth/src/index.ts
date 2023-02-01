import {app} from "./app";
import mongoose from "mongoose";


const startup = async () => {
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY Has To Be Defined");

    try {
        mongoose.set('strictQuery', true); // Preparation for mongoose v8 changes
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("MongoDB Connection Established");
    } catch (e) {
        console.log(e);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    })
}

startup();