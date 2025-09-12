import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----`,
  }),
});

const db = getFirestore(app);

export default async function handler(req, res) {
  console.log('Simple profile update called:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { uid, fullName, company, jobTitle, hospitalsServed, pathologies } = req.body;
    
    if (!uid || !fullName || !jobTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, skip image upload and just update the profile
    const profileData = {
      fullName: fullName.trim(),
      company: company ? company.trim() : '',
      jobTitle: jobTitle.trim(),
      hospitalsServed: JSON.parse(hospitalsServed),
      pathologies: JSON.parse(pathologies),
      profileImageUrl: '', // No image for now
      updatedAt: new Date().toISOString(),
      isProfileComplete: true
    };

    await db.collection('users').doc(uid).update(profileData);
    
    console.log('Profile updated:', { uid, fullName, jobTitle });
    
    res.status(200).json({ 
      success: true,
      user: {
        uid,
        ...profileData
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
}
