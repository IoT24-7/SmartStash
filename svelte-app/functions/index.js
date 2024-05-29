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
    .onWrite((change, context) => {
        const containerData = change.after.val();
        const id = context.params.id;
    
        // Get currentWeight and threshold from container data
        const currentWeight = containerData.currentWeight;
        const threshold = containerData.threshold;
        const origfoodData = containerData.foodData;
        const origTimestamp = containerData.timestamp;
        const origUserID = containerData.userID;

        if (!currentWeight) {
            // If the field is deleted or set to null, you might decide to delete the document or update the field accordingly
            return firestore.collection('containers').doc(id).update({
                currentWeight: admin.firestore.FieldValue.delete()
            });
        //
        } else if (currentWeight < threshold) {
            //add a new entry sa users/{id}/notifications/{id}
            const notificationData = {
                foodData: origfoodData,
                id: id,
                timestamp: origTimestamp,
                userID: origUserID
            };

            return admin.firestore().collection(`users/${id}/notifications`).doc().add(notificationData);

        }
        
        else {
            // Update the specific field in the Firestore document
            return firestore.collection('containers').doc(id).set({
                currentWeight: fieldValue
            }, { merge: true });
        }
    });

