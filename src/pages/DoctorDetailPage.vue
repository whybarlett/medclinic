<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDoctorsStore } from '../stores/useDoctorsStore'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import { mockReviews } from '../mocks/index'
import type { Doctor } from '../types/doctor'
import AppTabs from '../components/ui/AppTabs.vue'
import AppRating from '../components/ui/AppRating.vue'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppButton from '../components/ui/AppButton.vue'
import DoctorSchedule from '../components/doctors/DoctorSchedule.vue'
import { yearWord, reviewWord } from '../utils/index'

const route = useRoute()
const doctorsStore = useDoctorsStore()
const appointmentStore = useAppointmentStore()

const doctor = ref<Doctor | null>(null)
const activeTab = ref('about')
const notFound = ref(false)

onMounted(() => {
  const id = Number(route.params.id)
  const found = doctorsStore.fetchDoctorById(id)
  if (found) doctor.value = found
  else notFound.value = true
})

const doctorReviews = computed(() =>
  mockReviews.filter(r => r.doctorId === doctor.value?.id)
)

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Врачи', to: '/doctors' },
  { label: doctor.value?.name || '...' },
])

const tabs = computed(() => [
  { key: 'about', label: 'О враче' },
  { key: 'schedule', label: 'Расписание' },
  { key: 'reviews', label: 'Отзывы', count: doctorReviews.value.length },
  { key: 'prices', label: 'Цены' },
])

const prices = [
  { service: 'Первичная консультация', price: null },
  { service: 'Повторная консультация', price: -20 },
  { service: 'Расширенный приём с обследованием', price: 1500 },
  { service: 'Выезд на дом', price: 3000 },
  { service: 'Онлайн-консультация', price: -30 },
]
</script>

<template>
  <main class="min-h-screen bg-background">
    <!-- Not found -->
    <div v-if="notFound" class="container-custom py-24 text-center">
      <h1 class="text-2xl font-bold mb-4">Врач не найден</h1>
      <RouterLink to="/doctors" class="btn-primary">К списку врачей</RouterLink>
    </div>

    <!-- Loading -->
    <div v-else-if="!doctor" class="flex justify-center items-center py-24">
      <svg class="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
    </div>

    <template v-else>
      <!-- Header breadcrumbs -->
      <div class="bg-white border-b border-border">
        <div class="container-custom py-4">
          <AppBreadcrumbs :items="breadcrumbs" />
        </div>
      </div>

      <div class="container-custom py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- ─── Main content ─── -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Doctor hero card -->
            <div class="card p-6 md:p-8">
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Photo -->
                <div class="flex-shrink-0">
                  <div class="relative inline-block">
                    <img
                      :src="doctor.photo"
                      :alt="doctor.name"
                      class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover bg-gray-100"
                    />
                    <span
                      v-if="doctor.isAvailable"
                      class="absolute -bottom-2 -right-2 flex items-center gap-1.5 bg-success text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Доступен
                    </span>
                    <span v-else class="absolute -bottom-2 -right-2 bg-gray-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Недоступен
                    </span>
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h1 class="text-xl sm:text-2xl font-bold text-textPrimary leading-tight">{{ doctor.name }}</h1>

                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="spec in doctor.specialties"
                      :key="spec"
                      class="text-xs font-semibold text-secondary bg-sky-50 px-2.5 py-1 rounded-full"
                    >{{ spec }}</span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    <div class="bg-primary-50 rounded-xl p-3 text-center">
                      <div class="text-xl font-black text-primary">{{ doctor.experience }}</div>
                      <div class="text-xs text-textSecondary mt-0.5">лет опыта</div>
                    </div>
                    <div class="bg-yellow-50 rounded-xl p-3 text-center">
                      <div class="text-xl font-black text-yellow-500">{{ doctor.rating }}</div>
                      <div class="text-xs text-textSecondary mt-0.5">рейтинг</div>
                    </div>
                    <div class="bg-green-50 rounded-xl p-3 text-center">
                      <div class="text-xl font-black text-success">{{ doctor.reviewsCount }}</div>
                      <div class="text-xs text-textSecondary mt-0.5">отзывов</div>
                    </div>
                  </div>

                  <AppRating :rating="doctor.rating" :count="doctor.reviewsCount" class="mt-4" />

                  <!-- Awards chips -->
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span
                      v-for="award in doctor.awards"
                      :key="award"
                      class="flex items-center gap-1 text-xs text-textSecondary border border-border px-2.5 py-1 rounded-full"
                    >
                      🏅 {{ award }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabs -->
            <div class="card p-6">
              <AppTabs :tabs="tabs" v-model="activeTab">
                <template #default="{ active }">

                  <!-- About -->
                  <div v-if="active === 'about'" class="space-y-6 animate-fade-in">
                    <div>
                      <h3 class="font-bold text-textPrimary mb-3 flex items-center gap-2">
                        <span class="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-sm">📋</span>
                        О враче
                      </h3>
                      <p class="text-textSecondary leading-relaxed">{{ doctor.bio }}</p>
                    </div>

                    <div>
                      <h3 class="font-bold text-textPrimary mb-3 flex items-center gap-2">
                        <span class="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-sm">🎓</span>
                        Образование
                      </h3>
                      <ul class="space-y-2">
                        <li
                          v-for="edu in doctor.education"
                          :key="edu"
                          class="flex items-start gap-2 text-textSecondary text-sm"
                        >
                          <svg class="w-4 h-4 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                          {{ edu }}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="font-bold text-textPrimary mb-3 flex items-center gap-2">
                        <span class="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-sm">🏆</span>
                        Награды и достижения
                      </h3>
                      <ul class="space-y-2">
                        <li
                          v-for="award in doctor.awards"
                          :key="award"
                          class="flex items-center gap-2 text-textSecondary text-sm"
                        >
                          <span class="text-warning">🏅</span>
                          {{ award }}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="font-bold text-textPrimary mb-3 flex items-center gap-2">
                        <span class="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-sm">🏥</span>
                        Место работы
                      </h3>
                      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-card">
                        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <div>
                          <p class="font-semibold text-textPrimary text-sm">{{ doctor.clinicName }}</p>
                          <RouterLink :to="`/clinics/${doctor.clinicId}`" class="text-xs text-primary hover:underline">Посмотреть клинику →</RouterLink>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Schedule -->
                  <div v-else-if="active === 'schedule'" class="animate-fade-in">
                    <DoctorSchedule :doctor="doctor" />
                  </div>

                  <!-- Reviews -->
                  <div v-else-if="active === 'reviews'" class="space-y-4 animate-fade-in">
                    <div v-if="doctorReviews.length === 0" class="text-center py-10 text-textSecondary">
                      <div class="text-4xl mb-3">💬</div>
                      <p class="font-medium">Отзывов пока нет</p>
                      <p class="text-sm mt-1">Будьте первым, кто оставит отзыв</p>
                    </div>

                    <div
                      v-for="review in doctorReviews"
                      :key="review.id"
                      class="border border-border rounded-card p-5"
                    >
                      <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary font-bold">
                            {{ review.authorName.charAt(0) }}
                          </div>
                          <div>
                            <p class="font-semibold text-textPrimary text-sm">{{ review.authorName }}</p>
                            <p class="text-xs text-textSecondary">{{ new Date(review.date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
                          </div>
                        </div>
                        <AppRating :rating="review.rating" size="sm" />
                      </div>
                      <p class="text-textSecondary text-sm leading-relaxed">{{ review.text }}</p>
                    </div>

                    <!-- All clinic reviews as demo -->
                    <div
                      v-for="review in mockReviews.slice(0, 3)"
                      :key="`gen-${review.id}`"
                      class="border border-border rounded-card p-5"
                    >
                      <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary font-bold">
                            {{ review.authorName.charAt(0) }}
                          </div>
                          <div>
                            <p class="font-semibold text-textPrimary text-sm">{{ review.authorName }}</p>
                            <p class="text-xs text-textSecondary">{{ new Date(review.date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
                          </div>
                        </div>
                        <AppRating :rating="review.rating" size="sm" />
                      </div>
                      <p class="text-textSecondary text-sm leading-relaxed">{{ review.text }}</p>
                    </div>
                  </div>

                  <!-- Prices -->
                  <div v-else-if="active === 'prices'" class="animate-fade-in">
                    <div class="overflow-hidden rounded-card border border-border">
                      <table class="w-full text-sm">
                        <thead>
                          <tr class="bg-gray-50 border-b border-border">
                            <th class="text-left py-3 px-4 font-semibold text-textPrimary">Услуга</th>
                            <th class="text-right py-3 px-4 font-semibold text-textPrimary">Стоимость</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-border">
                          <tr
                            v-for="(item, i) in prices"
                            :key="i"
                            class="hover:bg-gray-50 transition-colors"
                          >
                            <td class="py-3.5 px-4 text-textPrimary">{{ item.service }}</td>
                            <td class="py-3.5 px-4 text-right font-semibold">
                              <span v-if="item.price === null" class="text-primary">
                                {{ doctor.price.toLocaleString('ru') }} ₽
                              </span>
                              <span v-else-if="item.price > 0" class="text-textPrimary">
                                {{ (doctor.price + item.price).toLocaleString('ru') }} ₽
                              </span>
                              <span v-else class="text-success">
                                {{ (doctor.price * (1 + item.price / 100)).toFixed(0) }} ₽
                                <span class="text-xs font-normal text-green-500 ml-1">{{ item.price }}%</span>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p class="text-xs text-textSecondary mt-3">* Цены указаны ориентировочно. Точную стоимость уточняйте при записи.</p>
                  </div>

                </template>
              </AppTabs>
            </div>
          </div>

          <!-- ─── Sidebar ─── -->
          <div class="space-y-5">
            <!-- Book widget -->
            <div class="card p-5 sticky top-24">
              <div class="text-center mb-5">
                <p class="text-xs text-textSecondary mb-1">Стоимость приёма</p>
                <div class="text-3xl font-black text-primary">{{ doctor.price.toLocaleString('ru') }} ₽</div>
                <div class="text-xs text-textSecondary mt-1">
                  Ближайшая запись: {{ new Date(doctor.nextAvailable).toLocaleDateString('ru', { day: 'numeric', month: 'short' }) }}
                </div>
              </div>

              <AppButton
                @click="appointmentStore.openModal(doctor)"
                full-width
                size="lg"
                class="mb-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Записаться
              </AppButton>

              <a
                href="tel:+74950000000"
                class="w-full flex items-center justify-center gap-2 py-3 border-2 border-border rounded-btn text-textPrimary font-semibold hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                Позвонить
              </a>

              <!-- Trust signals -->
              <div class="mt-5 pt-5 border-t border-border space-y-2.5">
                <div class="flex items-center gap-2 text-xs text-textSecondary">
                  <svg class="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  Бесплатная отмена за 2 часа
                </div>
                <div class="flex items-center gap-2 text-xs text-textSecondary">
                  <svg class="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  Подтверждение на e-mail и SMS
                </div>
                <div class="flex items-center gap-2 text-xs text-textSecondary">
                  <svg class="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  Электронные медкарты
                </div>
              </div>
            </div>

            <!-- Clinic info card -->
            <div class="card p-5">
              <h3 class="font-bold text-textPrimary mb-4 text-sm">Принимает в клинике</h3>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <div>
                  <p class="font-semibold text-textPrimary text-sm">{{ doctor.clinicName }}</p>
                  <p class="text-xs text-textSecondary mt-0.5">Пн–Пт: 8:00–22:00</p>
                  <RouterLink :to="`/clinics/${doctor.clinicId}`" class="text-xs text-primary hover:underline mt-1 block">
                    Адрес и контакты →
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Similar doctors -->
            <div class="card p-5">
              <h3 class="font-bold text-textPrimary mb-4 text-sm">Похожие специалисты</h3>
              <div class="space-y-3">
                <RouterLink
                  v-for="d in useDoctorsStore().getTopDoctors(3).filter(d => d.id !== doctor!.id).slice(0, 2)"
                  :key="d.id"
                  :to="`/doctors/${d.id}`"
                  class="flex items-center gap-3 p-2 -mx-2 rounded-input hover:bg-gray-50 transition-colors"
                >
                  <img :src="d.photo" :alt="d.name" class="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-textPrimary truncate">{{ d.name }}</p>
                    <p class="text-xs text-secondary truncate">{{ d.specialty }}</p>
                    <p class="text-xs text-textSecondary">⭐ {{ d.rating }} · от {{ d.price.toLocaleString('ru') }} ₽</p>
                  </div>
                </RouterLink>
              </div>
              <RouterLink to="/doctors" class="block text-center text-sm text-primary hover:underline mt-4">
                Все врачи →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
