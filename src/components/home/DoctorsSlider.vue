<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useDoctorsStore } from '../../stores/useDoctorsStore'
import DoctorCard from '../doctors/DoctorCard.vue'
import AppButton from '../ui/AppButton.vue'

const store = useDoctorsStore()
const topDoctors = ref(store.getTopDoctors(10))
onMounted(() => { topDoctors.value = store.getTopDoctors(10) })

const swiperEl = ref<{ swiperInstance: any } | null>(null)
function slidePrev() { (swiperEl.value as any)?.$el?.swiper?.slidePrev() }
function slideNext() { (swiperEl.value as any)?.$el?.swiper?.slideNext() }
</script>

<template>
  <section class="py-16 md:py-20 bg-white overflow-hidden">
    <div class="container-custom">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="section-title">Наши врачи</h2>
          <p class="section-subtitle mt-2">Запишитесь к лучшим специалистам</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Custom nav -->
          <button @click="slidePrev" class="w-10 h-10 rounded-full border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center text-textSecondary" aria-label="Назад">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button @click="slideNext" class="w-10 h-10 rounded-full border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center text-textSecondary" aria-label="Вперёд">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          <AppButton variant="outline" size="sm">
            <RouterLink to="/doctors">Все врачи</RouterLink>
          </AppButton>
        </div>
      </div>

      <Swiper
        ref="swiperEl"
        :modules="[Navigation, A11y]"
        :slides-per-view="1.15"
        :space-between="16"
        :breakpoints="{
          480: { slidesPerView: 2.1, spaceBetween: 16 },
          768: { slidesPerView: 3.1, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }"
        :a11y="{ enabled: true }"
      >
        <SwiperSlide v-for="doctor in topDoctors" :key="doctor.id" class="h-auto pb-2">
          <RouterLink :to="`/doctors/${doctor.id}`" class="block h-full">
            <DoctorCard :doctor="doctor" />
          </RouterLink>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
