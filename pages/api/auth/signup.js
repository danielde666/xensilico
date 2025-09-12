import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

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
const auth = getAuth(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email.toLowerCase(),
      password: password,
      emailVerified: false,
    });

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: email.toLowerCase(),
      fullName: '',
      company: '',
      jobTitle: '',
      hospitalsServed: [],
      pathologies: [],
      profileImageUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isProfileComplete: false,
      hasUploadedData: false
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);
    
    console.log('New user created:', { uid: userRecord.uid, email });
    
    res.status(200).json({ 
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified
      }
    });
  } catch (err) {
    console.error('User creation error:', err);
    
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}
