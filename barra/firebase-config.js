// barra/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBceYCUr-PyJl0G1E4wS2dGwBidz_Rn-cc",
  authDomain: "jjfutbol-b07c0.firebaseapp.com",
  databaseURL: "https://jjfutbol-b07c0-default-rtdb.firebaseio.com",
  projectId: "jjfutbol-b07c0",
  storageBucket: "jjfutbol-b07c0.firebasestorage.app",
  messagingSenderId: "99569181408",
  appId: "1:99569181408:web:807cd92e9cea82c19a2685"
};

if (typeof firebase === 'undefined') {
  console.log("⚠️ Firebase no cargado aún");
} else if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ Firebase inicializado");
}
