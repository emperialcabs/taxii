import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase Credentials for Project: taxi-c2ef8
export const firebaseConfig = {
  apiKey: "AIzaSyC0cdfnIx4EzVPLZQPLdpwEbr_DkDKgvl4",
  authDomain: "taxi-c2ef8.firebaseapp.com",
  projectId: "taxi-c2ef8",
  storageBucket: "taxi-c2ef8.firebasestorage.app",
  messagingSenderId: "256291841083",
  appId: "1:256291841083:web:c518df88b67dd86172a81e",
  measurementId: "G-9LR4KLNPNY"
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
