import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.firebase.apiKey,
  authDomain: Constants.manifest.extra.firebase.authDomain,
  projectId: Constants.manifest.extra.firebase.projectId,
  storageBucket: Constants.manifest.extra.firebase.storageBucket,
  messagingSenderId: Constants.manifest.extra.firebase.messagingSenderId,
  appId: Constants.manifest.extra.firebase.appId,
  measurementId: Constants.manifest.extra.firebase.measurementId,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
