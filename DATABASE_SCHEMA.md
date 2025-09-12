# Database Schema

## Firebase Firestore Collections

### Users Collection (`users`)
Document ID: User UID from Firebase Auth

```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,                  // User email (lowercase)
  fullName: string,               // User's full name
  company: string,                // Company/organization (optional)
  jobTitle: string,               // Job title
  hospitalsServed: string[],      // Array of hospital names
  pathologies: string[],          // Array of pathology interests
  profileImageUrl: string,        // URL to profile image in Firebase Storage
  createdAt: string,              // ISO timestamp
  updatedAt: string,              // ISO timestamp
  isProfileComplete: boolean,     // Whether profile setup is complete
  hasUploadedData: boolean        // Whether user has uploaded any data
}
```

### Uploads Collection (`uploads`)
Document ID: Auto-generated

```javascript
{
  id: string,                     // Document ID
  uid: string,                    // User UID who uploaded
  fileName: string,               // Original file name
  fileUrl: string,                // Public URL in Firebase Storage
  fileSize: number,               // File size in bytes
  contentType: string,            // MIME type (image/jpeg, etc.)
  uploadDate: string,             // ISO timestamp
  status: string,                 // 'pending', 'processing', 'completed', 'failed'
  metadata: object                // Additional file metadata
}
```

### Legacy Emails Collection (`emails`)
Document ID: Auto-generated (for backward compatibility)

```javascript
{
  email: string,                  // Email address (lowercase)
  fullName: string,               // Full name
  company: string,                // Company (optional)
  jobTitle: string,               // Job title
  hospitalsServed: string[],      // Array of hospitals
  pathologies: string[],          // Array of pathologies
  newsletterConsent: boolean,     // Newsletter consent
  createdAt: string               // ISO timestamp
}
```

## Firebase Storage Structure

```
/
├── profile-images/
│   └── {uid}/
│       └── {timestamp}-{filename}
└── data-images/
    └── {uid}/
        └── {timestamp}-{filename}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `GET /api/profile/get?uid={uid}` - Get user profile
- `POST /api/profile/update` - Update user profile (multipart)

### Data Management
- `POST /api/data/upload` - Upload data images (multipart)
- `GET /api/data/get?uid={uid}` - Get user's uploaded data

### Legacy
- `POST /api/submit-email` - Legacy newsletter signup
