<!-- ServiceModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] pointer-events-auto"
        @click.self="closeModal"
        @keydown.esc="closeModal"
        tabindex="-1"
      >
        <Transition
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to"
          appear
        >
          <div
            v-if="modelValue"
            class="modal-content bg-blur p-8 rounded-xl w-[500px] max-w-[90vw] border border-neutral-800/50 shadow-2xl pointer-events-auto transform"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-3xl text-white dm-mono-medium">{{ title }}</h2>
              <button
                @click="closeModal"
                class="text-neutral-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-neutral-800/50"
                aria-label="Close modal"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="space-y-5">
                <div class="input-group">
                  <label class="block text-neutral-300 mb-2 dm-mono-regular">Service Name</label>
                  <input
                    v-model="formData.name"
                    placeholder="Enter service name"
                    required
                    class="modal-input w-full p-4 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-white placeholder-neutral-500 backdrop-blur-sm transition-all duration-300 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-neutral-800/90"
                    @input="$emit('update:name', formData.name)"
                  />
                </div>

                <div class="input-group">
                  <label class="block text-neutral-300 mb-2 dm-mono-regular">Service URL</label>
                  <input
                    v-model="formData.url"
                    placeholder="https://example.com"
                    type="url"
                    required
                    class="modal-input w-full p-4 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-white placeholder-neutral-500 backdrop-blur-sm transition-all duration-300 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-neutral-800/90"
                    @input="$emit('update:url', formData.url)"
                  />
                </div>

                <div class="input-group">
                  <label class="block text-neutral-300 mb-2 dm-mono-regular">Icon</label>
                  <select
                    v-model="formData.icon"
                    class="modal-input w-full p-4 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-white backdrop-blur-sm transition-all duration-300 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-neutral-800/90"
                    @change="$emit('update:icon', formData.icon)"
                  >
                    <option disabled value="" class="text-neutral-500">Select an icon</option>
                    <option 
                      v-for="option in iconOptions" 
                      :key="option.value" 
                      :value="option.value" 
                      class="text-white bg-neutral-800"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="modal-button px-6 py-3 bg-neutral-700/80 rounded-lg text-white hover:bg-neutral-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-neutral-600/50 dm-mono-regular"
                >
                  {{ cancelText }}
                </button>
                <button
                  type="submit"
                  :disabled="!isFormValid || loading"
                  class="modal-button px-6 py-3 bg-green-500/80 hover:bg-green-500 rounded-lg text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 backdrop-blur-sm border border-green-400/50 dm-mono-regular"
                >
                  <span v-if="loading" class="flex items-center space-x-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>{{ loadingText }}</span>
                  </span>
                  <span v-else class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>{{ submitText }}</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, watch, nextTick } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Add New Service'
  },
  submitText: {
    type: String,
    default: 'Add Service'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loadingText: {
    type: String,
    default: 'Saving...'
  },
  loading: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({ name: '', url: '', icon: '' })
  },
  iconOptions: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits([
  'update:modelValue',
  'update:name',
  'update:url', 
  'update:icon',
  'submit',
  'close'
]);

// Reactive form data
const formData = reactive({
  name: '',
  url: '',
  icon: ''
});

// Computed
const isFormValid = computed(() => {
  return formData.name.trim() !== '' && formData.url.trim() !== '';
});

// Methods
const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
  
  // Reset form after animation
  setTimeout(() => {
    resetForm();
  }, 300);
};

const resetForm = () => {
  formData.name = props.initialData.name || '';
  formData.url = props.initialData.url || '';
  formData.icon = props.initialData.icon || '';
};

const handleSubmit = () => {
  if (!isFormValid.value || props.loading) return;
  
  emit('submit', {
    name: formData.name.trim(),
    url: formData.url.trim(),
    icon: formData.icon
  });
};

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    resetForm();
    // Focus first input after modal opens
    nextTick(() => {
      const firstInput = document.querySelector('.modal-input');
      if (firstInput) {
        firstInput.focus();
      }
    });
  }
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.name = newData.name || '';
    formData.url = newData.url || '';
    formData.icon = newData.icon || '';
  }
}, { deep: true, immediate: true });
</script>

<style scoped>
/* Modal backdrop animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Modal content animations */
.modal-content-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: 0.1s;
}

.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

/* Enhanced modal styling */
.modal-content {
  background: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(25px);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Input styling improvements */
.modal-input {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-input:focus {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 4px 12px rgba(59, 130, 246, 0.15),
    0 0 20px rgba(59, 130, 246, 0.1);
}

.modal-input:hover:not(:focus) {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(64, 64, 64, 0.6);
}

/* Button enhancements */
.modal-button {
  position: relative;
  overflow: hidden;
}

.modal-button:hover:not(:disabled) {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Input group animations */
.input-group {
  animation: slideInUp 0.5s ease-out forwards;
}

.input-group:nth-child(2) { animation-delay: 0.1s; }
.input-group:nth-child(3) { animation-delay: 0.2s; }
.input-group:nth-child(4) { animation-delay: 0.3s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Font classes */
.dm-mono-medium {
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-style: normal;
}

.dm-mono-regular {
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  font-style: normal;
}

/* Ensure proper layering */
.modal-content * {
  pointer-events: auto;
  position: relative;
  z-index: 1;
}

/* Custom select styling */
select option {
  background-color: #262626;
  color: white;
  padding: 8px;
}

select:focus option:checked {
  background-color: #3b82f6;
}
</style>
