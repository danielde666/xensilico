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

  const { uid } = req.query;
  
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const uploadsQuery = await db.collection('uploads')
      .where('uid', '==', uid)
      .orderBy('uploadDate', 'desc')
      .get();
    
    const uploads = [];
    uploadsQuery.forEach(doc => {
      uploads.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({ 
      success: true,
      uploads
    });
  } catch (err) {
    console.error('Uploads fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
}
