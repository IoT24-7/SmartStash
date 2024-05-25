import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Google],
	adapter: FirestoreAdapter({
		credential: cert({
			projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
			clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
		})
	}),
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		}
	},
	trustHost: true
});
