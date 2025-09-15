import { db, bucket } from '../../../lib/firebase-admin';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Parse multipart form data using formidable
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowEmptyFiles: false,
    });

    const [fields, files] = await form.parse(req);
    
    // Extract fields with fallbacks
    const uid = Array.isArray(fields.uid) ? fields.uid[0] : fields.uid;
    const fullName = Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName;
    const company = Array.isArray(fields.company) ? fields.company[0] : fields.company;
    const jobTitle = Array.isArray(fields.jobTitle) ? fields.jobTitle[0] : fields.jobTitle;
    const hospitalsServed = JSON.parse(Array.isArray(fields.hospitalsServed) ? fields.hospitalsServed[0] : fields.hospitalsServed);
    const pathologies = JSON.parse(Array.isArray(fields.pathologies) ? fields.pathologies[0] : fields.pathologies);
    
    if (!uid || !fullName || !jobTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let profileImageUrl = '';
    
    // Handle image upload if provided
    if (files.profileImage && files.profileImage[0]) {
      const image = files.profileImage[0];
      const fileName = `profile-images/${uid}/${Date.now()}-${image.originalFilename}`;
      const file = bucket.file(fileName);
      
      // Read file buffer and upload to Firebase Storage
      const fileBuffer = fs.readFileSync(image.filepath);
      await file.save(fileBuffer, {
        metadata: {
          contentType: image.mimetype,
        },
      });
      
      // Make file publicly accessible
      await file.makePublic();
      
      // Get public URL
      profileImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    // Update user profile in Firestore
    const profileData = {
      fullName: fullName.trim(),
      company: company ? company.trim() : '',
      jobTitle: jobTitle.trim(),
      hospitalsServed,
      pathologies,
      profileImageUrl: profileImageUrl,
      updatedAt: new Date().toISOString(),
      isProfileComplete: true
    };

    await db.collection('users').doc(uid).update(profileData);
    
    console.log('Profile updated in Firebase:', { uid, fullName, jobTitle, profileImageUrl });
    
    res.status(200).json({ 
      success: true,
      user: {
        uid,
        ...profileData
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
}

