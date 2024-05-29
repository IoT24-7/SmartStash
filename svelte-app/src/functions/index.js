import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Ensure these are the same as the one in ../firebase/messaging
export const FCM_TOKEN_COLLECTION = 'fcmTokens';
export const FCM_TOKEN_KEY = 'fcmToken';

// Ensure this is the same as the one in ../firebase/firestore
export const RECEIPT_COLLECTION = 'receipts';

admin.initializeApp();

// taken from a video tutorial, WAG TULARAN
export const readReceiptDetails = functions.storage.object().onFinalize(async (object) => {
	const imageBucket = `gs://${object.bucket}/${object.name}`;
	const client = new vision.ImageAnnotatorClient();

	const [textDetections] = await client.textDetection(imageBucket);
	const [annotation] = textDetections.textAnnotations;
	const text = annotation ? annotation.description : '';

	// Parse text

	// Get user ID
	const re = /(.*)\//;
	const uid = re.exec(object.name)[1];

	// Check whether receipt already exists by checking for existing imageBucket so a document isn't
	// created for the same receipt
	let doc = await admin
		.firestore()
		.collection(RECEIPT_COLLECTION)
		.where('imageBucket', '==', imageBucket)
		.get();
	if (doc.empty) {
		const receipt = {
			address: '123 Happy St, Bestcity, World 67890',
			amount: '23.45',
			date: new Date(),
			imageBucket,
			items: 'best appetizer, best main dish, best dessert',
			isConfirmed: false,
			locationName: 'Best Restaurant',
			uid
		};
		await admin.firestore().collection(RECEIPT_COLLECTION).add(receipt);
	}

	// ito yung kumukuha ng fcm token value na gagamitin sa pag send ng notification
	const documentSnapshot = await admin.firestore().collection(FCM_TOKEN_COLLECTION).doc(uid).get();
	const token = documentSnapshot.data()[FCM_TOKEN_KEY];

	const message = 'This is the body';

	const payload = {
		token,
		notification: {
			title: 'This is the title',
			body: message
		}
	};

	admin
		.messaging()
		.send(payload)
		.then((response) => {
			// Response is a message ID string.
			functions.logger.log('Successfully sent message: ', response);
		})
		.catch((error) => {
			functions.logger.log('error: ', error);
		});
});

exports.sendNotificationOnUpdate = functions.firestore
	.document('notifications/{notificationId}')
	.onUpdate(async (change, context) => {
		const newValue = change.after.data();
		const previousValue = change.before.data();

		// Check if the notification is updated
		if (newValue !== previousValue) {
			const payload = {
				notification: {
					title: 'Notification Updated',
					body: `Notification with ID: ${context.params.notificationId} has been updated.`
				}
			};

			// Get the list of device tokens.
			const deviceTokensSnapshot = await admin.firestore().collection('deviceTokens').get();
			const tokens = deviceTokensSnapshot.docs.map((doc) => doc.id);

			if (tokens.length > 0) {
				// Send notifications to all tokens.
				const response = await admin.messaging().sendToDevice(tokens, payload);
				functions.logger.log('Notifications have been sent', response);
			}
		}
	});
