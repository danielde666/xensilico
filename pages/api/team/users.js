import { db } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    console.log('Fetching all users from Firestore...');
    
    // Get all users - simplified query to avoid index requirements
    const usersQuery = await db.collection('users').get();
    
    const users = [];
    usersQuery.forEach(doc => {
      const userData = doc.data();
      console.log(`User found: ${doc.id}`, { 
        fullName: userData.fullName, 
        isProfileComplete: userData.isProfileComplete,
        createdAt: userData.createdAt 
      });
      
      // Only include users with complete profiles
      if (userData.isProfileComplete || userData.fullName) {
        users.push({
          id: doc.id,
          ...userData
        });
      }
    });
    
    console.log(`Total users found: ${users.length}`);
    
    res.status(200).json({ 
      success: true,
      users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
