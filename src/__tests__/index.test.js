const { validate } = require("../../lib/cjs/index");

test("Gives error when no arguments are passed", () => {
    expect(() => validate()).toThrow();
});

test("Gives error when no location is passed", () => {
    const next = jest.fn();
    console.error = jest.fn();

    const request = {
        body: {
            name: "John Doe",
            email: "",
        },
    };

    // call the validate function
    validate({ data: { name: { rules: ["string"] } } })(request, null, next);

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
    };

    // call the validate function
    validate({ location: "body" })(request, null, next);

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
    };

    // call the validate function
    validate({ location: "body", data: "string" })(request, null, next);

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
    };

    // call the validate function
    validate({
        location: "body",
        data: {
            name: {
                rules: ["string"],
            },
        },
    })(request, null, next);

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
    };

    // call the validate function
    validate({
        location: "body",
        data: {
            name: {
                rules: ["string"],
            },
            email: {
                rules: ["string"],
            },
        },
    })(request, null, next);

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
    };

    // call the validate function
    validate({
        location: "invalid",
        data: {
            name: {
                rules: ["string"],
            },
        },
    })(request, null, next);

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
    };

    // call the validate function
    validate({
        location: "body",
        data: {
            name: {
                rules: ["string", "invalid regex"],
            },
        },
    })(request, null, next);

    // expect the next function to be called with an error
    expect(next).toBeCalledWith(
        expect.objectContaining({
            message: "Invalid regex provided for 'name' in request body.",
        })
    );
});
