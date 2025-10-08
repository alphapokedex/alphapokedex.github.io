// This file is deprecated. Use initService.ts instead for Firebase initialization.
// Keeping this file for backward compatibility, but all new code should use firebaseInitService.

import { firebaseInitService } from './initService'

// Export the database instance from the initialization service
export const db = firebaseInitService.getDb()

// Export the app instance from the initialization service  
export default firebaseInitService.getApp()
