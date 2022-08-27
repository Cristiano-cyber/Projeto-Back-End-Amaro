import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "not authorized"
    ) {
        super(403, message)
    }
}