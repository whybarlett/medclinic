<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockActions } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppBadge from '../components/ui/AppBadge.vue'
import { formatShortDate } from '../utils/index'

const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Акции' }]
const selectedCat = ref('')
const categories = [...new Set(mockActions.map(a => a.categoryName))]
const filtered = computed(() =>
  selectedCat.value ? mockActions.filter(a => a.categoryName === selectedCat.value) : mockActions
)
</script>

<template>
  <main class="min-h-screen bg-background">
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <AppBreadcrumbs :items="breadcrumbs" class="mb-3" />
        <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">Акции и скидки</h1>
        <p class="text-textSecondary text-sm mt-1">Специальные предложения для наших пациентов</p>
      </div>
    </div>

    <div class="container-custom py-8">
      <!-- Category pills -->
      <div class="flex gap-2 flex-wrap mb-8">
        <button
          @click="selectedCat = ''"
          :class="['px-4 py-2 rounded-full text-sm font-semibold border transition-colors', !selectedCat ? 'bg-primary text-white border-primary' : 'bg-white border-border text-textSecondary hover:border-primary/40']"
        >Все акции</button>
        <button
          v-for="cat in categories" :key="cat"
          @click="selectedCat = cat"
          :class="['px-4 py-2 rounded-full text-sm font-semibold border transition-colors', selectedCat === cat ? 'bg-primary text-white border-primary' : 'bg-white border-border text-textSecondary hover:border-primary/40']"
        >{{ cat }}</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="action in filtered" :key="action.id"
          :to="`/actions/${action.id}`"
          class="card overflow-hidden group block"
        >
          <div class="relative h-52 overflow-hidden">
            <img :src="action.image" :alt="action.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span class="absolute top-3 left-3 bg-error text-white text-xs font-black px-3 py-1.5 rounded-full">−{{ action.discountPercent }}%</span>
            <AppBadge class="absolute bottom-3 left-3" variant="neutral">{{ action.categoryName }}</AppBadge>
          </div>
          <div class="p-5">
            <h3 class="font-bold text-textPrimary mb-2 line-clamp-2 group-hover:text-primary transition-colors">{{ action.title }}</h3>
            <p class="text-textSecondary text-sm line-clamp-2 mb-4">{{ action.description }}</p>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-textSecondary text-xs line-through">{{ action.originalPrice.toLocaleString('ru') }} ₽</div>
                <div class="text-error font-black text-xl">{{ action.discountPrice.toLocaleString('ru') }} ₽</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-textSecondary">Действует до</div>
                <div class="text-xs font-semibold text-textPrimary">{{ formatShortDate(action.validUntil) }}</div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
