import { db } from '../../../lib/firebase-admin';

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
