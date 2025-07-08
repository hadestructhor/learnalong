# Add a pre-push hook that automatically runs tests and fails if a test isn't passing

To add a pre-push hook that automatically runs anytime you try to push some code, simple add a file named `pre-push` in `.husky` containing:

```bash
bun test
```

To test it out, change the tests in `tests/services/greet.spec.ts` to the following:

```ts
import { describe, expect, it } from "bun:test";
import { GreetService } from "../../src/services/greet";

const greetService = new GreetService();
const names = ["Agata", "Angelo", "Miso"];

describe("GreetService", () => {
 for (const name of names) {
  it(`should greet ${name}`, () => {
   const greet = greetService.greet(name);
   expect(greet).toBe(name); // failing on purpose here
   expect(greet).toContain("Hello");
   expect(greet).toBe(`Hello ${name}!`);
  });
 }
});
```

Then commit it under with `git commit -m "feat(pre-push): running bun test before pushing"` and try  to `git push` it, you'll see it will fail.

You should see a similar output to this:

```
bun test v1.2.18 (0d4089ea)

tests\schemas\greet.request.spec.ts:
✓ GreetRequestSchema > Invalid body type > body = 1 [15.00ms]
✓ GreetRequestSchema > Invalid body type > body = "2"
✓ GreetRequestSchema > Invalid body type > body = null
✓ GreetRequestSchema > Invalid body type > body = []
✓ GreetRequestSchema > Invalid name type > name = 1
✓ GreetRequestSchema > Invalid name type > name = {} [16.00ms]
✓ GreetRequestSchema > Invalid name type > name = null
✓ GreetRequestSchema > Invalid name type > name = []
✓ GreetRequestSchema > Invalid name type > Invalid empty name

tests\services\greet.spec.ts:
 6 |
 7 | describe("GreetService", () => {
 8 |    for (const name of names) {
 9 |            it(`should greet ${name}`, () => {
10 |                    const greet = greetService.greet(name);
11 |                    expect(greet).toBe(name);
                      ^
error: expect(received).toBe(expected)

Expected: "Agata"
Received: "Hello Agata!"

      at <anonymous> (C:\Users\LENOVO\Documents\projects\learnalong\tests\services\greet.spec.ts:11:18)
✗ GreetService > should greet Agata [78.00ms]
 6 |
 7 | describe("GreetService", () => {
 8 |    for (const name of names) {
 9 |            it(`should greet ${name}`, () => {
10 |                    const greet = greetService.greet(name);
11 |                    expect(greet).toBe(name);
                      ^
error: expect(received).toBe(expected)

Expected: "Angelo"
Received: "Hello Angelo!"

      at <anonymous> (C:\Users\LENOVO\Documents\projects\learnalong\tests\services\greet.spec.ts:11:18)
✗ GreetService > should greet Angelo
 6 | 
 7 | describe("GreetService", () => {
 8 |    for (const name of names) {
 9 |            it(`should greet ${name}`, () => {
10 |                    const greet = greetService.greet(name);
11 |                    expect(greet).toBe(name);
                      ^
error: expect(received).toBe(expected)

Expected: "Miso"
Received: "Hello Miso!"

      at <anonymous> (C:\Users\LENOVO\Documents\projects\learnalong\tests\services\greet.spec.ts:11:18)
✗ GreetService > should greet Miso
------------------------------|---------|---------|-------------------
File                          | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|---------|-------------------
All files                     |  100.00 |  100.00 |
 src\schemas\greet.request.ts |  100.00 |  100.00 |
 src\services\greet.ts        |  100.00 |  100.00 |
 tests\utils\types.ts         |  100.00 |  100.00 |
------------------------------|---------|---------|-------------------

 9 pass
 3 fail
 30 expect() calls
Ran 12 tests across 2 files. [675.00ms]
husky - pre-push script failed (code 1)
error: failed to push some refs to 'github.com:hadestructhor/learnalong.git'
```

Now repair the test to it's previous state. commit the changes under something like `git commit -m "fix(tests): fixing broken tests to push code"`.

Now you should see something like this:

```
```
