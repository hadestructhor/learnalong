# Add a [bun server](https://bun.sh/docs/api/http) and tests using bun's testing API

We will build a simple Bun server, with a greeting API that will return "Hello $name!" with a POST request to `/api/greet` with a body containing something like this:

```json
{
  "name": "Miso"
}
```

This will in turn return:

```json
{
  "message": "Hello Miso!"
}
```

For now, we'll only take care of the following:

- Unknown routes return an error
- Invalid bodies return an error (a string instead of a JSON for example)
- Invalid types for JSON values (a number for the attribute name instead of a string)

## Dependencies

For the next part, I'm going to use [zod](https://zod.dev/) as the validation layer.
To do so, run:

```bash
bun add zod
```

## Greeting service

Let's make a simple greeting service that we will put under `src/services/greet.ts` containing:

```ts
export class GreetService {
 // biome-ignore lint/complexity/noUselessConstructor: included for test coverage
 constructor() {}
 greet(name: string): string {
  return `Hello ${name}!`;
 }
}

export default new GreetService();
```

The comment for ignoring the biome linting error is related to an issue in bun's test coverage that marks the lack of a constructor as only 50% covered.

## Greeting service tests

For writing the tests, we'll follow the same layout as `src` but add in `.spec` before `.ts`, this can also be `.test`.

Many other types are supported, and this can be easily checked by running `bun test` in the root of your project.
You should see a similar output:

```bash
bun test v1.2.13 (64ed68c9)
The following filters did not match any test files:

XX files were searched [55.00ms]

note: Tests need ".test", "_test_", ".spec" or "_spec_" in the filename (ex: "MyApp.test.ts")

Learn more about the test runner: https://bun.sh/docs/cli/test
```

Create a folder named `tests` on the same root as `src`, then a folder named `services` inside it, and finally a file named `greet.spec.ts` containing:

```ts
import { describe, expect, it } from "bun:test";
import { GreetService } from "../../src/services/greet";

const greetService = new GreetService();
const names = ["Agata", "Angelo", "Miso"];

describe("GreetService", () => {
 for (const name of names) {
  it(`should greet ${name}`, () => {
   const greet = greetService.greet(name);
   expect(greet).toContain(name);
   expect(greet).toContain("Hello");
   expect(greet).toBe(`Hello ${name}!`);
  });
 }
});
```

Run `bun test` again and you should see the following:

```
bun test v1.2.13 (64ed68c9)

tests\services\greet.spec.ts:
✓ GreetService > should greet Agata
✓ GreetService > should greet Angelo
✓ GreetService > should greet Miso

 3 pass
 0 fail
 9 expect() calls
Ran 3 tests across 1 files. [128.00ms]
```

To get test coverage, you can run `bun test --coverage` which should give you a similar output to this:

```
bun test v1.2.13 (64ed68c9)

tests\services\greet.spec.ts:
✓ GreetService > should greet Agata
✓ GreetService > should greet Angelo
✓ GreetService > should greet Miso
-------------------------------------|---------|---------|-------------------
File                                 | % Funcs | % Lines | Uncovered Line #s
-------------------------------------|---------|---------|-------------------
All files                            |  100.00 |  100.00 |
 src\services\greet.ts               |  100.00 |  100.00 |
 tests\services\greet.spec.ts        |  100.00 |  100.00 |
-------------------------------------|---------|---------|-------------------

 3 pass
 0 fail
 9 expect() calls
Ran 3 tests across 1 files. [128.00ms]
```

You can configure running tests with coverage data by default by creating a `bunfig.toml` file at the root of the project containing:

```
[test]
coverage = true
coverageSkipTestFiles = true
coverageReporter = ["text", "lcov"]
```

This will now remove tests from the coverage data, as well as exporting the result of coverage data in `lcov` format, by default in a repository named `coverage` at the root of the project.
You don't need to generate a coverage report, but keep `text` as a reported to see the output in your terminal.

If you rerun just `bun test`, you should see the same output as `bun test --coverage` now.

Now let's talk about the ignored biome rule, I hate to add unnecessary code, but I personally use coverage data locally to make sure I don't push any code that isn't tested.

If you go ahead and remove the constructor from the `src/services/greet.ts` file, which would contain only the following:

```ts
export class GreetService {
 greet(name: string): string {
  return `Hello ${name}!`;
 }
}

export default new GreetService();
```

And run `bun test`, you'll see the following:

```
bun test v1.2.13 (64ed68c9)

tests\services\greet.spec.ts:
✓ GreetService > should greet Agata
✓ GreetService > should greet Angelo
✓ GreetService > should greet Miso
-----------------------|---------|---------|-------------------
File                   | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|---------|-------------------
All files              |   50.00 |  100.00 |
 src\services\greet.ts |   50.00 |  100.00 |
-----------------------|---------|---------|-------------------

 3 pass
 0 fail
 9 expect() calls
Ran 3 tests across 1 files. [175.00ms]
```

This is not a very well known bug in bun's coverage tool, but it is worth to note, and that is why I keep an empty constructor just so I can check all my code is tested (because it is).

The last line is a trick one of my teachers taught me in college. It allows you to define a singleton instance and use it anywhere. You'll see lower how that is relevant late, but I'm talking about this line in `src/services/greet.ts`:

```ts
export default new GreetService();
```

## Validation with zod

We will use zod to validate this greeting request.
Let's create a folder named `schemas` in `src`, and a file named `greet.request.ts` containing the following:

```ts
import { z } from "zod";

export const mustBeAString = "Must be a string.";
export const isRequired = "Is required.";
export const mustNotBeEmpty = "Must be at least 1 character long.";
export const mustBeAJson = "Must be a JSON object.";

export const GreetRequestSchema = z.object(
 {
  name: z
   .string({
    invalid_type_error: mustBeAString,
    required_error: isRequired,
   })
   .min(1, { message: mustNotBeEmpty }),
 },
 {
  invalid_type_error: mustBeAJson,
 },
);
```

The constant `GreetRequestSchema` is a zod schema that validates an object with a field that is named `name` of type `string` and which isn't empty (that has at least one character).

Zod allows us to define multiple errors that we can handle, mainly on invalid or missing an attribute, which we use here for the `name` field.

To see it an action, let's write the tests for it first. Then we will declare a bun server and use the validator along with the greeting service.

## Tests for the zod validators

First, let's just create some utility constants to use in our tests.
In the `tests` folder, create a `utils` folder and inside of it, a `types.ts` containing:

```ts
export const allButString = [1, {}, null, []];
export const allButObject = [1, "2", null, []];
```

We will use these to validate that the object containing name only parses objects, and fails with an error indicating the request excepts a json. And the same for the name field indicating it must be a string.

In the `tests` folder, create a similar folder than in `src`, named `schemas`, and inside create a file named `greet.request.spec.ts` containing the following:

```ts

```

Now running `bun test` should give you a similar output to this:

```
bun test v1.2.13 (64ed68c9)

tests\schemas\greet.request.spec.ts:
✓ GreetRequestSchema > Invalid body type > body = 1 [16.00ms]
✓ GreetRequestSchema > Invalid body type > body = "2"
✓ GreetRequestSchema > Invalid body type > body = null
✓ GreetRequestSchema > Invalid body type > body = []
✓ GreetRequestSchema > Invalid name type > name = 1
✓ GreetRequestSchema > Invalid name type > name = {}
✓ GreetRequestSchema > Invalid name type > name = null
✓ GreetRequestSchema > Invalid name type > name = []
✓ GreetRequestSchema > Invalid name type > Invalid empty name

tests\services\greet.spec.ts:
✓ GreetService > should greet Agata
✓ GreetService > should greet Angelo
✓ GreetService > should greet Miso
------------------------------|---------|---------|-------------------
File                          | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|---------|-------------------
All files                     |  100.00 |  100.00 |
 src\schemas\greet.request.ts |  100.00 |  100.00 |
 src\services\greet.ts        |  100.00 |  100.00 |
 tests\utils\types.ts         |  100.00 |  100.00 |
------------------------------|---------|---------|-------------------

 12 pass
 0 fail
 36 expect() calls
Ran 12 tests across 2 files. [473.00ms]
```

If you're familiar with [jest][https://jestjs.io/], bun's test runner will feel very familiar, and the named testing methods should be the same.

There are some differences that you can check on the official [bun runner](https://bun.sh/docs/cli/test) documentation.

For now, this is all we'll do for out testing with Bun, but feel free at the end of this course to add another endpoint, if you have no idea, I will provide you with a simple exercise.

## Creating a server

To run a bun server, let's first delete, or rename `index.ts` to `server.ts`, and move it into the `src` directory.

Then we will need to change the `package.json` file, specifically the section named module to:

```json
...
 "module": "src/server.ts",
...
```

Instead of the current:

```json
...
 "module": "index.ts",
...
```

Let's also add a simple `dev` script on the `scripts` object in the `package.json` file like so:

```json
...
 "scripts": {
  "prepare": "husky",
  "dev": "bun run src/server.ts -will"
 },
...
```

The `-w` argument stands for `--watch` and will reload the server on any file changes.

Now let's add the code for the simple server, using our zod validator to parse json bodies and our greet service to generate a response to send to the client.

To do so, add the following code into `src/server.ts`:

```ts
import type { BunRequest } from "bun";
import { GreetRequestSchema } from "./schemas/greet.request";
import GreetServiceSingleton, { type GreetService } from "./services/greet";

export const bodyMustBeJson = {
 _errors: ["Invalid media type. Expected JSON body."],
};
export const routeNotFound = {
 _errors: ["Route not found."],
};

export const getServer = (greetService: GreetService) => {
 return Bun.serve({
  routes: {
   "/api/greet": {
    POST: async (req: BunRequest) => {
     let json: unknown;

     try {
      json = await req.json();
     } catch {
      return Response.json(bodyMustBeJson, { status: 400 });
     }

     const parseResult = GreetRequestSchema.safeParse(json);
     if (!parseResult.success) {
      return Response.json(
       { ...parseResult.error.format() },
       {
        status: 400,
       },
      );
     }

     const body = parseResult.data;
     return Response.json({ message: greetService.greet(body.name) });
    },
   },
  },
  fetch(_req) {
   return Response.json(routeNotFound, { status: 404 });
  },
 });
};

getServer(GreetServiceSingleton);
console.log("Server started and listening on port 3000.");
```

## Running and testing the API

We're at the last part of this course. We're going to run and test the API we just built.
As mentioned earlier, we are using both the `GreetService` through the singleton instance that exported by the last line in `src/services/greet.ts` (remember, the hack my teacher taught me, this is how to use it).
We're also using the `GreetRequestSchema` defined in `src/schemas/greet.request.ts` to validate the received JSON body.

Now all that's left to do is to run `bun run dev`, which should output something like this:

```
Server started and listening on port 3000.
```

Now if you have `curl` installed, `postman`, `bruno` or any other tool that you know to use to make HTTP request, you can test that our simple requirements are meant.

### Sending anything but JSON

Run the following curl command to test that an error saying JSON is the expected format is sent when another one is received:

```bash
curl -X POST -H "Content-Type: text/plain" -d "Not JSON" http://localhost:3000/api/greet
```

This should return:

```
{"_errors":["Invalid media type. Expected JSON body."]}
HTTP Status: 400
```

### Wrong JSON body

Run the following command to test that an error is sent containing what is wrong with the payload sent:

```bash
curl -X POST -H "Content-Type: application/json" -d '""' http://localhost:3000/api/greet -w "\nHTTP Status: %{http_code}\n"
```

You should get:

```
{"_errors":["Must be a JSON object."]}
HTTP Status: 400
```

You can try replace the `'""'` with an array like `'[]'` or a number `'1'` and see you will still get the same error.

### Missing name

Run the following command to test that an error is sent indicating that name is missing:

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' http://localhost:3000/api/greet -w "\nHTTP Status: %{http_code}\n"
```

You should see:

```
{"_errors":[],"name":{"_errors":["Is required."]}}
HTTP Status: 400
```

### Wrong name type

Run the following command to test that an error is sent indicating that name must be a string:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":1}' http://localhost:3000/api/greet -w "\nHTTP Status: %{http_code}\n"
```

You should see:

```
{"_errors":[],"name":{"_errors":["Must be a string."]}}
HTTP Status: 400
```

You can also try sending an array or a null and see you'll get the same output.

### Empty string name

Run the following command to test that an error is sent indicating that name must be a string:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":""}' http://localhost:3000/api/greet -w "\nHTTP Status: %{http_code}\n"
```

You should see:

```
{"_errors":[],"name":{"_errors":["Must be at least 1 character long."]}}
HTTP Status: 400
```

### Valid request

Finally, run the same request with any value as a name, and you should see it greeted:

```bash

curl -X POST -H "Content-Type: application/json" -d '{"name":"Miso"}' http://localhost:3000/api/greet -w "\nHTTP Status: %{http_code}\n"
```

You should see:

```
{"message":"Hello Miso!"}
HTTP Status: 200
```

## Bonus

That's pretty much it for today's lesson.
If you want to test out zod, and write your own tests with the bun's test suite, you can do the following:

- Add a /api/add endpoint, that accepts JSON payload containing `{"a : 1, "b": 2}`. This should return the result like so `{"result": 3}`.
- Add a AddRequestSchema that validates the payload above.
- Add a AddtionService that has an `add` method taking two number arguments and returns their addition.
- Add tests for both AdditionService and AddRequestSchema.
- Test it out and make sure it works !

This will require you to check the following documentations:

- zod (currently, version 3 is the standard)
- bun test

See you another time for another course !

Don't forget to commit your changes !
