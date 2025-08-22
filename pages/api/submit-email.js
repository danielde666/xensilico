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
  
  const { email, fullName, company, jobTitle, hospitalsServed, pathologies, newsletterConsent } = req.body;
  
  // Validate required fields
  if (!email || !/^[\w-.]+@[\w-]+\.[\w-]+\.[\w-.]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  if (!fullName || fullName.trim() === '') {
    return res.status(400).json({ error: 'Full name is required' });
  }
  
  if (!jobTitle || jobTitle.trim() === '') {
    return res.status(400).json({ error: 'Job title is required' });
  }
  
  if (!newsletterConsent) {
    return res.status(400).json({ error: 'Newsletter consent is required' });
  }

  try {
    // Check if email already exists
    const emailQuery = await db.collection('emails').where('email', '==', email.toLowerCase()).get();
    
    if (!emailQuery.empty) {
      return res.status(409).json({ error: 'This email is already subscribed!' });
    }

    // Add new subscriber with all form data
    await db.collection('emails').add({
      email: email.toLowerCase(),
      fullName: fullName.trim(),
      company: company ? company.trim() : '',
      jobTitle: jobTitle.trim(),
      hospitalsServed: Array.isArray(hospitalsServed) ? hospitalsServed : [],
      pathologies: Array.isArray(pathologies) ? pathologies : [],
      newsletterConsent: newsletterConsent,
      createdAt: new Date().toISOString(),
    });
    
    console.log('New subscriber added:', { email, fullName, jobTitle });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
}
