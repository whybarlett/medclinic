<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useDoctorsStore } from '../../stores/useDoctorsStore'
import { mockClinics } from '../../mocks/index'

const store = useDoctorsStore()
const emit = defineEmits<{ change: [] }>()

const localName = ref(store.filters.name)
const localSpecialty = ref(store.filters.specialty)
const localClinic = ref(store.filters.clinic)
const localSort = ref(store.filters.sort)
const showMobileFilters = ref(false)

const debouncedSearch = useDebounceFn(async () => {
  await store.fetchDoctors({ name: localName.value, page: 1 })
  emit('change')
}, 300)

watch(localName, () => debouncedSearch())

async function applyFilters() {
  await store.fetchDoctors({
    specialty: localSpecialty.value,
    clinic: localClinic.value,
    sort: localSort.value as any,
    name: localName.value,
    page: 1,
  })
  showMobileFilters.value = false
  emit('change')
}

async function resetFilters() {
  localName.value = ''
  localSpecialty.value = ''
  localClinic.value = ''
  localSort.value = 'rating'
  await store.fetchDoctors({ name: '', specialty: '', clinic: '', sort: 'rating', page: 1 })
  emit('change')
}

const sortOptions = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'experience', label: 'По опыту' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
]

const hasActiveFilters = ref(false)
watch([localSpecialty, localClinic, localName], () => {
  hasActiveFilters.value = !!(localSpecialty.value || localClinic.value || localName.value)
})
</script>

<template>
  <div>
    <!-- Desktop filters bar -->
    <div class="hidden md:flex items-center gap-3 flex-wrap">
      <!-- Search -->
      <div class="relative flex-1 min-w-[220px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          v-model="localName"
          placeholder="Имя врача..."
          class="input-field pl-9 py-2.5 text-sm"
        />
      </div>

      <!-- Specialty -->
      <select v-model="localSpecialty" @change="applyFilters" class="input-field py-2.5 text-sm max-w-[180px]">
        <option value="">Все специальности</option>
        <option v-for="s in store.specialties" :key="s" :value="s">{{ s }}</option>
      </select>

      <!-- Clinic -->
      <select v-model="localClinic" @change="applyFilters" class="input-field py-2.5 text-sm max-w-[180px]">
        <option value="">Все клиники</option>
        <option v-for="c in mockClinics" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
      </select>

      <!-- Sort -->
      <select v-model="localSort" @change="applyFilters" class="input-field py-2.5 text-sm max-w-[160px]">
        <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>

      <!-- Reset -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="flex items-center gap-1.5 text-sm text-error hover:text-red-600 font-medium transition-colors px-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        Сбросить
      </button>
    </div>

    <!-- Mobile filters toggle -->
    <div class="md:hidden flex items-center gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="localName" placeholder="Поиск врача..." class="input-field pl-9 py-2.5 text-sm" />
      </div>
      <button
        @click="showMobileFilters = true"
        class="flex items-center gap-2 px-4 py-2.5 border border-border rounded-input text-sm font-medium text-textPrimary hover:border-primary transition-colors relative"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
        Фильтры
        <span v-if="hasActiveFilters" class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center">!</span>
      </button>
    </div>

    <!-- Mobile filters drawer -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showMobileFilters" class="fixed inset-0 z-50 md:hidden">
          <div class="absolute inset-0 bg-black/50" @click="showMobileFilters = false" />
          <Transition name="slide-up-panel">
            <div v-if="showMobileFilters" class="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-lg">Фильтры</h3>
                <button @click="showMobileFilters = false" class="p-2 hover:bg-gray-100 rounded-lg">
                  <svg class="w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div>
                <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Специальность</label>
                <select v-model="localSpecialty" class="input-field text-sm">
                  <option value="">Все специальности</option>
                  <option v-for="s in store.specialties" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Клиника</label>
                <select v-model="localClinic" class="input-field text-sm">
                  <option value="">Все клиники</option>
                  <option v-for="c in mockClinics" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Сортировка</label>
                <select v-model="localSort" class="input-field text-sm">
                  <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
              </div>

              <div class="flex gap-3 pt-2">
                <button @click="resetFilters" class="flex-1 py-3 border border-border rounded-btn text-sm font-semibold text-textSecondary hover:bg-gray-50">
                  Сбросить
                </button>
                <button @click="applyFilters" class="flex-1 py-3 bg-primary text-white rounded-btn text-sm font-semibold hover:bg-primary-600">
                  Применить
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
.slide-up-panel-enter-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-panel-leave-active { transition: transform 0.2s ease-in; }
.slide-up-panel-enter-from, .slide-up-panel-leave-to { transform: translateY(100%); }
</style>
