importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCDfKhbG1VApFFMynFVeoxQ9BTRtam72_8',
  authDomain: 'papx-ws-prod.firebaseapp.com',
  projectId: 'papx-ws-prod',
  storageBucket: 'papx-ws-prod.appspot.com',
  appId: '1:279183721577:web:4afaac166beeae64b4cef8',
  measurementId: 'G-CNQ1G0DBVK',
  messagingSenderId: '279183721577',
  // messagingSenderId: '279183721577',
});

const messaging = firebase.messaging();
// This step is only mentioned in this guide: https://firebase.google.com/docs/cloud-messaging/js/client
// Don't know if it's actually needed
// Add the public key generated from the console here.
// messaging.getToken({vapidKey:
//   'BLMc6q6gjxMyDxDndo3Trll2_d40sGJJjbzhl1XwCIyvNUsrYilNrx9hRdGKfH5NIfbrtQwgtjmDbqHZLvUjq8k'}
// );
