<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' }>()
</script>
<template>
  <span :class="[
    'badge text-xs font-semibold',
    !$props.variant || $props.variant === 'primary' ? 'bg-primary-50 text-primary' :
    $props.variant === 'secondary' ? 'bg-sky-100 text-sky-700' :
    $props.variant === 'success' ? 'bg-green-100 text-green-700' :
    $props.variant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
    $props.variant === 'error' ? 'bg-red-100 text-red-600' :
    'bg-gray-100 text-gray-600'
  ]">
    <slot />
  </span>
</template>
