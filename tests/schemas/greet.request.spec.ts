import { describe, expect, it } from "bun:test";
import {
	GreetRequestSchema,
	mustBeAJson,
	mustBeAString,
	mustNotBeEmpty,
} from "../../src/schemas/greet.request.ts";
import { allButObject, allButString } from "../utils/types.ts";

describe("GreetRequestSchema", () => {
	describe("Invalid body type", () => {
		for (const type of allButObject) {
			const label = `body = ${JSON.stringify(type)}`;
			it(label, () => {
				const result = GreetRequestSchema.safeParse(type);
				expect(result.success).toBe(false);
				expect(result.error).toBeDefined();
				expect(result.error?.format()._errors).toContain(mustBeAJson);
			});
		}
	});

	describe("Invalid name type", () => {
		for (const type of allButString) {
			const label = `name = ${JSON.stringify(type)}`;
			it(label, () => {
				const result = GreetRequestSchema.safeParse({ name: type });
				expect(result.success).toBe(false);
				expect(result.error).toBeDefined();
				expect(result.error?.format().name?._errors).toContain(mustBeAString);
			});
		}

		it("Invalid empty name", () => {
			const result = GreetRequestSchema.safeParse({ name: "" });
			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
			expect(result.error?.format().name?._errors).toContain(mustNotBeEmpty);
		});
	});
});
