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
