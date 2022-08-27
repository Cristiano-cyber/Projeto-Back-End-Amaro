import { UserDatabase } from "../database/UserDatabase"
import { ConflictError } from "../errors/ConflictError"
import { NotFoundError } from "../errors/NotFoundError"
import { RequestError } from "../errors/RequestError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { ILoginInputDTO, ILoginOutputDTO, ISignupInputDTO, ISignupOutputDTO, User, USER_ROLES } from "../models/User"
import { Authenticator, ITokenPayload } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) {}

    public signup = async (input: ISignupInputDTO): Promise<ISignupOutputDTO> => {
        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new RequestError("Invalid name parameter must be a string")
        }

        if (typeof email !== "string") {
            throw new RequestError("Invalid email parameter must be a string")
        }

        if (typeof password !== "string") {
            throw new RequestError("Invalid password parameter must be a string")
        }

        if (name.length < 3) {
            throw new RequestError("Invalid name parameter minimum of 3 characters")
        }

        if (password.length < 6) {
            throw new RequestError("Invalid password parameter minimum of 6 characters")
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            throw new RequestError("invalid email parameter")
        }

        const isEmailAlreadyExists = await this.userDatabase.findByEmail(email)
        
        if (isEmailAlreadyExists) {
            throw new ConflictError("E-mail already registered")
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)

        const user = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL
        )

        await this.userDatabase.createUser(user)

        const payload: ITokenPayload = {
            id: user.getId(),
            role: user.getRole()
        }

        const token = this.authenticator.generateToken(payload)

        const response: ISignupOutputDTO = {
            message: "registration successful",
            token
        }

        return response
    }

    public login = async (input: ILoginInputDTO): Promise<ILoginOutputDTO> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new RequestError("invalid email parameter")
        }

        if (typeof password !== "string") {
            throw new RequestError("invalide password parameter")
        }

        if (password.length < 6) {
            throw new RequestError("Invalid password parameter minimum of 6 characters")
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            throw new RequestError("invalid email parameter")
        }

        const userDB = await this.userDatabase.findByEmail(email)
        
        if (!userDB) {
            throw new NotFoundError("email not registered")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role
        )

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            user.getPassword()
        )

        if (!isPasswordCorrect) {
            throw new UnauthorizedError("Password incorrect")
        }

        const payload: ITokenPayload = {
            id: user.getId(),
            role: user.getRole()
        }

        const token = this.authenticator.generateToken(payload)

        const response: ILoginOutputDTO = {
            message: "Login succssesfully done",
            token
        }

        return response
    }
}