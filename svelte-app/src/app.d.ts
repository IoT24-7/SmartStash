// See https://kit.svelte.dev/docs/types#app
// import type { Timestamp } from "firebase/firestore";

import type { StringToBoolean } from "tailwind-variants";

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
	timestamp: number;
}

export interface Containers {
	id: string;
	currentWeight: number;
	foodName: string;
	status: boolean;
	threshold: number;
	userId: string;	
}

export {};
