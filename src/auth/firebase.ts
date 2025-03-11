// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIEnVZBdiCVhHJuKREUSsrn51CFa-kb-I",
  authDomain: "southern-inovice.firebaseapp.com",
  projectId: "southern-inovice",
  storageBucket: "southern-inovice.firebasestorage.app",
  messagingSenderId: "85497896617",
  appId: "1:85497896617:web:d9cdf8559abf65ee0f93b8",
  measurementId: "G-ZEF64TNKG4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
export { app, auth };
