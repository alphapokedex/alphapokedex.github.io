import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseInitService } from './initService'

export interface AccountDeletionRequest {
  email: string
  submittedAt: any // Firestore timestamp
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  requestId?: string
}

export const submitAccountDeletionRequest = async (email: string): Promise<string> => {
  try {
    // Get the database instance from the initialization service
    const db = firebaseInitService.getDb()
    if (!db) {
      throw new Error('Database not initialized')
    }

    const deletionRequest: Omit<AccountDeletionRequest, 'requestId'> = {
      email: email.trim().toLowerCase(),
      submittedAt: serverTimestamp(),
      status: 'pending'
    }

    const docRef = await addDoc(collection(db, 'account-deletion-request'), deletionRequest)
    
    return docRef.id
  } catch (error) {
    console.error('Error submitting account deletion request:', error)

    // Re-throw the original error to preserve error details for toast handling
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Failed to submit account deletion request. Please try again.')
    }
  }
}
