<script setup lang="ts">
defineProps<{ message: string; type?: 'success' | 'error' | 'info'; show: boolean }>()
</script>
<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="show"
        :class="[
          'fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-card shadow-2xl text-white text-sm font-semibold max-w-sm',
          type === 'error' ? 'bg-error' : type === 'info' ? 'bg-secondary' : 'bg-success'
        ]"
      >
        <svg v-if="type !== 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from { opacity: 0; transform: translateX(60px) scale(0.9); }
.toast-leave-to   { opacity: 0; transform: translateX(60px); }
</style>
