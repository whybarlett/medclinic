<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { mockReviews } from '../../mocks/index'
import AppRating from '../ui/AppRating.vue'
import { formatDate } from '../../utils/index'
</script>

<template>
  <section class="py-16 md:py-20 bg-white overflow-hidden">
    <div class="container-custom">
      <div class="text-center mb-10">
        <h2 class="section-title">Отзывы пациентов</h2>
        <p class="section-subtitle mx-auto max-w-xl">Нам доверяют более 1 миллиона пациентов по всей России</p>
      </div>

      <Swiper
        :modules="[Autoplay, Pagination]"
        :autoplay="{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }"
        :pagination="{ clickable: true }"
        :slides-per-view="1.1"
        :space-between="16"
        :breakpoints="{
          640: { slidesPerView: 2.1, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }"
        class="pb-10"
      >
        <SwiperSlide v-for="review in mockReviews" :key="review.id" class="h-auto">
          <div class="card p-6 h-full flex flex-col">
            <!-- Stars -->
            <AppRating :rating="review.rating" class="mb-3" />
            <!-- Text -->
            <p class="text-textPrimary text-sm leading-relaxed flex-1 mb-4">"{{ review.text }}"</p>
            <!-- Author -->
            <div class="flex items-center gap-3 pt-3 border-t border-border">
              <div class="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {{ review.authorName.charAt(0) }}
              </div>
              <div>
                <div class="font-semibold text-sm text-textPrimary">{{ review.authorName }}</div>
                <div class="text-xs text-textSecondary">{{ formatDate(review.date, { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
              </div>
              <!-- Verified badge -->
              <div class="ml-auto flex-shrink-0">
                <svg class="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
