import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
    constructor(
        message: string = "resource already exists"
    ) {
        super(409, message)
    }
}