import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

export interface FirebaseInitResult {
    success: boolean
    app?: FirebaseApp
    db?: Firestore
    error?: string
}

export class FirebaseInitService {
    private static instance: FirebaseInitService
    private app: FirebaseApp | null = null
    private db: Firestore | null = null
    private initPromise: Promise<FirebaseInitResult> | null = null

    private constructor() { }

    static getInstance(): FirebaseInitService {
        if (!FirebaseInitService.instance) {
            FirebaseInitService.instance = new FirebaseInitService()
        }
        return FirebaseInitService.instance
    }

    async initialize(timeoutMs: number = 10000): Promise<FirebaseInitResult> {
        // Return existing promise if already initializing
        if (this.initPromise) {
            return this.initPromise
        }

        // Return cached result if already initialized
        if (this.app && this.db) {
            return {
                success: true,
                app: this.app,
                db: this.db
            }
        }

        this.initPromise = this._initializeWithTimeout(timeoutMs)
        return this.initPromise
    }

    private async _initializeWithTimeout(timeoutMs: number): Promise<FirebaseInitResult> {
        try {
            // Validate environment variables
            const config = this._getFirebaseConfig()
            if (!this._validateConfig(config)) {
                throw new Error('Invalid Firebase configuration. Please check your environment variables.')
            }

            // Create timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Firebase initialization timed out after ${timeoutMs}ms`))
                }, timeoutMs)
            })

            // Initialize Firebase with timeout
            const initPromise = this._initializeFirebase(config)

            const result = await Promise.race([initPromise, timeoutPromise])

            if (result.app != null || result.db != null) {
                this.app = result.app!
                this.db = result.db!
            } else {
                throw new Error('Firebase initialization failed. No app or db returned.')
            }

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown Firebase initialization error'
            return {
                success: false,
                error: errorMessage
            }
        }
    }

  private _getFirebaseConfig() {
      const config = {
      apiKey: import.meta.env.VITE_TRIVIA_BASE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_TRIVIA_BASE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_TRIVIA_BASE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_TRIVIA_BASE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_TRIVIA_BASE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_TRIVIA_BASE_FIREBASE_APP_ID
    }

      // Debug logging for environment variables
      console.log('Firebase config check:', {
          apiKey: config.apiKey ? '✓ Set' : '✗ Missing',
          authDomain: config.authDomain ? '✓ Set' : '✗ Missing',
          projectId: config.projectId ? '✓ Set' : '✗ Missing',
          storageBucket: config.storageBucket ? '✓ Set' : '✗ Missing',
          messagingSenderId: config.messagingSenderId ? '✓ Set' : '✗ Missing',
          appId: config.appId ? '✓ Set' : '✗ Missing'
      })

      return config
  }

    private _validateConfig(config: any): boolean {
        return !!(
            config.apiKey &&
            config.authDomain &&
            config.projectId &&
            config.storageBucket &&
            config.messagingSenderId &&
            config.appId
        )
    }

    private async _initializeFirebase(config: any): Promise<FirebaseInitResult> {
        try {
            const app = initializeApp(config)
            const db = getFirestore(app)

            return {
                success: true,
                app,
                db
            }
        } catch (error) {
            throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    getApp(): FirebaseApp | null {
        return this.app
    }

    getDb(): Firestore | null {
        return this.db
    }

    isInitialized(): boolean {
        return !!(this.app && this.db)
    }

    reset(): void {
        this.app = null
        this.db = null
        this.initPromise = null
    }
}

// Export singleton instance
export const firebaseInitService = FirebaseInitService.getInstance()
