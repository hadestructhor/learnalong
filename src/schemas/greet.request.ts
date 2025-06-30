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
