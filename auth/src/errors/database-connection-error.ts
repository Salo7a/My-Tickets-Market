import {CustomError} from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    public readonly statusCode = 500;
    private reason = "Database Connection Error";

    constructor() {
        super("Database Connection Error");
    }

    serializeErrors() {
        return [{msg: this.reason}]
    }
}