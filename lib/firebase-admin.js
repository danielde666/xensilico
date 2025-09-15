import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK only once
const apps = getApps();
let app;

if (apps.length === 0) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----`,
    }),
    storageBucket: 'xensilico-leads.firebasestorage.app'
  });
} else {
  app = apps[0];
}

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const bucket = getStorage(app).bucket('xensilico-leads.firebasestorage.app');

export default app;
