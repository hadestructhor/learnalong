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
