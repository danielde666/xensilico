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
  console.log('Local data upload called:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const form = formidable({
      uploadDir: './public/uploads/data-images',
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      multiples: true, // Allow multiple files
    });

    const [fields, files] = await form.parse(req);
    
    const uid = fields.uid[0];
    const uploadedFiles = [];

    // Create user-specific directory
    const userDir = `./public/uploads/data-images/${uid}`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Handle multiple files
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];
    
    for (const file of fileArray) {
      if (file && file.originalFilename) {
        // Generate unique filename
        const timestamp = Date.now();
        const extension = path.extname(file.originalFilename);
        const filename = `${timestamp}-${file.originalFilename}`;
        const filepath = path.join(userDir, filename);
        
        // Move file to user directory
        fs.renameSync(file.filepath, filepath);
        
        // Create upload record
        const uploadDoc = {
          uid,
          fileName: file.originalFilename,
          fileUrl: `/uploads/data-images/${uid}/${filename}`,
          fileSize: file.size,
          contentType: file.mimetype,
          uploadDate: new Date().toISOString(),
          status: 'pending',
          metadata: {}
        };
        
        const docRef = await db.collection('uploads').add(uploadDoc);
        uploadedFiles.push({
          id: docRef.id,
          ...uploadDoc
        });
      }
    }

    // Update user's hasUploadedData status
    await db.collection('users').doc(uid).update({
      hasUploadedData: true,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Local files uploaded:', { uid, fileCount: uploadedFiles.length });
    
    res.status(200).json({ 
      success: true,
      uploads: uploadedFiles
    });
  } catch (err) {
    console.error('Local upload error:', err);
    res.status(500).json({ error: 'Failed to upload files. Please try again.' });
  }
}
