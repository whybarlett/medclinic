<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none',
      fullWidth && 'w-full',
      // Variants
      variant === 'primary' || !variant
        ? 'bg-primary text-white hover:bg-[#00317a] focus:ring-primary rounded-btn'
        : variant === 'secondary'
        ? 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary rounded-btn'
        : variant === 'outline'
        ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary rounded-btn'
        : 'text-textSecondary hover:bg-gray-100 hover:text-textPrimary focus:ring-gray-300 rounded-btn',
      // Sizes
      size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base',
    ]"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <slot />
  </button>
</template>
