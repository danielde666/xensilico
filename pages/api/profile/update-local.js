import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Local profile update called:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Parse multipart form data
    const form = formidable({
      uploadDir: './public/uploads/profile-images',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await form.parse(req);
    
    const uid = fields.uid[0];
    const fullName = fields.fullName[0];
    const company = fields.company[0];
    const jobTitle = fields.jobTitle[0];
    const hospitalsServed = JSON.parse(fields.hospitalsServed[0]);
    const pathologies = JSON.parse(fields.pathologies[0]);

    let profileImageUrl = '';
    
    // Handle profile image upload
    if (files.profileImage && files.profileImage[0]) {
      const file = files.profileImage[0];
      
      // Create user-specific directory
      const userDir = `./public/uploads/profile-images/${uid}`;
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = path.extname(file.originalFilename);
      const filename = `${timestamp}-${file.originalFilename}`;
      const filepath = path.join(userDir, filename);
      
      // Move file to user directory
      fs.renameSync(file.filepath, filepath);
      
      // Create URL for local serving
      profileImageUrl = `/uploads/profile-images/${uid}/${filename}`;
    }

    // Update user profile in Firestore
    const profileData = {
      fullName: fullName.trim(),
      company: company ? company.trim() : '',
      jobTitle: jobTitle.trim(),
      hospitalsServed,
      pathologies,
      profileImageUrl,
      updatedAt: new Date().toISOString(),
      isProfileComplete: true
    };

    await db.collection('users').doc(uid).update(profileData);
    
    console.log('Profile updated with local image:', { uid, fullName, profileImageUrl });
    
    res.status(200).json({ 
      success: true,
      user: {
        uid,
        ...profileData
      }
    });
  } catch (err) {
    console.error('Local profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
}
