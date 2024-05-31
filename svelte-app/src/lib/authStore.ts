import { writable } from 'svelte/store';

// Initial state
const initialState = {
	uid: ''
};

// Create the store
export const auth = writable(initialState);

// Function to update the auth state
export function setAuthState(uid: string) {
	auth.set({ uid });
}
