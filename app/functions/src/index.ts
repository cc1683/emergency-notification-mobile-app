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

export const broadcastChats = functions.firestore
    .document('users/{userID}/chats/{chatID}')
    .onCreate(async event => {

      const data = event.data();

      const chatsender = data.sender
      const chatmsg = data.message

      const payload = {
        notification: {
          title: `${chatsender} sent a message`,
          body: chatmsg 
        }
      }

      const chatdb = admin.firestore()
      const chatdeviceRef = chatdb.collection('users').where('username', '==', chatsender)

      const devices = await chatdeviceRef.get()

      let chattokens = []

      let chatreceiverDevices = []
      
      devices.forEach(result => {
          chattokens = result.data().usersList
          if(chattokens.length > 0) {
            for(var i=0; i<chattokens.length; i++) {
              let token = result.data().usersList[i].newToken
              chatreceiverDevices.push(token)
            }
          } else if(typeof chattokens == "undefined") {
            console.log('Link users no exist yet')
          }
      })

      return admin.messaging().sendToDevice(chatreceiverDevices, payload).then(result => {
        console.log('success')
        chatreceiverDevices = []
      })

    })
