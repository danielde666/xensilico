import { db, auth } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // For now, we'll do a simple email/password check against Firestore
    // In a production app, you'd want to use Firebase Auth's signInWithEmailAndPassword
    const usersQuery = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();
    
    if (usersQuery.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userDoc = usersQuery.docs[0];
    const userData = userDoc.data();
    
    // Simple password check (in production, use proper hashing)
    if (userData.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = userData;
    
    res.status(200).json({ 
      success: true,
      user: {
        uid: userDoc.id,
        ...userWithoutPassword
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
