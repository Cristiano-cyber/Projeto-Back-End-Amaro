import { BaseError } from "./BaseError";

export class RequestError extends BaseError {
    constructor(
        message: string = "invalid request"
    ) {
        super(400, message)
    }
}