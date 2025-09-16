import { db, auth } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  console.log('Auth signup endpoint called:', req.method);
  console.log('Environment check:', {
    projectId: process.env.FIREBASE_PROJECT_ID ? 'present' : 'missing',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'present' : 'missing',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'present' : 'missing'
  });
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  
  const { email, password } = req.body;
  console.log('Received data:', { email: email ? 'present' : 'missing', password: password ? 'present' : 'missing' });
  
  // Validate required fields
  if (!email || !/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    console.log('Attempting to create user in Firebase Auth...');
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email.toLowerCase(),
      password: password,
      emailVerified: false,
    });
    
    console.log('User created successfully:', userRecord.uid);

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: email.toLowerCase(),
      password: password, // Store password for simple login system
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

    console.log('Creating user profile in Firestore...');
    await db.collection('users').doc(userRecord.uid).set(userProfile);
    console.log('User profile created in Firestore');
    
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
    console.error('Error details:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}
