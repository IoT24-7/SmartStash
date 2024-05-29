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

exports.syncFieldToFirestore = functions.database.ref('/containers/{id}/currentWeight')
    .onWrite((change, context) => {
        const fieldValue = change.after.val();
        const id = context.params.id;

        if (!fieldValue) {
            // If the field is deleted or set to null, you might decide to delete the document or update the field accordingly
            return firestore.collection('containers').doc(id).update({
                currentWeight: admin.firestore.FieldValue.delete()
            });
        } else {
            // Update the specific field in the Firestore document
            return firestore.collection('containers').doc(id).set({
                currentWeight: fieldValue
            }, { merge: true });
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


