<template>
  <div id="app">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">Connecting to database...</p>
      </div>
    </div>

    <!-- Error State -->
    <ErrorPage
      v-else-if="hasError"
      :error-message="errorMessage"
      :error-details="errorDetails"
      @retry="retryFirebaseInit"
      @go-home="goHome"
    />

    <!-- Success State -->
    <AccountDeletionForm v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AccountDeletionForm from './components/AccountDeletionForm.vue'
import ErrorPage from './components/ErrorPage.vue'
import { firebaseInitService } from './firebase/initService'
import { toastService } from './services/toastService'

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')

const initializeFirebase = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    
    // Log current origin for debugging
    console.log('Current origin:', window.location.origin)
    console.log('Current protocol:', window.location.protocol)
    console.log('Current hostname:', window.location.hostname)
    
    const result = await firebaseInitService.initialize(10000) // 10 second timeout
    
    if (result.success) {
      console.log('Firebase initialized successfully')
      isLoading.value = false
    } else {
      throw new Error(result.error || 'Firebase initialization failed')
    }
  } catch (error) {
    console.error('Firebase initialization error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    hasError.value = true
    isLoading.value = false
    
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    errorMessage.value = errorMsg
    
    // Show more detailed error for debugging
    if (error instanceof Error && error.stack) {
      errorDetails.value = error.stack
    }
    
    // Show toast notification
    toastService.error('Failed to connect to database. Please try again.')
  }
}

const retryFirebaseInit = async () => {
  // Reset Firebase service
  firebaseInitService.reset()
  
  // Retry initialization
  await initializeFirebase()
}

const goHome = () => {
  // For now, just retry. In a real app, you might navigate to a different page
  retryFirebaseInit()
}

onMounted(() => {
  initializeFirebase()
})
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-spinner {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
