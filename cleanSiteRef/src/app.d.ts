// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User;
		}
		interface PageData {
			user?: User;
		}
		// interface PageState {}
		// interface Platform {}
	}

	// Import the User type from our API client
	interface User {
		id: number;
		username: string;
		email: string;
		provider: string;
		confirmed: boolean;
		blocked: boolean;
		createdAt: string;
		updatedAt: string;
	}
}

export {};
