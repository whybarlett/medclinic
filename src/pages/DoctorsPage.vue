<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDoctorsStore } from '../stores/useDoctorsStore'
import DoctorCard from '../components/doctors/DoctorCard.vue'
import DoctorFilters from '../components/doctors/DoctorFilters.vue'
import AppPagination from '../components/ui/AppPagination.vue'
import AppLoader from '../components/ui/AppLoader.vue'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'

const store = useDoctorsStore()
const route = useRoute()
const router = useRouter()
const currentPage = ref(Number(route.query.page) || 1)

const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Врачи' }]

onMounted(async () => {
  await store.fetchDoctors({ name: (route.query.q as string) || '', page: currentPage.value })
})

async function onPageChange(page: number) {
  currentPage.value = page
  router.replace({ query: { ...route.query, page: page > 1 ? page : undefined } })
  await store.fetchDoctors({ page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resultLabel = computed(() => store.isLoading ? 'Поиск...' : `Найдено ${store.total} врачей`)
</script>

<template>
  <main class="min-h-screen bg-background">
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <AppBreadcrumbs :items="breadcrumbs" class="mb-3" />
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">Врачи клиники</h1>
            <p class="text-textSecondary text-sm mt-1">Найдите специалиста и запишитесь онлайн</p>
          </div>
          <div class="bg-primary-50 text-primary text-sm font-semibold px-4 py-2 rounded-full">{{ resultLabel }}</div>
        </div>
      </div>
    </div>

    <div class="container-custom py-6">
      <div class="bg-white rounded-card p-4 border border-border mb-6 shadow-sm">
        <DoctorFilters @change="currentPage = 1" />
      </div>

      <div class="flex gap-2 flex-wrap mb-6">
        <button
          v-for="spec in store.specialties.slice(0, 9)"
          :key="spec"
          @click="store.fetchDoctors({ specialty: spec, page: 1 })"
          :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border', store.filters.specialty === spec ? 'bg-primary text-white border-primary' : 'bg-white text-textSecondary border-border hover:border-primary/40 hover:text-primary']"
        >{{ spec }}</button>
        <button
          v-if="store.filters.specialty"
          @click="store.fetchDoctors({ specialty: '', page: 1 })"
          class="px-3 py-1.5 rounded-full text-xs font-semibold border border-error text-error hover:bg-red-50 transition-colors"
        >✕ Сбросить</button>
      </div>

      <div v-if="store.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AppLoader v-for="i in 8" :key="i" variant="doctor" />
      </div>

      <div v-else-if="store.doctors.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <RouterLink v-for="doctor in store.doctors" :key="doctor.id" :to="`/doctors/${doctor.id}`" class="block h-full">
          <DoctorCard :doctor="doctor" />
        </RouterLink>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">👨‍⚕️</div>
        <h3 class="text-xl font-bold text-textPrimary mb-2">Врачи не найдены</h3>
        <p class="text-textSecondary mb-6">Попробуйте изменить параметры поиска</p>
        <button @click="store.fetchDoctors({ name: '', specialty: '', clinic: '', sort: 'rating', page: 1 })" class="btn-primary">Сбросить фильтры</button>
      </div>

      <div class="mt-10 flex justify-center">
        <AppPagination :total="store.total" :page="currentPage" :limit="store.filters.limit" @update:page="onPageChange" />
      </div>
    </div>
  </main>
</template>
