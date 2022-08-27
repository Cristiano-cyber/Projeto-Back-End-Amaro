import { ProductDatabaseMock } from './../mocks/ProductDatabase';
import { IAddTagInputDTO } from './../../src/models/Product';
import { ProductBusiness } from "../../src/business/ProductBusiness"
import { AuthenticatorMock } from "../mocks/services/AuthenticatorMock"
import { HashManagerMock } from "../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../mocks/services/IdGeneratorMock"
import { BaseError } from "../../src/errors/BaseError"

describe("Testing ProductsBusiness", () => {
    const productsBusiness = new ProductBusiness(
        new ProductDatabaseMock() as unknown as any,
        new IdGeneratorMock(),
        new HashManagerMock(),
        new AuthenticatorMock()
    )

    test("Add tag to product successfully", async () => {

        const input: IAddTagInputDTO = {
            token: "token-mock",
            productId: "8360",
            tagName: "moderno",
        };

        const response = await productsBusiness.addTag(input)

        expect(response.message).toEqual("Tag added successfully!")
    })

    test("retorna erro se token ausente/invalido", async () => {
        expect.assertions(2)
        try {
            const input: IAddTagInputDTO = {
                token: "token",
                productId: "8360",
                tagName: "moderno",
            };
    
            await productsBusiness.addTag(input)

        } catch (error: unknown) {
            if (error instanceof BaseError) {
                expect(error.statusCode).toEqual(401)
                expect(error.message).toEqual("Missing or invalid token.")
            }
        }
    })

    test("retorna erro se tagName ausente", async () => {
        expect.assertions(1)
        try {
            const input: IAddTagInputDTO = {
                token: "token-mock",
                productId: "8360",
                tagName: "",
            };
    
            await productsBusiness.addTag(input)

        } catch (error: unknown) {
            if (error instanceof BaseError) {
                expect(error.statusCode).toEqual(400)
            }
        }
    })

    test("retorna erro se id de produto nao for encontrado", async () => {
        expect.assertions(2)
        try {
            const input: IAddTagInputDTO = {
                token: "token-mock",
                productId: "836",
                tagName: "moderno",
            };
    
            await productsBusiness.addTag(input)

        } catch (error: unknown) {
            if (error instanceof BaseError) {
                expect(error.statusCode).toEqual(404)
                expect(error.message).toEqual("Product not found.")
            }
        }
    })

    test("retorna erro se tagName nao for encontrada", async () => {
        expect.assertions(2)
        try {
            const input: IAddTagInputDTO = {
                token: "token-mock",
                productId: "8360",
                tagName: "verao",
            };
    
            await productsBusiness.addTag(input)

        } catch (error: unknown) {
            if (error instanceof BaseError) {
                expect(error.statusCode).toEqual(404)
                expect(error.message).toEqual("Tag not found.")
            }
        }
    })

    test("retorna erro se tagName ja for relaciona a produto", async () => {
        expect.assertions(2)
        try {
            const input: IAddTagInputDTO = {
                token: "token-mock",
                productId: "8360",
                tagName: "viagem",
            };
    
            await productsBusiness.addTag(input)

        } catch (error: unknown) {
            if (error instanceof BaseError) {
                expect(error.statusCode).toEqual(409)
                expect(error.message).toEqual("Tag already related to product.")
            }
        }
    })

})