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
  storageBucket: 'xensilico-leads.firebasestorage.app'
});

const db = getFirestore(app);
const bucket = getStorage().bucket();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Data upload endpoint called:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Check if this is a simple JSON request (not multipart)
    const contentType = req.headers['content-type'];
    
    if (contentType && contentType.includes('application/json')) {
      // Handle simple JSON request
      const { uid, fileCount } = req.body;
      console.log('Simple upload request:', { uid, fileCount });
      
      if (!uid) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Create mock upload records
      const mockUploads = [];
      for (let i = 0; i < (fileCount || 1); i++) {
        const mockUpload = {
          id: `mock-${Date.now()}-${i}`,
          uid,
          fileName: `test-image-${i + 1}.jpg`,
          fileUrl: 'https://via.placeholder.com/300x300',
          fileSize: 1024,
          contentType: 'image/jpeg',
          uploadDate: new Date().toISOString(),
          status: 'pending',
          metadata: {}
        };
        mockUploads.push(mockUpload);
      }

      // Add to Firestore
      for (const upload of mockUploads) {
        await db.collection('uploads').add(upload);
      }

      // Update user's hasUploadedData status
      await db.collection('users').doc(uid).update({
        hasUploadedData: true,
        updatedAt: new Date().toISOString()
      });
      
      console.log('Mock uploads created for user:', uid, 'count:', mockUploads.length);
      
      return res.status(200).json({ 
        success: true,
        uploads: mockUploads
      });
    }

    // Handle multipart form data (original logic)
    console.log('Parsing form data...');
    const formData = await parseFormData(req);
    console.log('Form data parsed:', { uid: formData.uid ? 'present' : 'missing', images: formData.images ? Array.isArray(formData.images) ? formData.images.length : 'single' : 'missing' });
    
    const { uid, images } = formData;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const uploadPromises = [];
    const uploadedFiles = [];

    // Handle multiple images
    const imageFiles = Array.isArray(images) ? images : [images];
    
    for (const image of imageFiles) {
      if (image && image.name) {
        const fileName = `data-images/${uid}/${Date.now()}-${image.name}`;
        const file = bucket.file(fileName);
        
        // Upload file to Firebase Storage
        const uploadPromise = file.save(image.data, {
          metadata: {
            contentType: image.type,
          },
        }).then(async () => {
          // Make file publicly accessible
          await file.makePublic();
          
          // Get public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          // Create document in Firestore
          const uploadDoc = {
            uid,
            fileName: image.name,
            fileUrl: publicUrl,
            fileSize: image.data.length,
            contentType: image.type,
            uploadDate: new Date().toISOString(),
            status: 'pending',
            metadata: {}
          };
          
          const docRef = await db.collection('uploads').add(uploadDoc);
          
          return {
            id: docRef.id,
            ...uploadDoc
          };
        });
        
        uploadPromises.push(uploadPromise);
      }
    }

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    uploadedFiles.push(...results);

    // Update user's hasUploadedData status
    await db.collection('users').doc(uid).update({
      hasUploadedData: true,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Data uploaded:', { uid, fileCount: uploadedFiles.length });
    
    res.status(200).json({ 
      success: true,
      uploads: uploadedFiles
    });
  } catch (err) {
    console.error('Data upload error:', err);
    console.error('Error details:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Failed to upload data. Please try again.' });
  }
}

// Helper function to parse multipart form data
function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'];
      
      if (!contentType || !contentType.includes('multipart/form-data')) {
        reject(new Error('Invalid content type'));
        return;
      }
      
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        reject(new Error('No boundary found'));
        return;
      }
      
      const parts = buffer.toString().split(`--${boundary}`);
      const fields = {};
      const files = [];
      
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
                files.push({
                  name: filenameMatch[1],
                  type: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
                  data: Buffer.from(body)
                });
              }
            } else {
              // This is a regular field
              fields[fieldName] = body;
            }
          }
        }
      }
      
      resolve({ ...fields, images: files });
    });
    req.on('error', reject);
  });
}
