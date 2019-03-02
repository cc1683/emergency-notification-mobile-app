import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import { async } from 'q';


admin.initializeApp(functions.config().firebase);

export const emergencyNotif = functions.firestore
    .document('users/{userID}/notifications/{notificationID}')
    .onCreate(async event => {

      const data = event.data();

      const sender = data.sender
      const msg = data.message

      const payload = {
        notification: {
          title: `${sender} need your help!`,
          body: msg 
        }
      }

      const db = admin.firestore()
      const deviceRef = db.collection('users').where('username', '==', sender)

      const devices = await deviceRef.get()

      let tokens = []

      let receiverDevices = []
      
      devices.forEach(result => {
          tokens = result.data().usersList
          if(tokens.length > 0) {
            for(var i=0; i<tokens.length; i++) {
              let token = result.data().usersList[i].newToken
              receiverDevices.push(token)
            }
          }
      })

      return admin.messaging().sendToDevice(receiverDevices, payload).then(result => {
        console.log('success')
        receiverDevices = []
      })

    })
