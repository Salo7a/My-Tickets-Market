import express from "express";
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from "mongoose";

import {currentUserRouter} from "./routes/current-user";
import {loginRouter} from "./routes/login";
import {logoutRouter} from "./routes/logout";
import {registerRouter} from "./routes/register";
import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";

const app = express();

app.use(json());

// Routes
app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);

// Handle Not Found Errors
app.all('*', async (req, res, next) => {
    throw new NotFoundError();
})

// Error Handler Middleware
app.use(errorHandler);

const startup = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("MongoDB Connection Established");
    } catch (e) {
        console.log(e);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!');
    })
}
startup();