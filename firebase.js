import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpzxTFzoPUebjZNBPLuzEGoRzAgEPqvVw",
  authDomain: "chitchat-47e61.firebaseapp.com",
  projectId: "chitchat-47e61",
  storageBucket: "chitchat-47e61.appspot.com",
  messagingSenderId: "961314553611",
  appId: "1:961314553611:web:bb94619bd2571aaf676c0e",
  measurementId: "G-4KR4YR1MFK",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
