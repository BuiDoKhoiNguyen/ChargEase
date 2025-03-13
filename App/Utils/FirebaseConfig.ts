// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAitOdB9Il71tQlTsVn7A1GW2e82UIZbMw",
  authDomain: "chargease-49ab1.firebaseapp.com",
  projectId: "chargease-49ab1",
  storageBucket: "chargease-49ab1.firebasestorage.app",
  messagingSenderId: "367003687388",
  appId: "1:367003687388:web:9427d72e46e282f12dd719",
  measurementId: "G-VWGRVEGFKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db= getFirestore(app);
export const auth= getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const storage = getStorage(app);

// ios: 596697777402-98oqnqi0nqvs2anuqj17b5ptrht629kc.apps.googleusercontent.com