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
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Get all users with complete profiles
    const usersQuery = await db.collection('users')
      .where('isProfileComplete', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const users = [];
    usersQuery.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        ...userData
      });
    });
    
    res.status(200).json({ 
      success: true,
      users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
