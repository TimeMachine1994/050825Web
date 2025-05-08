// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: import('$lib/api/auth').User;
			token?: string;
		}
		// interface PageData {}
		// interface Platform {}
		
		// Define the shape of the user for authentication
		interface User {
			id: number;
			username: string;
			email: string;
			provider: string;
			confirmed: boolean;
			blocked: boolean;
			createdAt: string;
			updatedAt: string;
			role?: {
				id: number;
				name: string;
				description: string;
				type: string;
			};
		}
		
		// Define the shape of the authentication state
		interface AuthState {
			user: User | null;
			token: string | null;
			loading: boolean;
			error: string | null;
		}
	}
}

export {};
