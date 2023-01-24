import {CustomError} from "./custom-error";

export class NotFoundError extends CustomError {
    public readonly statusCode = 404;

    constructor() {
        super("Route not found");
    }

    serializeErrors() {
        return [{msg: "Not Found"}]
    }
}