import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken';
import {NotAuthorizedError} from "../errors/not-authorized-error";

interface UserPayload {
    id: string,
    email: string
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        next();
    }

    try {
        req.user = await jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserPayload;
    } catch (e) {
    }
    next();
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new NotAuthorizedError();
    }

    next();
}