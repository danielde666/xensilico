import { db } from '../../../lib/firebase-admin';

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
