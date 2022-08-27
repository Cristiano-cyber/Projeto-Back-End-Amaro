import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "invalid credentials"
    ) {
        super(401, message)
    }
}