<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  limit: number
}>()
const emit = defineEmits<{ 'update:page': [number] }>()

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const pages = computed(() => {
  const all: (number | '…')[] = []
  const p = props.page
  const t = totalPages.value
  if (t <= 7) {
    for (let i = 1; i <= t; i++) all.push(i)
    return all
  }
  all.push(1)
  if (p > 3) all.push('…')
  for (let i = Math.max(2, p - 1); i <= Math.min(t - 1, p + 1); i++) all.push(i)
  if (p < t - 2) all.push('…')
  all.push(t)
  return all
})

function go(n: number) {
  if (n >= 1 && n <= totalPages.value) emit('update:page', n)
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1" role="navigation" aria-label="Пагинация">
    <button
      @click="go(page - 1)"
      :disabled="page === 1"
      class="w-9 h-9 rounded-btn border border-border flex items-center justify-center text-textSecondary hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label="Предыдущая"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>

    <template v-for="(p, i) in pages" :key="i">
      <span v-if="p === '…'" class="w-9 h-9 flex items-center justify-center text-textSecondary text-sm">…</span>
      <button
        v-else
        @click="go(p as number)"
        :class="[
          'w-9 h-9 rounded-btn text-sm font-semibold transition-all',
          page === p ? 'bg-primary text-white shadow-sm' : 'border border-border text-textPrimary hover:border-primary hover:text-primary'
        ]"
        :aria-current="page === p ? 'page' : undefined"
      >{{ p }}</button>
    </template>

    <button
      @click="go(page + 1)"
      :disabled="page === totalPages"
      class="w-9 h-9 rounded-btn border border-border flex items-center justify-center text-textSecondary hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label="Следующая"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
  </div>
</template>
