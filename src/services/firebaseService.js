import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase Credentials for Project: taxi-c2ef8
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC8cdfnIx4EzVPLZQPLdpwEbr_DkDKgvl4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taxi-c2ef8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taxi-c2ef8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taxi-c2ef8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "256291841083",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:256291841083:web:c518df88b67dd86172a81e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9LR4KLNPNY"
};

// Initialize Firebase App & Auth Services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    name: user.displayName || 'Google User',
    email: user.email,
    photoURL: user.photoURL
  };
};
