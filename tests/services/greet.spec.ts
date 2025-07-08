import { describe, expect, it } from "bun:test";
import { GreetService } from "../../src/services/greet";

const greetService = new GreetService();
const names = ["Agata", "Angelo", "Miso"];

describe("GreetService", () => {
	for (const name of names) {
		it(`should greet ${name}`, () => {
			const greet = greetService.greet(name);
			expect(greet).toBe(name);
			expect(greet).toContain("Hello");
			expect(greet).toBe(`Hello ${name}!`);
		});
	}
});
