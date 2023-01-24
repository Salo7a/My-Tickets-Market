import {Request, Response, NextFunction} from "express";
import {CustomError} from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({errors: err.serializeErrors()});
    }
    return res.status(500).send({errors: [{msg: `Error!: ${err.message}`}]});
}