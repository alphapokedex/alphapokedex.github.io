<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" stroke-width="2"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" stroke-width="2"/>
        </svg>
      </div>
      
      <h1 class="error-title">Connection Error</h1>
      <p class="error-message">{{ errorMessage }}</p>
      
      <div class="error-actions">
        <button @click="retry" class="retry-button" :disabled="isRetrying">
          <svg v-if="isRetrying" class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="60">
              <animate attributeName="stroke-dashoffset" dur="1s" values="60;0" repeatCount="indefinite"/>
            </circle>
          </svg>
          <span v-else>Retry</span>
        </button>
        
        <button @click="goHome" class="home-button">
          Go Home
        </button>
      </div>
      
      <div class="error-details" v-if="showDetails">
        <details>
          <summary>Technical Details</summary>
          <pre class="error-stack">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  errorMessage: string
  errorDetails?: string
  onRetry?: () => Promise<void>
  onGoHome?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  errorDetails: '',
  onRetry: undefined,
  onGoHome: undefined
})

const emit = defineEmits<{
  retry: []
  goHome: []
}>()

const isRetrying = ref(false)
const showDetails = ref(false)

const retry = async () => {
  if (isRetrying.value) return
  
  isRetrying.value = true
  try {
    if (props.onRetry) {
      await props.onRetry()
    } else {
      emit('retry')
    }
  } finally {
    isRetrying.value = false
  }
}

const goHome = () => {
  if (props.onGoHome) {
    props.onGoHome()
  } else {
    emit('goHome')
  }
}

// Show details after a delay
setTimeout(() => {
  showDetails.value = true
}, 3000)
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-container {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.error-message {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.retry-button,
.home-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.retry-button {
  background: #3b82f6;
  color: white;
}

.retry-button:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.home-button {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.home-button:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-details {
  margin-top: 24px;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.error-stack {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  font-size: 12px;
  color: #374151;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 640px) {
  .error-container {
    padding: 32px 20px;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .retry-button,
  .home-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
