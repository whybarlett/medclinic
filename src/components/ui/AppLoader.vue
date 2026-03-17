<script setup lang="ts">
defineProps<{ variant?: 'card' | 'text' | 'avatar' | 'doctor' }>()
</script>

<template>
  <!-- Doctor card skeleton -->
  <div v-if="variant === 'doctor'" class="card p-5">
    <div class="flex gap-4 mb-4">
      <div class="w-20 h-20 skeleton rounded-2xl flex-shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="h-4 skeleton rounded w-3/4" />
        <div class="h-3 skeleton rounded w-1/2" />
        <div class="h-3 skeleton rounded w-1/3" />
        <div class="h-3 skeleton rounded w-2/5" />
      </div>
    </div>
    <div class="h-3 skeleton rounded w-full mb-4" />
    <div class="flex items-center justify-between">
      <div class="h-5 skeleton rounded w-20" />
      <div class="h-9 skeleton rounded-btn w-28" />
    </div>
  </div>

  <!-- Generic card skeleton -->
  <div v-else-if="variant === 'card'" class="card p-5 space-y-3">
    <div class="h-40 skeleton rounded-xl" />
    <div class="h-4 skeleton rounded w-3/4" />
    <div class="h-3 skeleton rounded w-full" />
    <div class="h-3 skeleton rounded w-2/3" />
    <div class="h-8 skeleton rounded-btn w-28 mt-2" />
  </div>

  <!-- Spinner -->
  <div v-else class="flex items-center justify-center py-12">
    <svg class="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  </div>
</template>
