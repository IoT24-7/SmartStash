import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const load: PageLoad = async ({ params }) => {
	const containerDoc = doc(db, 'containers', params.containerId);
	const containerSnap = await getDoc(containerDoc);

	let fetchedContainer;
	if (containerSnap.exists()) {
		const data = containerSnap.data();
		fetchedContainer = {
			id: containerSnap.id,
			currentWeight: data.currentWeight,
			foodName: data.foodName,
			threshold: data.threshold,
			checked: data.checked
		};
	} else {
		console.log('No such document!');
	}

	return {
		container: params.containerId,
		initialContainer: fetchedContainer
	};
};
