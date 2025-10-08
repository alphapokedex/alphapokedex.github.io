import { useToast } from 'vue-toastification'

export interface ToastOptions {
    type?: 'success' | 'error' | 'warning' | 'info'
    timeout?: number
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
}

export class ToastService {
    private static instance: ToastService
    private toast: any

    private constructor() {
        // Toast will be initialized when the app starts
    }

    static getInstance(): ToastService {
        if (!ToastService.instance) {
            ToastService.instance = new ToastService()
        }
        return ToastService.instance
    }

    initialize() {
        this.toast = useToast()
    }

    show(message: string, options: ToastOptions = {}) {
        if (!this.toast) {
            console.warn('Toast service not initialized')
            return
        }

        const defaultOptions = {
            type: 'info' as const,
            timeout: 5000,
            position: 'top-right' as const,
            ...options
        }

        this.toast(message, defaultOptions)
    }

    success(message: string, options: Omit<ToastOptions, 'type'> = {}) {
        this.show(message, { ...options, type: 'success' })
    }

    error(message: string, options: Omit<ToastOptions, 'type'> = {}) {
        this.show(message, { ...options, type: 'error', timeout: 7000 })
    }

    warning(message: string, options: Omit<ToastOptions, 'type'> = {}) {
        this.show(message, { ...options, type: 'warning' })
    }

    info(message: string, options: Omit<ToastOptions, 'type'> = {}) {
        this.show(message, { ...options, type: 'info' })
    }

    // Firebase-specific error handling
    handleFirebaseError(error: any, context: string = 'Firebase operation') {
        let message = `${context} failed`

        if (error?.code) {
            switch (error.code) {
                case 'permission-denied':
                    message = 'You do not have permission to perform this action'
                    break
                case 'unavailable':
                    message = 'Service is temporarily unavailable. Please try again later'
                    break
                case 'deadline-exceeded':
                    message = 'Request timed out. Please try again'
                    break
                case 'not-found':
                    message = 'The requested resource was not found'
                    break
                case 'already-exists':
                    message = 'This item already exists'
                    break
                case 'failed-precondition':
                    message = 'Operation failed due to a precondition'
                    break
                case 'aborted':
                    message = 'Operation was aborted. Please try again'
                    break
                case 'out-of-range':
                    message = 'The operation is out of range'
                    break
                case 'unimplemented':
                    message = 'This operation is not implemented'
                    break
                case 'internal':
                    message = 'Internal error occurred. Please try again later'
                    break
                case 'data-loss':
                    message = 'Data loss occurred. Please contact support'
                    break
                case 'unauthenticated':
                    message = 'You must be authenticated to perform this action'
                    break
                default:
                    message = `${context} failed: ${error.message || error.code}`
            }
        } else if (error?.message) {
            message = `${context} failed: ${error.message}`
        }

        this.error(message)
    }

    // Network error handling
    handleNetworkError(error: any, context: string = 'Network request') {
        let message = `${context} failed`

        if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
            message = 'Network error. Please check your connection and try again'
        } else if (error?.message?.includes('timeout')) {
            message = 'Request timed out. Please try again'
        } else if (error?.message) {
            message = `${context} failed: ${error.message}`
        }

        this.error(message)
    }
}

// Export singleton instance
export const toastService = ToastService.getInstance()
