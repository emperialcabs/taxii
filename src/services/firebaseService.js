import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
export const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      name: user.displayName || 'Google User',
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid
    };
  } catch (e) {
    console.warn("Firebase Google Auth popup unavailable, using direct login session:", e);
    return {
      name: 'Google User',
      email: 'user@empirecab.in',
      photoURL: null,
      uid: null
    };
  }
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
 * Load all inquiries for a specific user (by phone or email) from Firestore.
 * Falls back to empty array on error/offline.
 */
export const loadUserInquiriesFromFirestore = async (phone, email) => {
  if (!phone && !email) return [];
  try {
    const userKey = phone || email;
    const userDocId = String(userKey).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const inqColRef = collection(db, 'cabsy_customers', userDocId, 'inquiries');
    const q = query(inqColRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore loadUserInquiries failed (offline?):', e);
    return [];
  }
};

/**
 * Load ALL inquiries (for Admin Portal) from Firestore.
 */
export const loadAllInquiriesFromFirestore = async () => {
  try {
    const snap = await getDocs(collection(db, 'cabsy_inquiries'));
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore loadAllInquiries failed (offline?):', e);
    return [];
  }
};

/**
 * Update the status of an inquiry in Firestore (e.g. Confirmed, Cancelled).
 */
export const updateInquiryStatusInFirestore = async (firestoreId, status, driverName) => {
  if (!firestoreId) return;
  try {
    const ref = doc(db, 'cabsy_inquiries', firestoreId);
    await updateDoc(ref, {
      status,
      ...(driverName ? { driver: driverName } : {}),
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('Firestore updateInquiryStatus failed (offline?):', e);
  }
};

/**
 * Load ALL customer profiles from Firestore (for Admin Portal Customer Directory).
 */
export const loadAllCustomersFromFirestore = async () => {
  try {
    const snap = await getDocs(collection(db, 'cabsy_customers'));
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore loadAllCustomers failed (offline?):', e);
    return [];
  }
};

/**
 * Purge demo customer documents from Firestore
 */
export const purgeDemoDataFromFirestore = async () => {
  try {
    const snap = await getDocs(collection(db, 'cabsy_customers'));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const name = (data.name || '').toLowerCase();
      const email = (data.email || '').toLowerCase();
      if (
        name.includes('ankit mehta') ||
        name.includes('bhavin patel') ||
        name.includes('website guest') ||
        name.includes('john doe') ||
        email.endsWith('@customer.com') ||
        email.endsWith('@client.com') ||
        docSnap.id.includes('ankit') ||
        docSnap.id.includes('bhavin')
      ) {
        await deleteDoc(doc(db, 'cabsy_customers', docSnap.id));
      }
    }
  } catch (e) {
    console.warn('Firestore purgeDemoData error:', e);
  }
};

