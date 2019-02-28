import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import { async } from 'q';


admin.initializeApp(functions.config().firebase);



exports.emergencyNotification = functions.firestore
    .document('notifications/{notificationId}')
    .onCreate(async event => {
      const data = event.data().data
      
    })

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
