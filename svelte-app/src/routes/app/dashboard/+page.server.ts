import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const load: PageServerLoad = async ( event ) => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		const session = await event.locals.auth();
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const name = form.data.foodName;
		const macAddress = form.data.macAddress;
		const uid = session?.user?.id;
		const docRef = doc(db, 'containers', macAddress);

		try {
			await updateDoc(docRef, {
				foodName: name,
				userId: arrayUnion(uid),
				checked: false
			});
		} catch (err) {
			return fail(500, {
				error: 'Failed to update document.'
			});
		}

		return {
			form
		};
	}
};
