<script setup lang="ts">
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import AppButton from '../ui/AppButton.vue'
const appointmentStore = useAppointmentStore()
</script>

<template>
  <section class="py-16 md:py-20">
    <div class="container-custom">
      <div class="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary via-[#0052CC] to-secondary p-8 md:p-12 lg:p-16">
        <!-- Decorative circles -->
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
        <div class="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2" />

        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="text-white text-center lg:text-left max-w-2xl">
            <h2 class="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
              Запишитесь на приём<br class="hidden md:block" /> прямо сейчас
            </h2>
            <p class="text-white/80 text-lg leading-relaxed mb-0">
              Более 1500 врачей ждут вас. Онлайн-запись за 2 минуты, без ожидания по телефону.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <button
              @click="appointmentStore.openModal()"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-btn hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg text-base"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Записаться онлайн
            </button>
            <a
              href="tel:+74950000000"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-bold rounded-btn hover:bg-white/10 active:scale-[0.98] transition-all text-base"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Позвонить нам
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
