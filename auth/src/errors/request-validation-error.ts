import {ValidationError} from 'express-validator';
import {CustomError} from "./custom-error";

export class RequestValidationError extends CustomError {
    public readonly statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super("Validation Failed");
    }

    serializeErrors() {
        return this.errors.map((error) => {
            return {msg: error.msg, field: error.param}
        })
    }
}