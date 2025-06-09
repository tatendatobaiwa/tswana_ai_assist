import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // For Firestore
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCiG_cDjrxU4VuWW03B757hCLR1GedO4KM",
  authDomain: "tswanapp.firebaseapp.com",
  projectId: "tswanapp",
  storageBucket: "tswanapp.firebasestorage.app",
  messagingSenderId: "14459649912",
  appId: "1:14459649912:web:667db4504677cd7e72d28d",
  measurementId: "G-C7E8RDHBDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;
