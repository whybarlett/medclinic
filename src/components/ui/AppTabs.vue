<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  tabs: { key: string; label: string; count?: number }[]
  modelValue?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const active = ref(props.modelValue ?? props.tabs[0]?.key)
watch(() => props.modelValue, v => { if (v) active.value = v })

function select(key: string) {
  active.value = key
  emit('update:modelValue', key)
}
</script>

<template>
  <div>
    <!-- Tab bar -->
    <div class="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="select(tab.key)"
        :class="[
          'flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px',
          active === tab.key
            ? 'border-primary text-primary'
            : 'border-transparent text-textSecondary hover:text-textPrimary hover:border-gray-200'
        ]"
        :aria-selected="active === tab.key"
        role="tab"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          :class="['text-xs px-1.5 py-0.5 rounded-full font-bold', active === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-textSecondary']"
        >{{ tab.count }}</span>
      </button>
    </div>
    <!-- Content -->
    <div role="tabpanel" class="pt-6">
      <slot :active="active" />
    </div>
  </div>
</template>
