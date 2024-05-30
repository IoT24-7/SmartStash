/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore();
const rtdb = admin.database();

exports.syncFieldToFirestore = functions.database.ref('/containers/{id}')
    .onWrite(async (change, context) => {
        const containerData = change.after.val();
        const id = context.params.id;
    
        if (!containerData) {
            // If the field is deleted or set to null, you might decide to delete the document or update the field accordingly
            return firestore.collection('containers').doc(id).update({
                currentWeight: admin.firestore.FieldValue.delete()
            });
        //
        } 
        
        try {
            //Fetch data from firestore
            const docRef = firestore.collection('containers').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                console.log(`Document with ID ${id} not found in Firestore.`);
                return null;
            }
            const firestoreData = doc.data();
            const threshold = firestoreData.threshold
            const foodName = firestoreData.foodName
            const userId = firestoreData.userId
            const currentTimestamp = Date.now();
            const notificationID = firestore.collection('dummyCollection').doc().id;

            const currentWeight = containerData.currentWeight;
            if (currentWeight < threshold) {
                // Iterate over userIDs array to create notifications for each user
                const notificationPromises = userId.map(user => {
                    // Generate a random ID for the notification document
                    // Prepare notification data
                    const notificationData = {
                        foodItem: foodName,
                        timestamp: currentTimestamp,
                        id: notificationID  // Assign the generated ID to the notification data
                    };
                // Add notification for each user
                    return firestore.collection(`users/${user}/notifications`).doc(notificationID).set(notificationData);
                });
                // Update currentWeight and timestamp in the Firestore document
                const weightUpdatePromise = docRef.set({
                    currentWeight: currentWeight,
                    timestamp: currentTimestamp
                }, { merge: true });

                // Wait for all promises to complete
                return Promise.all([...notificationPromises, weightUpdatePromise])
                    .then(() => {
                        console.log(`Notifications added and currentWeight updated for container ID: ${id}`);
                    })
                    .catch(error => {
                        console.error("Error adding notifications and updating currentWeight: ", error);
                    });
                    
            } else {
                // Update the specific field in the Firestore document
                return docRef.set({
                    currentWeight: currentWeight
                }, { merge: true });
            }
        } catch (error) {
            console.error('Error fetching Firestore document:', error);
            throw error;
        }

    });

exports.syncfoodNameToRTDB = functions.firestore
.document('containers/{docId}')
.onWrite(async (change, context) => {
    const newValue = change.after.exists ? change.after.data() : null;
    const previousValue = change.before.exists ? change.before.data() : null;
    const docId = context.params.docId;

    try {
        if (!previousValue && newValue) {
            // Document was created
            if (newValue.foodName) {
                await rtdb.ref(`/containers/${docId}`).update({ foodName: newValue.foodName });
                console.log(`RTDB updated with foodName: ${newValue.foodName} for ID: ${docId}`);
            }
        } else if (previousValue && newValue) {
            // Document was updated
            if (newValue.foodName !== previousValue.foodName) {
                await rtdb.ref(`/containers/${docId}`).update({ foodName: newValue.foodName });
                console.log(`RTDB updated with foodName: ${newValue.foodName} for ID: ${docId}`);
            }
        } else if (!newValue && previousValue) {
            // Document was deleted
            await rtdb.ref(`/containers/${docId}/foodName`).remove();
            console.log(`foodName field removed from RTDB for ID: ${docId}`);
        }
    } catch (error) {
        console.error("Error updating RTDB: ", error);
    }
});

// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.firestore.document('users/{userID}/notifications/{notificationID}').onCreate(
    async (snapshot) => {
      // Notification details.

      const notificationData = snap.data();

      const title = notificationData.foodItem;
      const body = `You're running low on ${notificationData.foodItem}.`;

      const payload = {
        notification: {
            title: title,
            body: body,
            //click_action: "https://yourapp.firebaseapp.com"
        }
      };
  
      // Get the list of device tokens.
      const allTokens = await admin.firestore().collection('fcmTokens').get();
      const tokens = [];
      allTokens.forEach((tokenDoc) => {
        tokens.push(tokenDoc.id);
      });
      
      if (tokens.length > 0) {
        //Subscribe all devices under tokens array
        getMessaging().subscribeToTopic(registrationTekens, topic)
            .then(async (response) => {
                console.log('Successfully subscribed to topic:', response);
                response = await admin.messaging().sendToDevice(tokens, payload);
                await cleanupTokens(response, tokens);
            })
            .catch((error) => {
                console.log('Error subscribing to topic:', error);
            });
        
        functions.logger.log('Notifications have been sent and tokens cleaned up.');
      }
    });

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response, tokens) {
    // For each notification we check if there was an error.
    const tokensDelete = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        functions.logger.error('Failure sending notification to', tokens[index], error);
        // Cleanup the tokens that are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          const deleteTask = admin.firestore().collection('fcmTokens').doc(tokens[index]).delete();
          tokensDelete.push(deleteTask);
        }
      }
    });
    return Promise.all(tokensDelete);
   }