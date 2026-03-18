<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockServices, mockServiceCategories } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAppointmentStore } from '../stores/useAppointmentStore'

const route = useRoute()
const appointmentStore = useAppointmentStore()

const service = computed(() => mockServices.find(s => s.slug === route.params.slug))
const category = computed(() => service.value ? mockServiceCategories.find(c => c.id === service.value!.categoryId) : null)
const related = computed(() => service.value ? mockServices.filter(s => s.categoryId === service.value!.categoryId && s.id !== service.value!.id).slice(0, 3) : [])

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Услуги', to: '/services' },
  { label: category.value?.name || '', to: `/services?cat=${category.value?.slug}` },
  { label: service.value?.name || '' },
])
</script>

<template>
  <main class="min-h-screen bg-background">
    <div v-if="!service" class="container-custom py-24 text-center">
      <h1 class="text-2xl font-bold mb-4">Услуга не найдена</h1>
      <RouterLink to="/services" class="btn-primary inline-flex">← Все услуги</RouterLink>
    </div>

    <template v-else>
      <div class="bg-white border-b border-border">
        <div class="container-custom py-4">
          <AppBreadcrumbs :items="breadcrumbs" />
        </div>
      </div>

      <div class="container-custom py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main -->
          <div class="lg:col-span-2 space-y-6">
            <div class="card p-6 md:p-8">
              <div class="flex items-start gap-4 mb-6">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  :style="{ backgroundColor: (category?.color || '#003D9C') + '18' }">
                  {{ service.icon }}
                </div>
                <div>
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block"
                    :style="{ backgroundColor: (category?.color || '#003D9C') + '18', color: category?.color || '#003D9C' }">
                    {{ service.categoryName }}
                  </span>
                  <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">{{ service.name }}</h1>
                </div>
              </div>

              <p class="text-textSecondary leading-relaxed mb-6">{{ service.description }}</p>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div class="bg-primary-50 rounded-card p-4 text-center">
                  <div class="text-xl font-black text-primary">{{ service.price.toLocaleString('ru') }} ₽</div>
                  <div class="text-xs text-textSecondary mt-1">Стоимость</div>
                </div>
                <div class="bg-green-50 rounded-card p-4 text-center">
                  <div class="text-xl font-black text-success">{{ service.duration }} мин</div>
                  <div class="text-xs text-textSecondary mt-1">Длительность</div>
                </div>
                <div class="bg-sky-50 rounded-card p-4 text-center">
                  <div class="text-xl font-black text-secondary">1 день</div>
                  <div class="text-xs text-textSecondary mt-1">Результат</div>
                </div>
              </div>
            </div>

            <!-- Related -->
            <div v-if="related.length" class="card p-6">
              <h2 class="font-bold text-textPrimary mb-4">Похожие услуги</h2>
              <div class="space-y-3">
                <RouterLink v-for="s in related" :key="s.id" :to="`/services/${s.slug}`"
                  class="flex items-center gap-3 p-3 rounded-input hover:bg-gray-50 transition-colors">
                  <span class="text-xl">{{ s.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-textPrimary">{{ s.name }}</div>
                    <div class="text-xs text-textSecondary">{{ s.duration }} мин</div>
                  </div>
                  <div class="font-bold text-primary text-sm flex-shrink-0">{{ s.price.toLocaleString('ru') }} ₽</div>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">
            <div class="card p-5 sticky top-24">
              <div class="text-center mb-5">
                <div class="text-3xl font-black text-primary">{{ service.price.toLocaleString('ru') }} ₽</div>
                <div class="text-xs text-textSecondary mt-1">Стоимость услуги</div>
              </div>
              <AppButton @click="appointmentStore.openModal()" full-width size="lg" class="mb-3">
                Записаться
              </AppButton>
              <a href="tel:+73822000000" class="w-full flex items-center justify-center gap-2 py-3 border-2 border-border rounded-btn text-sm font-semibold text-textPrimary hover:border-primary hover:text-primary transition-colors">
                Позвонить
              </a>
              <div class="mt-4 space-y-2 pt-4 border-t border-border">
                <div class="flex items-center gap-2 text-xs text-textSecondary">
                  <svg class="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  Бесплатная отмена за 2 часа
                </div>
                <div class="flex items-center gap-2 text-xs text-textSecondary">
                  <svg class="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  Подтверждение по SMS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
