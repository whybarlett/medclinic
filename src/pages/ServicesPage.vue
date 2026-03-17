<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import { mockServiceCategories, mockServices } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAppointmentStore } from '../stores/useAppointmentStore'

const route = useRoute()
const router = useRouter()
const appointmentStore = useAppointmentStore()
const searchQuery = ref('')

const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Услуги' }]

const activeCategory = ref<string | null>(null)

onMounted(() => {
  const cat = route.query.cat as string
  if (cat) activeCategory.value = cat
})

function setCategory(slug: string | null) {
  activeCategory.value = slug
  router.replace({ query: slug ? { cat: slug } : {} })
}

const filteredServices = computed(() => {
  let result = mockServices
  if (activeCategory.value) {
    const cat = mockServiceCategories.find(c => c.slug === activeCategory.value)
    if (cat) result = result.filter(s => s.categoryId === cat.id)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  }
  return result
})

const activeCategoryData = computed(() =>
  activeCategory.value ? mockServiceCategories.find(c => c.slug === activeCategory.value) : null
)

const popularServices = computed(() => mockServices.filter(s => s.isPopular))

function getCategoryColor(categoryId: number) {
  return mockServiceCategories.find(c => c.id === categoryId)?.color || '#003D9C'
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <AppBreadcrumbs :items="breadcrumbs" class="mb-3" />
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">
              {{ activeCategoryData ? activeCategoryData.name : 'Все услуги' }}
            </h1>
            <p class="text-textSecondary text-sm mt-1">
              {{ filteredServices.length }} {{ filteredServices.length === 1 ? 'услуга' : 'услуг' }}
            </p>
          </div>
          <div class="relative w-full sm:w-72">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="searchQuery"
              placeholder="Найти услугу..."
              class="w-full pl-10 pr-4 py-2.5 border border-border rounded-input text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-6">
      <!-- Category chips slider + reset -->
      <div class="flex items-center gap-8 mb-8">
        <div class="flex-1 min-w-0 -mx-1 overflow-hidden">
          <Swiper
            :modules="[FreeMode]"
            :slides-per-view="'auto'"
            :space-between="8"
            :free-mode="{ enabled: true, sticky: false, momentumRatio: 0.5 }"
            :grab-cursor="true"
            class="chips-swiper px-1"
          >
            <SwiperSlide class="!w-auto">
              <button
                @click="setCategory(null)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap',
                  !activeCategory
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-textSecondary border-border hover:border-primary/40 hover:text-primary'
                ]"
              >Все услуги</button>
            </SwiperSlide>
            <SwiperSlide v-for="cat in mockServiceCategories" :key="cat.id" class="!w-auto">
              <button
                @click="setCategory(cat.slug)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-1.5 whitespace-nowrap',
                  activeCategory === cat.slug
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-textSecondary border-border hover:border-primary/40 hover:text-primary'
                ]"
                :style="activeCategory === cat.slug ? { backgroundColor: cat.color, borderColor: cat.color } : {}"
              >
                <span class="text-base">{{ cat.icon }}</span>
                {{ cat.name }}
              </button>
            </SwiperSlide>
          </Swiper>
        </div>
        <button
          v-if="activeCategory"
          @click="setCategory(null)"
          class="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-error text-error hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          Сбросить
        </button>
      </div>

      <!-- Popular services banner (only when no filter) -->
      <div v-if="!activeCategory && !searchQuery" class="mb-8">
        <h2 class="text-lg font-bold text-textPrimary mb-4">Популярные услуги</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <RouterLink
            v-for="service in popularServices"
            :key="service.id"
            :to="`/services/${service.slug}`"
            class="group flex items-center gap-3 p-4 bg-white rounded-card border border-border hover:border-primary/30 hover:shadow-card transition-all"
          >
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
              :style="{ backgroundColor: getCategoryColor(service.categoryId) + '18' }"
            >{{ service.icon }}</div>
            <div class="min-w-0">
              <div class="font-semibold text-sm text-textPrimary group-hover:text-primary transition-colors truncate">{{ service.name }}</div>
              <div class="text-xs text-textSecondary">от {{ service.price.toLocaleString('ru-RU') }} &#8381;</div>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Divider -->
      <div v-if="!activeCategory && !searchQuery" class="border-t border-border mb-8" />

      <!-- Services catalog -->
      <div v-if="filteredServices.length">
        <h2 v-if="!activeCategory && !searchQuery" class="text-lg font-bold text-textPrimary mb-4">Каталог услуг</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="group bg-white rounded-card border border-border p-5 hover:shadow-card-hover hover:border-primary/20 transition-all duration-200"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                :style="{ backgroundColor: getCategoryColor(service.categoryId) + '18' }"
              >{{ service.icon }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <RouterLink :to="`/services/${service.slug}`" class="font-bold text-textPrimary group-hover:text-primary transition-colors">
                    {{ service.name }}
                  </RouterLink>
                  <span
                    class="inline-block px-2 py-0.5 text-xs rounded-full font-medium"
                    :style="{ backgroundColor: getCategoryColor(service.categoryId) + '18', color: getCategoryColor(service.categoryId) }"
                  >{{ service.categoryName }}</span>
                </div>
                <p class="text-sm text-textSecondary mt-1.5 line-clamp-2">{{ service.description }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div>
                <div class="text-lg font-bold text-primary">{{ service.price.toLocaleString('ru-RU') }} &#8381;</div>
                <div class="text-xs text-textSecondary">{{ service.duration }} мин</div>
              </div>
              <AppButton size="sm" @click="appointmentStore.openModal()">Записаться</AppButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-textPrimary mb-2">Услуги не найдены</h3>
        <p class="text-textSecondary mb-6">Попробуйте изменить параметры поиска</p>
        <AppButton @click="() => { searchQuery = ''; setCategory(null) }">Сбросить фильтры</AppButton>
      </div>
    </div>
  </main>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.chips-swiper {
  overflow: visible;
}
.chips-swiper :deep(.swiper-wrapper) {
  display: flex;
}
</style>
