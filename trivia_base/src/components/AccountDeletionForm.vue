<template>
  <div class="container">
    <div class="form-container">
      <h1>Account Deletion Request</h1>
      <p class="description">
        Please enter your email address to submit a request for account deletion from Trivia Base. 
        We will process your request within 24-48 hours.
      </p>
      
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address *</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            :class="{ 'error': emailError }"
            placeholder="Enter your email address"
            required
            :disabled="isSubmitting"
            @input="handleEmailInput"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>
        
        <button 
          type="submit" 
          class="submit-button"
          :disabled="isSubmitting || !isFormValid"
          :class="{ 'loading': isSubmitting }"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Deletion Request</span>
        </button>
      </form>
      
      <div v-if="successMessage" class="success-message">
        <h3>Request Submitted Successfully!</h3>
        <p>{{ successMessage }}</p>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { submitAccountDeletionRequest } from '../firebase/accountDeletionService'
import { firebaseInitService } from '../firebase/initService'
import { toastService } from '../services/toastService'

const email = ref('')
const emailError = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isFormValid = computed(() => {
  return email.value.trim() !== '' && !emailError.value
})

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleEmailInput = () => {
  emailError.value = ''
  if (email.value && !validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
  }
}

const handleSubmit = async () => {
  // Clear previous messages
  successMessage.value = ''
  errorMessage.value = ''
  
  // Check if Firebase is initialized
  if (!firebaseInitService.isInitialized()) {
    toastService.error('Database connection is not available. Please refresh the page and try again.')
    return
  }
  
  // Validate email
  if (!email.value.trim()) {
    emailError.value = 'Email is required'
    return
  }
  
  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return
  }
  
  isSubmitting.value = true
  
  try {
    const requestId = await submitAccountDeletionRequest(email.value)
    successMessage.value = `Your account deletion request has been submitted successfully. Request ID: ${requestId}. We will process your request within 24-48 hours.`
    email.value = ''
    
    // Show success toast
    toastService.success('Account deletion request submitted successfully!')
  } catch (error) {
    console.error('Account deletion error:', error)
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('timeout')) {
        toastService.handleNetworkError(error, 'Account deletion request')
      } else if (error.message.includes('permission') || error.message.includes('auth')) {
        toastService.handleFirebaseError(error, 'Account deletion request')
      } else {
        toastService.error('Failed to submit deletion request. Please try again.')
      }
      
      errorMessage.value = error.message
    } else {
      toastService.error('An unexpected error occurred. Please try again.')
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
