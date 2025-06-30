export class GreetService {
	// biome-ignore lint/complexity/noUselessConstructor: included for test coverage
	constructor() {}
	greet(name: string): string {
		return `Hello ${name}!`;
	}
}

export default new GreetService();
