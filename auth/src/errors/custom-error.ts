export abstract class CustomError extends Error {
    abstract readonly statusCode: number;

    protected constructor(message: string) {
        super(message);
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto)
    }

    abstract serializeErrors(): { msg: string, field?: string }[]
}