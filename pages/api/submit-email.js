// /api/submit-email.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Handle private key formatting - add headers if missing
    privateKey: process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----`,
  }),
});

const db = getFirestore(app);

export default async function handler(req, res) {
    console.log('METHOD:', req.method);

  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { email } = req.body;
  if (!email || !/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    await db.collection('emails').add({
      email,
      createdAt: new Date().toISOString(),
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
}
