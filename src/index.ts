import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

/**
 * Validate the request for expected data.
 * Passes the request to the next middleware if the validation passes or fails.
 * @param {object} validationObject - The object containing the validation rules.
 */
export function validate({
    location,
    data,
    isOptional,
}: {
    location: "body" | "query" | "params";
    data: { [key: string]: [string, RegExp] };
    isOptional?: boolean;
}) {
    return async function (request: Request, _: Response, next: NextFunction) {
        try {
            if (!location) {
                console.error(`Location is missing - '${request.path}'`);
                next(createError(500, "Internal Server Error"));
            }

            if (!data) {
                console.error(`Data is missing - '${request.path}'`);
                next(createError(500, "Internal Server Error"));
            }

            if (typeof data !== "object") {
                console.error(`Data must be a object - '${request.path}'`);
                next(createError(500, "Internal Server Error"));
            }

            for (const key in data) {
                if (request[location][key] === undefined && !isOptional) {
                    next(
                        createError(
                            400,
                            `'${key}' in request ${location} is missing`
                        )
                    );
                }

                const commonErrorMessage = `'${
                    request[location][key]
                }' must be '${data[key][0]}', received as '${typeof request[
                    location
                ][key]}'.`;

                const invalidRegexValidationMessage = `'${request[location][key]}' is not a valid ${key}.`;

                // data[key][1], will have the regex to validate the data if provided.

                // type-check of variable, should be always checked before regex check.
                // otherwise, regex will pass wrong data types checks as okay
                if (typeof request[location][key] !== data[key][0]) {
                    next(createError(400, commonErrorMessage));
                }

                // regex validation
                if (
                    data[key][1] &&
                    !data[key][1].test(request[location][key].toString())
                ) {
                    next(createError(400, invalidRegexValidationMessage));
                }
            }

            for (const key in request[location]) {
                if (!data[key]) {
                    next(
                        createError(
                            400,
                            `Unexpected field '${key}' in request ${location}.'`
                        )
                    );
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default { validate };
