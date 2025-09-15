import { db, bucket } from '../../../lib/firebase-admin';
import formidable from 'formidable';
import fs from 'fs';

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

    // Handle multipart form data using formidable
    console.log('Parsing form data with formidable...');
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      multiples: true, // Allow multiple files
    });

    const [fields, files] = await form.parse(req);
    
    const uid = Array.isArray(fields.uid) ? fields.uid[0] : fields.uid;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const uploadPromises = [];
    const uploadedFiles = [];

    // Handle multiple images
    const imageFiles = Array.isArray(files.images) ? files.images : [files.images];
    
    for (const image of imageFiles) {
      if (image && image.originalFilename) {
        const fileName = `data-images/${uid}/${Date.now()}-${image.originalFilename}`;
        const file = bucket.file(fileName);
        
        // Read file buffer and upload to Firebase Storage
        const fileBuffer = fs.readFileSync(image.filepath);
        const uploadPromise = file.save(fileBuffer, {
          metadata: {
            contentType: image.mimetype,
          },
        }).then(async () => {
          // Make file publicly accessible
          await file.makePublic();
          
          // Get public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          // Create document in Firestore
          const uploadDoc = {
            uid,
            fileName: image.originalFilename,
            fileUrl: publicUrl,
            fileSize: image.size,
            contentType: image.mimetype,
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
    
    console.log('Data uploaded to Firebase Storage:', { uid, fileCount: uploadedFiles.length });
    
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

