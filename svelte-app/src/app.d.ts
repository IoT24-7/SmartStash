// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export interface Notifs {
	id: string;
	userID: string;
	foodItem: string;
	timestamp: Date;
}

export interface Containers {
	id: string;
	currentWeight: number;
	foodName: string;
	status: boolean;
	threshold: number;
	userId: [];	
}

export {};
