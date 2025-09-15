import { db, bucket } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    console.log('Testing Firebase connection...');
    
    // Test Firestore connection
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('Firestore connection test:', testDoc.exists ? 'Success' : 'No existing test doc');
    
    // Test Storage connection
    const testFile = bucket.file('test/connection.txt');
    const [exists] = await testFile.exists();
    console.log('Storage connection test:', exists ? 'File exists' : 'No test file');
    
    // Test bucket info
    const [metadata] = await bucket.getMetadata();
    console.log('Bucket metadata:', metadata.name);
    
    res.status(200).json({ 
      success: true,
      firestore: 'Connected',
      storage: 'Connected',
      bucket: metadata.name,
      message: 'Firebase connection test successful'
    });
  } catch (err) {
    console.error('Firebase test error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message,
      message: 'Firebase connection test failed'
    });
  }
}
