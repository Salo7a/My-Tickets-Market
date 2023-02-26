import {app} from "./app";
import mongoose from "mongoose";


const startup = async () => {
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY Has To Be Defined");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI Has To Be Defined");

    try {
        mongoose.set('strictQuery', true); // Preparation for mongoose v8 changes
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connection Established");
    } catch (e) {
        console.error(e);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    })
}

startup();