import { db } from '../../../lib/firebase-admin';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    // Parse multipart form data with better error handling
    const form = formidable({
      uploadDir: './tmp',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowEmptyFiles: false,
    });

    const [fields, files] = await form.parse(req);
    console.log('Form parsed successfully');
    
    // Extract fields with fallbacks
    const uid = Array.isArray(fields.uid) ? fields.uid[0] : fields.uid;
    const fullName = Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName;
    const company = Array.isArray(fields.company) ? fields.company[0] : fields.company;
    const jobTitle = Array.isArray(fields.jobTitle) ? fields.jobTitle[0] : fields.jobTitle;
    const hospitalsServed = JSON.parse(Array.isArray(fields.hospitalsServed) ? fields.hospitalsServed[0] : fields.hospitalsServed);
    const pathologies = JSON.parse(Array.isArray(fields.pathologies) ? fields.pathologies[0] : fields.pathologies);

    console.log('Fields extracted:', { uid, fullName, jobTitle });

    let profileImageUrl = '';
    
    // Handle profile image upload
    if (files.profileImage && files.profileImage[0]) {
      const file = files.profileImage[0];
      console.log('Processing image:', file.originalFilename);
      
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
      console.log('Image saved:', profileImageUrl);
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

    console.log('Updating Firestore...');
    await db.collection('users').doc(uid).update(profileData);
    
    console.log('Profile updated successfully:', { uid, fullName, profileImageUrl });
    
    res.status(200).json({ 
      success: true,
      user: {
        uid,
        ...profileData
      }
    });
  } catch (err) {
    console.error('Local profile update error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: `Failed to update profile: ${err.message}` });
  }
}
