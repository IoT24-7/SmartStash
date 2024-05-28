import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const load: PageLoad = async () => {
	const querySnapshot = await getDocs(collection(db, 'containers'));

	return {
		containers: querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
	};
};
