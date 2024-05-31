import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Containers } from '../../../app';
import { auth } from '$lib/authStore.js';
import { get } from 'svelte/store';

export const load: PageLoad = async ({ parent, data }) => {
	await parent()
	const { form } = data
	const uid = get(auth);
	const containersCollection = collection(db, 'containers');
	const q = query(containersCollection, where('userId', 'array-contains', uid.uid));
	const snapshot = await getDocs(q);
	const fetchedContainers: Containers[] = snapshot.docs.map((doc) => ({
		id: doc.id,
		currentWeight: doc.data().currentWeight,
		foodName: doc.data().foodName
	})) as unknown as Containers[];
	// console.log(fetchedContainers)

	return {
		form,
		initialContainers: fetchedContainers
	};
};
