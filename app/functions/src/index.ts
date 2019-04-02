import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export const pushNotifications = functions.firestore
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
      const userRef = db.collection('users').where('username', '==', sender)

      const users = await userRef.get()

      let linkUserToken = []

      let receiverDeviceToken = []
    
      users.forEach(result => {
          linkUserToken = result.data().usersList
          if(linkUserToken.length > 0) {
            for(var i=0; i<linkUserToken.length; i++) {
              let token = result.data().usersList[i].newToken
              receiverDeviceToken.push(token)
            }
          } else if(typeof linkUserToken == "undefined") {
            return console.log('Link user no found')
          }
      })

      return admin.messaging().sendToDevice(receiverDeviceToken, payload)

    })

export const broadcastChats = functions.firestore
    .document('users/{userID}/chats/{chatID}')
    .onCreate(async event => {

      const data = event.data();

      const chatSender = data.sender
      const chatMsg = data.message

      const chatPayload = {
        notification: {
          title: `${chatSender} sent a message`,
          body: chatMsg 
        }
      }

      const chatdb = admin.firestore()
      const chatdeviceRef = chatdb.collection('users').where('username', '==', chatSender)

      const devices = await chatdeviceRef.get()

      let chatTokens = []

      let chatReceiverDevices = []
      
      devices.forEach(result => {
          chatTokens = result.data().usersList
          if(chatTokens.length > 0) {
            for(var i=0; i<chatTokens.length; i++) {
              let token = result.data().usersList[i].newToken
              chatReceiverDevices.push(token)
            }
          } else if(typeof chatTokens == "undefined") {
            return console.log('Link user no found')
          }
      })

      return admin.messaging().sendToDevice(chatReceiverDevices, chatPayload)

    })