<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ items: { title: string; content: string }[] }>()
const open = ref<number | null>(null)
const toggle = (i: number) => { open.value = open.value === i ? null : i }
</script>

<template>
  <div class="divide-y divide-border">
    <div v-for="(item, i) in items" :key="i">
      <button
        @click="toggle(i)"
        :aria-expanded="open === i"
        class="w-full flex items-center justify-between py-4 text-left font-semibold text-textPrimary hover:text-primary transition-colors"
      >
        {{ item.title }}
        <svg :class="['w-5 h-5 transition-transform text-textSecondary flex-shrink-0', open === i ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <Transition name="accordion">
        <div v-if="open === i" class="pb-4 text-textSecondary text-sm leading-relaxed">
          {{ item.content }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.accordion-enter-active, .accordion-leave-active { transition: all 0.2s ease; overflow: hidden; }
.accordion-enter-from, .accordion-leave-to { opacity: 0; max-height: 0; }
.accordion-enter-to, .accordion-leave-from { opacity: 1; max-height: 400px; }
</style>
