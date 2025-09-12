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
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

const db = getFirestore(app);
const bucket = getStorage().bucket();

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
    // Parse multipart form data
    const formData = await parseFormData(req);
    const { uid, fullName, company, jobTitle, hospitalsServed, pathologies, profileImage } = formData;
    
    if (!uid || !fullName || !jobTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let profileImageUrl = '';
    
    // Handle image upload if provided
    if (profileImage) {
      const fileName = `profile-images/${uid}/${Date.now()}-${profileImage.name}`;
      const file = bucket.file(fileName);
      
      // Upload file to Firebase Storage
      await file.save(profileImage.data, {
        metadata: {
          contentType: profileImage.type,
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
      hospitalsServed: JSON.parse(hospitalsServed),
      pathologies: JSON.parse(pathologies),
      profileImageUrl: profileImageUrl,
      updatedAt: new Date().toISOString(),
      isProfileComplete: true
    };

    await db.collection('users').doc(uid).update(profileData);
    
    console.log('Profile updated:', { uid, fullName, jobTitle });
    
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

// Helper function to parse multipart form data
function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const fields = {};
    const files = {};
    
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const boundary = req.headers['content-type'].split('boundary=')[1];
      
      if (!boundary) {
        reject(new Error('No boundary found'));
        return;
      }
      
      const parts = buffer.toString().split(`--${boundary}`);
      
      for (const part of parts) {
        if (part.includes('Content-Disposition')) {
          const headerEnd = part.indexOf('\r\n\r\n');
          const header = part.substring(0, headerEnd);
          const body = part.substring(headerEnd + 4, part.length - 2);
          
          const nameMatch = header.match(/name="([^"]+)"/);
          if (nameMatch) {
            const fieldName = nameMatch[1];
            
            if (header.includes('filename=')) {
              // This is a file
              const filenameMatch = header.match(/filename="([^"]+)"/);
              const contentTypeMatch = header.match(/Content-Type: ([^\r\n]+)/);
              
              if (filenameMatch) {
                files[fieldName] = {
                  name: filenameMatch[1],
                  type: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
                  data: Buffer.from(body)
                };
              }
            } else {
              // This is a regular field
              fields[fieldName] = body;
            }
          }
        }
      }
      
      resolve({ ...fields, ...files });
    });
    req.on('error', reject);
  });
}
