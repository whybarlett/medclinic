<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import AppButton from '../ui/AppButton.vue'

const router = useRouter()
const appointmentStore = useAppointmentStore()
const searchQuery = ref('')

const slides = [
  {
    id: 1,
    title: 'Ваше здоровье — наш приоритет',
    subtitle: '60+ клиник, 1500+ врачей — запишитесь онлайн за 2 минуты',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80',
    cta: 'Записаться на приём',
  },
  {
    id: 2,
    title: 'Диагностика на современном оборудовании',
    subtitle: 'МРТ, КТ, УЗИ — результаты уже через 24 часа',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1600&q=80',
    cta: 'Узнать об услугах',
  },
  {
    id: 3,
    title: 'Детское здоровье — в надёжных руках',
    subtitle: 'Педиатры с опытом 10+ лет. Нежный подход к каждому ребёнку',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&q=80',
    cta: 'Найти педиатра',
  },
  {
    id: 4,
    title: 'Акции и специальные предложения',
    subtitle: 'Комплексные программы обследования со скидкой до 50%',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80',
    cta: 'Смотреть акции',
  },
]

const quickLinks = [
  { label: 'УЗИ', icon: '📡', to: '/services?cat=ultrasound' },
  { label: 'МРТ', icon: '🧲', to: '/services?cat=mrt-ct' },
  { label: 'Анализы', icon: '🧪', to: '/services?cat=analyses' },
  { label: 'Педиатрия', icon: '👶', to: '/services?cat=pediatrics' },
  { label: 'Кардиология', icon: '❤️', to: '/services?cat=cardiology' },
  { label: 'Стоматология', icon: '🦷', to: '/services?cat=stomatology' },
]

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/doctors', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <section class="relative h-[600px] md:h-[680px] overflow-hidden">
    <Swiper
      :modules="[Autoplay, Pagination, EffectFade]"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      effect="fade"
      :fade-effect="{ crossFade: true }"
      loop
      class="h-full"
    >
      <SwiperSlide v-for="slide in slides" :key="slide.id" class="relative">
        <!-- Background image -->
        <div class="absolute inset-0">
          <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" loading="eager" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <!-- Content -->
        <div class="relative z-10 h-full flex items-center">
          <div class="container-custom">
            <div class="max-w-2xl">
              <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 text-balance">
                {{ slide.title }}
              </h1>
              <p class="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
                {{ slide.subtitle }}
              </p>
              <AppButton @click="appointmentStore.openModal()" size="lg">
                {{ slide.cta }}
              </AppButton>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Floating search box -->
    <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
      <div class="container-custom pb-6">
        <div class="bg-white/95 backdrop-blur-sm rounded-card shadow-2xl p-4 max-w-3xl">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 flex items-center gap-3 bg-gray-50 rounded-input px-4 py-3 border border-border">
              <svg class="w-5 h-5 text-textSecondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input
                v-model="searchQuery"
                @keydown.enter="doSearch"
                placeholder="Введите услугу или имя врача..."
                class="flex-1 bg-transparent outline-none text-textPrimary placeholder-gray-400 text-sm"
              />
            </div>
            <AppButton @click="doSearch" class="sm:flex-shrink-0">
              Найти
            </AppButton>
          </div>
          <!-- Quick links -->
          <div class="flex items-center gap-2 mt-3 flex-wrap">
            <span class="text-xs text-textSecondary">Быстрый выбор:</span>
            <RouterLink
              v-for="link in quickLinks"
              :key="link.label"
              :to="link.to"
              class="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary text-xs rounded-full hover:bg-primary hover:text-white transition-colors font-medium"
            >
              {{ link.icon }} {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
