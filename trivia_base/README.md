# Trivia Base - Account Deletion Request

A simple Vue 3 application for handling account deletion requests for Trivia Base.

## Setup Instructions

### Prerequisites

- **Node.js 20+** (required for Firebase compatibility)
- **npm 10+**
- **nvm** (recommended for Node version management)

### 1. Node.js Version Management

This project requires Node.js 20+ for Firebase compatibility. Use nvm to manage Node versions:

```bash
# Install Node.js 20 if not already installed
nvm install 20
nvm use 20

# Or use the automatic setup script
cd trivia_base
npm run setup
```

The project includes:
- `.nvmrc` file specifying Node.js 20
- `engines` field in package.json
- Preinstall script to enforce Node version
- Setup script for easy configuration

### 2. Install Dependencies

```bash
cd trivia_base
npm install
```

### 3. Configure Environment Variables

Create environment files for different environments:

#### For Development:
Create `.env.local` file in the `trivia_base` directory:
```bash
# Copy the example file
cp env.example .env.local

# Edit with your actual Firebase values
nano .env.local
```

#### For Production:
Set GitHub Secrets with the same variable names (prefixed with `TRIVIA_BASE_`).

### 4. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Get your Firebase configuration from Project Settings
5. Add the values to your environment files:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
}
```

### 5. Set Up Firestore Security Rules

In the Firestore Database section, go to "Rules" and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /account-deletion-request/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173/trivia_base/`

## Database Structure

Account deletion requests are stored in the `account-deletion-request` collection with:

- `email`: User's email address
- `submittedAt`: Timestamp when request was submitted
- `status`: Request status ('pending', 'processing', 'completed', 'rejected')

## Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.
