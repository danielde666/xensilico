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
    // Simplified query to avoid index requirements - just filter by uid
    const uploadsQuery = await db.collection('uploads')
      .where('uid', '==', uid)
      .get();
    
    const uploads = [];
    uploadsQuery.forEach(doc => {
      uploads.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by uploadDate on the client side to avoid index requirements
    uploads.sort((a, b) => {
      const dateA = new Date(a.uploadDate || a.createdAt || 0);
      const dateB = new Date(b.uploadDate || b.createdAt || 0);
      return dateB - dateA; // Descending order
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
