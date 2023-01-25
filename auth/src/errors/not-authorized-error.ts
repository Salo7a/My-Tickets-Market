import {CustomError} from "./custom-error";

export class NotAuthorizedError extends CustomError {
    public readonly statusCode = 401;
    private reason = "Not Authorized";

    constructor() {
        super("Not Authorized");
    }

    serializeErrors() {
        return [{msg: this.reason}]
    }
}