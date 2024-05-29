import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { getDoc, doc } from 'firebase/firestore';

export const load: PageLoad = async ({ params }) => {
	const docRef = doc(db, 'containers', params.containerId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		// console.log('Document data:', docSnap.data());
		return { container: docSnap.data() };
	} else {
		// doc.data() will be undefined in this case
		// console.log('No such document!');
		return { container: null };
	}
};
