importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': "271421108213"
});

const messaging = firebase.messaging();

// messaging.onMessage(function(payload) {
//   console.log('Message received. ', payload);
// });