import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

// Firebase Credentials for Project: taxi-c2ef8 (Verified from Project Settings)
export const firebaseConfig = {
  apiKey: "AIzaSyC0cdfnTx4EZvPLZQPLdpwEbr_DkDKgvl4",
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

let firestoreInstance = null;
try {
  firestoreInstance = getFirestore(app);
} catch (e) {
  console.warn('Firestore database initialization warning:', e);
}
export const db = firestoreInstance;

const isNativeApp = () => {
  if (typeof window === 'undefined') return false;
  return (
    Capacitor.isNativePlatform() ||
    Boolean(window.Capacitor?.isNative) ||
    window.Capacitor?.platform === 'android' ||
    window.Capacitor?.platform === 'ios'
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE SIGN-IN — Production-grade native flow
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attempt native Google Sign-In on Android/iOS.
 * Returns { name, email, photoURL, uid } or null if cancelled/failed.
 * On native: triggers Android system account picker (real phone accounts).
 * Falls through to in-app fallback modal if native fails.
 */
export const signInWithGoogle = async () => {
  // ── Native Android/iOS: Real device account picker ──
  if (isNativeApp()) {
    try {
      // Initialize the native plugin (safe to call multiple times)
      try {
        GoogleAuth.initialize({
          clientId: '256291841083-ueibs1i67ue9dbpjas60ak2vbn37ubc2.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      } catch (initErr) {
        console.log('[GoogleAuth] init note:', initErr?.message || initErr);
      }

      // This triggers the native Android system bottom-sheet account picker
      // showing all real Google accounts logged into the phone.
      // Requires SHA-1 registered in Firebase Console to work natively.
      const googleUser = await GoogleAuth.signIn();

      if (googleUser) {
        const email = (
          googleUser.email ||
          googleUser.authentication?.email ||
          (googleUser.id ? `user_${googleUser.id.slice(-6)}@gmail.com` : null)
        );
        const name = (
          googleUser.displayName ||
          googleUser.name ||
          (googleUser.givenName ? `${googleUser.givenName} ${googleUser.familyName || ''}`.trim() : '') ||
          (email ? email.split('@')[0] : 'Google User')
        );
        const photoURL = googleUser.imageUrl || googleUser.photoUrl || null;
        const uid = googleUser.id || googleUser.userId || 'goog_' + Date.now();

        return { name, email: email || '', photoURL, uid };
      }
    } catch (nativeErr) {
      // User cancelled the picker, or SHA-1 not registered (will fall through)
      console.warn('[GoogleAuth] Native sign-in failed:', nativeErr?.message || nativeErr);
    }
  }

  // ── Return null: LetsYouInScreen will show the in-app fallback picker ──
  return null;
};

/**
 * No-op: redirect result handler disabled (we don't use web redirects)
 */
export const handleGoogleRedirectResult = async () => {
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER PROFILE — Save & Load from Firestore
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Save (or merge-update) a customer profile to Firestore.
 * Document ID is the user's email (normalized) for stable cross-device lookup.
 */
export const saveCustomerToFirestore = async (profile) => {
  if (!profile || (!profile.email && !profile.phone)) return null;

  // Dual-write: save customer profile to TiDB Cloud SQL database as well
  import('./tidbService.js').then(m => {
    if (m.saveCustomerToTiDB) {
      m.saveCustomerToTiDB(profile).catch(() => {});
    }
  }).catch(() => {});

  try {
    const docId = (profile.email || profile.phone).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const ref = doc(db, 'cabsy_customers', docId);
    const payload = {
      ...profile,
      updatedAt: serverTimestamp(),
      lastLogin: new Date().toISOString()
    };
    // Use merge so we don't overwrite trip history fields
    await setDoc(ref, payload, { merge: true });
    return docId;
  } catch (e) {
    console.warn('Firestore saveCustomer failed (offline?):', e);
    return null;
  }
};

/**
 * Load a customer profile from Firestore by email or phone.
 * Returns the profile object, or null if not found.
 */
export const loadCustomerFromFirestore = async (email, phone) => {
  if (!email && !phone) return null;
  try {
    const key = (email || phone).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const ref = doc(db, 'cabsy_customers', key);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (e) {
    console.warn('Firestore loadCustomer failed (offline?):', e);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// RIDE INQUIRIES — Save & Load from Firestore
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Save a new ride inquiry to Firestore under the global `cabsy_inquiries` collection.
 * Also stores a copy under the user's sub-collection for fast per-user history lookup.
 */
export const saveInquiryToFirestore = async (inquiry) => {
  if (!inquiry) return null;
  try {
    // 1. Global admin collection
    const globalRef = collection(db, 'cabsy_inquiries');
    const docRef = await addDoc(globalRef, {
      ...inquiry,
      createdAt: serverTimestamp()
    });

    // 2. Per-user sub-collection (keyed by phone or email)
    const userKey = inquiry.customerPhone || inquiry.customerEmail || inquiry.customerName;
    if (userKey) {
      const userDocId = String(userKey).toLowerCase().replace(/[^a-z0-9]/g, '_');
      const userInqRef = doc(db, 'cabsy_customers', userDocId, 'inquiries', docRef.id);
      await setDoc(userInqRef, { ...inquiry, firestoreId: docRef.id, createdAt: serverTimestamp() });
    }

    return docRef.id;
  } catch (e) {
    console.warn('Firestore saveInquiry failed (offline?):', e);
    return null;
  }
};

/**
 * Load all ride inquiries from Firestore (admin view).
 */
export const loadAllInquiriesFromFirestore = async () => {
  try {
    const ref = collection(db, 'cabsy_inquiries');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore loadAllInquiries failed:', e);
    return [];
  }
};

/**
 * Load ride inquiries for a specific user from their sub-collection.
 */
export const loadUserInquiriesFromFirestore = async (email, phone) => {
  if (!email && !phone) return [];
  try {
    const userDocId = (email || phone).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const ref = collection(db, 'cabsy_customers', userDocId, 'inquiries');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore loadUserInquiries failed:', e);
    return [];
  }
};

/**
 * Update a ride inquiry's status (e.g., Confirmed, In Progress, Completed).
 */
export const updateInquiryStatus = async (firestoreId, newStatus) => {
  if (!firestoreId) return;
  try {
    const ref = doc(db, 'cabsy_inquiries', firestoreId);
    await updateDoc(ref, { status: newStatus, updatedAt: serverTimestamp() });
  } catch (e) {
    console.warn('Firestore updateInquiryStatus failed:', e);
  }
};

/**
 * Delete a ride inquiry from Firestore.
 */
export const deleteInquiryFromFirestore = async (firestoreId) => {
  if (!firestoreId) return;
  try {
    const ref = doc(db, 'cabsy_inquiries', firestoreId);
    await deleteDoc(ref);
  } catch (e) {
    console.warn('Firestore deleteInquiry failed:', e);
  }
};
