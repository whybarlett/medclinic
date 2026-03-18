<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean; title?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; showClose?: boolean }>()
const emit = defineEmits<{ close: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" :aria-modal="open" aria-labelledby="modal-title">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />
        <!-- Panel -->
        <div
          :class="[
            'relative bg-white rounded-modal shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10',
            size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : size === 'xl' ? 'max-w-5xl' : 'max-w-xl'
          ]"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <slot name="header">
              <h2 id="modal-title" class="text-xl font-bold text-textPrimary">{{ title }}</h2>
            </slot>
            <button v-if="showClose !== false" @click="emit('close')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-textSecondary hover:text-textPrimary" aria-label="Закрыть">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <!-- Body -->
          <div class="flex-1 overflow-y-auto">
            <slot />
          </div>
          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-border flex-shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active { transition: all 0.3s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: scale(0.95) translateY(10px); }
.modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
