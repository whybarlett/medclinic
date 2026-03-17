<script setup lang="ts">
defineProps<{
  items: { label: string; to?: string }[]
}>()
</script>

<template>
  <nav aria-label="Хлебные крошки" class="flex items-center gap-1.5 text-sm text-textSecondary flex-wrap">
    <template v-for="(item, i) in items" :key="i">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-primary transition-colors"
      >{{ item.label }}</RouterLink>
      <span v-else class="text-textPrimary font-medium">{{ item.label }}</span>
      <svg
        v-if="i < items.length - 1"
        class="w-3.5 h-3.5 text-gray-300 flex-shrink-0"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </template>
  </nav>
</template>
