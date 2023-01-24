import {CustomError} from "./custom-error";

export class BadRequestError extends CustomError {
    public readonly statusCode = 400;

    constructor(message: string) {
        super(message);
    }

    serializeErrors() {
        return [{msg: this.message}]
    }
}