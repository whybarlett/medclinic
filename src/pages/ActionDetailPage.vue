<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockActions } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import { formatDate } from '../utils/index'

const route = useRoute()
const store = useAppointmentStore()
const action = computed(() => mockActions.find(a => a.id === Number(route.params.id)))
const breadcrumbs = computed(() => [{ label: 'Главная', to: '/' }, { label: 'Акции', to: '/actions' }, { label: action.value?.title || '' }])
</script>
<template>
  <main class="min-h-screen bg-background">
    <div v-if="!action" class="container-custom py-24 text-center">
      <h1 class="text-2xl font-bold mb-4">Акция не найдена</h1>
      <RouterLink to="/actions" class="btn-primary">К акциям</RouterLink>
    </div>
    <template v-else>
      <div class="bg-white border-b border-border">
        <div class="container-custom py-4"><AppBreadcrumbs :items="breadcrumbs" /></div>
      </div>
      <div class="container-custom py-8 max-w-4xl">
        <div class="card overflow-hidden">
          <div class="relative h-72 md:h-96">
            <img :src="action.image" :alt="action.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span class="absolute top-4 left-4 bg-error text-white text-sm font-black px-4 py-2 rounded-full">−{{ action.discountPercent }}%</span>
          </div>
          <div class="p-6 md:p-8">
            <div class="flex flex-col md:flex-row md:items-start gap-6">
              <div class="flex-1">
                <div class="text-xs font-semibold text-secondary bg-sky-50 px-3 py-1.5 rounded-full inline-block mb-3">{{ action.categoryName }}</div>
                <h1 class="text-2xl md:text-3xl font-bold text-textPrimary mb-4">{{ action.title }}</h1>
                <p class="text-textSecondary leading-relaxed mb-6">{{ action.description }}</p>
                <div class="bg-orange-50 border border-orange-100 rounded-card p-4 text-sm text-orange-700">
                  ⏰ Акция действует до {{ formatDate(action.validUntil) }}. Успейте записаться!
                </div>
              </div>
              <div class="md:w-64 flex-shrink-0">
                <div class="card p-5 bg-gray-50 text-center">
                  <p class="text-textSecondary text-sm line-through">{{ action.originalPrice.toLocaleString('ru') }} ₽</p>
                  <p class="text-4xl font-black text-error mt-1">{{ action.discountPrice.toLocaleString('ru') }} ₽</p>
                  <p class="text-sm text-success font-semibold mt-1">Экономия {{ (action.originalPrice - action.discountPrice).toLocaleString('ru') }} ₽</p>
                  <AppButton @click="store.openModal()" full-width class="mt-4">Записаться</AppButton>
                  <a href="tel:+74950000000" class="block text-center text-primary text-sm font-semibold mt-3 hover:underline">или позвоните нам</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
