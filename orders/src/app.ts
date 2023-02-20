import express from "express";
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";
import {currentUser} from "@as-mytix/common";

import {newOrderRouter} from "./routes/new";
import {showOrderRouter} from "./routes/show";
import {indexOrderRouter} from "./routes/index";
import {cancelOrderRouter} from "./routes/cancel";
import {errorHandler} from "@as-mytix/common";
import {NotFoundError} from "@as-mytix/common";

const app = express();
/** Trust secure connections from behind a proxy (Ingress-nginx) */
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // Allow sending unsecure cookies in testing environment
}))

app.use(currentUser);

// Routes
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(cancelOrderRouter);

// Handle Not Found Errors
app.all('*', async (req, res, next) => {
    console.log(req.originalUrl);
    throw new NotFoundError();
})

// Error Handler Middleware
app.use(errorHandler);

export {app};