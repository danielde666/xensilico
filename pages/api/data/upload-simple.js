import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----`,
  }),
  storageBucket: 'xensilico-leads.firebasestorage.app'
});

const db = getFirestore(app);
const bucket = getStorage().bucket();

export default async function handler(req, res) {
  console.log('Simple upload endpoint called:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // For now, let's just simulate a successful upload
    // This will help us test if the issue is with file parsing or Firebase
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create a mock upload record
    const mockUpload = {
      id: `mock-${Date.now()}`,
      uid,
      fileName: 'test-image.jpg',
      fileUrl: 'https://via.placeholder.com/300x300',
      fileSize: 1024,
      contentType: 'image/jpeg',
      uploadDate: new Date().toISOString(),
      status: 'pending',
      metadata: {}
    };

    // Add to Firestore
    await db.collection('uploads').add(mockUpload);

    // Update user's hasUploadedData status
    await db.collection('users').doc(uid).update({
      hasUploadedData: true,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Mock upload created for user:', uid);
    
    res.status(200).json({ 
      success: true,
      uploads: [mockUpload]
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload data. Please try again.' });
  }
}
