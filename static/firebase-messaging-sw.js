importScripts('https://www.gstatic.com/firebasejs/4.0.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.0.0/firebase-messaging.js')

const config = {
    apiKey: 'AIzaSyBZwp66Wjq5N8o577KffHRSbtyTpbLWsHI',
    messagingSenderId: '279639304669'
}

if (!firebase.apps.length) {
    const firebaseApp = firebase.initializeApp(config)
}

const messaging = firebase.messaging()
