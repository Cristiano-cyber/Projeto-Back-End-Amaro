import { BaseError } from "./BaseError";

export class UnprocessableError extends BaseError {
    constructor(
        message: string = "invalid argument"
    ) {
        super(422, message)
    }
}