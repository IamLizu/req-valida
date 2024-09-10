import { Request } from "express";
import { validate } from "../index"; // Adjust the path to your actual TS file

describe("Validation Middleware", () => {
    test("Gives error when no location is passed", () => {
        const next = jest.fn();
        console.error = jest.fn();

        const request = {
            body: {
                name: "John Doe",
                email: "",
            },
        } as Request;

        // call the validate function
        validate({
            location: undefined as any,
            data: { name: { rules: ["string", /.*/] } },
        })(request, null as any, next);

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Internal Server Error",
            })
        );

        // expect the console.error to be called with an error
        expect(console.error).toBeCalledWith(
            expect.stringContaining("Location is missing")
        );
    });

    test("Gives error when no data is passed", () => {
        const next = jest.fn();
        console.error = jest.fn();

        const request = {
            body: {
                name: "John Doe",
                email: "",
            },
        } as Request;

        // call the validate function
        validate({ location: "body", data: undefined as any })(
            request,
            null as any,
            next
        );

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Internal Server Error",
            })
        );

        // expect the console.error to be called with an error
        expect(console.error).toBeCalledWith(
            expect.stringContaining("Data is missing")
        );
    });

    test("Gives error when data is not an object", () => {
        const next = jest.fn();
        console.error = jest.fn();

        const request = {
            body: {
                name: "John Doe",
                email: "",
            },
        } as Request;

        // call the validate function
        validate({ location: "body", data: "string" as any })(
            request,
            null as any,
            next
        );

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Internal Server Error",
            })
        );

        // expect the console.error to be called with an error
        expect(console.error).toBeCalledWith(
            expect.stringContaining("Data must be a object")
        );
    });

    test("Gives error when request body contains extra field than expected data", () => {
        const next = jest.fn();

        const request = {
            body: {
                name: "John Doe",
                email: "",
            },
        } as Request;

        // call the validate function
        validate({
            location: "body",
            data: {
                name: {
                    rules: ["string", /.*/],
                },
            },
        })(request, null as any, next);

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Unexpected field 'email' in request body.",
            })
        );
    });

    test("Gives error when request body missing field than expected data", () => {
        const next = jest.fn();

        const request = {
            body: {
                name: "John Doe",
            },
        } as Request;

        // call the validate function
        validate({
            location: "body",
            data: {
                name: {
                    rules: ["string", /.*/],
                },
                email: {
                    rules: ["string", /.*/],
                },
            },
        })(request, null as any, next);

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Missing field 'email' in request body.",
            })
        );
    });

    test("Gives error when request payload location is not supported", () => {
        const next = jest.fn();
        console.error = jest.fn();

        const request = {
            body: {
                name: "John Doe",
            },
        } as Request;

        // call the validate function
        validate({
            location: "invalid" as any,
            data: {
                name: {
                    rules: ["string", /.*/],
                },
            },
        })(request, null as any, next);

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Internal Server Error",
            })
        );

        // expect the console.error to be called with an error
        expect(console.error).toBeCalledWith(
            expect.stringContaining("Invalid location provided")
        );
    });

    test("Gives error when second argument in rules object inside data is not a regex", () => {
        const next = jest.fn();

        const request = {
            body: {
                name: "John Doe",
            },
        } as Request;

        // call the validate function
        validate({
            location: "body",
            data: {
                name: {
                    rules: ["string", "invalid regex" as any],
                },
            },
        })(request, null as any, next);

        // expect the next function to be called with an error
        expect(next).toBeCalledWith(
            expect.objectContaining({
                message: "Invalid regex provided for 'name' in request body.",
            })
        );
    });
});
