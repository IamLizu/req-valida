# req-valida

A strict express request validator middleware, used for ensuring the payload meets the requirement of an endpoint.

Whether `amount` is required in `request.body` or `customerID` in `request.params`, `req-valida` can handle everything. As a strict validator, `req-valida` throws error for any field present in request that is not expected for an endpoint.

> _valida_ is a Romanian verb, which means **validate** in English language.

`req-valida` enables the strict type-checking for request payloads even in Javascript projects. With the extra validation available via the `rules` (see bellow in `data` section), `req-valida` can be a single tool for all sorts of payload validation.

## Installation

```
npm install req-valida
```

or

```
yarn add req-valida
```

## Usage

For `cjs`,

```js
const { validate } = require("req-valida");
```

For `esm`,

```js
import { validate } from "req-valida";
```

`validate` method takes an object of which looks like,

```js
// regex is required here to be used in rules

{
  location: "body",
  data: {
    amount: {
        rules: ["number", regex.number],
    },
    customerID: {
        rules: ["string"],
        isOptional: true,
    },
  },
}
```

### `location`

`location` can be `body` | `query` | `params`. The `validate` method will use `location` to look for required `data` on each invocation.

### `data`

`data` object should be defined as how the payload is expected for that endpoint. However, each key in `data` object must have `rules` array. First element on `rules` array is the expected type of the key (in string format). Such as, in above example, `amount` is required in the body of some endpoint, and `amount` must be a `number`.

Second element on the `rules` array is optional [RegEx](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) validation. If provided, `validate` will `test` the value of the `amount` against the RegEx string.

### `isOptional`

After that, there's another optional property `isOptional` which can be sent with the each fields. Such as, in above example, `customerID` is optional in that request, so `isOptional` is sent `true`.

There can be case where every field in request is optional, in that case, instead of sending `isOptional` with the fields, `validate` allows another property outside of `data` called `isOptional` (similar to the fields) for these situation. It will tell `validate` to consider the whole `data` object to be optional.

## Examples

An example router with `validate` from `req-valida`,

```js
// necessary and required lines here

paymentRouter.post(
    "/intent",

    validate({
        location: "body",
        data: {
            amount: {
                rules: ["number", regex.number],
            },
            customerID: {
                rules: ["string"],
                isOptional: true,
            },
        },
    }),

    (request, response, next) => Payment.Intent.create(request, response, next)
);

// necessary and required lines here
```

`validate` should be used used on the same endpoint for separate concerns. For example, an endpoint might have something in the `request.params` and something in `request.body`, then it will look like,

```js
// necessary and required lines here

customerRouter.put(
    "/:customerID",

    validate({
        location: "params",
        data: {
            customerID: {
                rules: ["string"],
            },
        },
    }),

    validate({
        location: "body",
        data: {
            name: {
                rules: ["string"],
            },
            email: {
                rules: ["string", regex.email],
            },
            phone: {
                rules: ["string", regex.phone],
            },
        },
        isOptional: true,
    }),

    (request, response, next) => Customer.update(request, response, next)
);

// necessary and required lines here
```

## Contributing

While this is being used in some projects, `req-valida` has to improve a lot. A few things like unit-test, changelog, contributing guide, and a better README etc. needs to be added.

Even discussing about the `req-valida` in the GitHub repository's discussion is a form of contribution.

All contributions are welcomed. Interested parties are requested to follow the general procedure until the steps are explicitly mentioned here.
