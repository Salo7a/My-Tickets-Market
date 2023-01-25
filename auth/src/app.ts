import express from "express";
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";
import {currentUser} from "./middlewares/auth";

import {currentUserRouter} from "./routes/current-user";
import {loginRouter} from "./routes/login";
import {logoutRouter} from "./routes/logout";
import {registerRouter} from "./routes/register";
import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";

const app = express();
/** Trust secure connections from behind a proxy (Ingress-nginx) */
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}))

app.use(currentUser);

// Routes
app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);

// Handle Not Found Errors
app.all('*', async (req, res, next) => {
    console.log(req.originalUrl);
    throw new NotFoundError();
})

// Error Handler Middleware
app.use(errorHandler);

export {app};