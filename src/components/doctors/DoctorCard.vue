<script setup lang="ts">
import type { Doctor } from '../../types/doctor'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import AppRating from '../ui/AppRating.vue'
import AppButton from '../ui/AppButton.vue'
import { yearWord, reviewWord } from '../../utils/index'

defineProps<{ doctor: Doctor }>()
const appointmentStore = useAppointmentStore()
</script>

<template>
  <div class="card p-5 flex flex-col h-full group">
    <!-- Photo + info -->
    <div class="flex gap-4 mb-4">
      <div class="relative flex-shrink-0">
        <img
          :src="doctor.photo"
          :alt="doctor.name"
          loading="lazy"
          class="w-20 h-20 rounded-2xl object-cover bg-gray-100"
        />
        <span v-if="doctor.isAvailable" class="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" title="Доступен для записи" />
      </div>
      <div class="min-w-0">
        <h3 class="font-bold text-textPrimary text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {{ doctor.name }}
        </h3>
        <p class="text-secondary text-xs font-semibold mt-1">{{ doctor.specialty }}</p>
        <p class="text-textSecondary text-xs mt-0.5">{{ yearWord(doctor.experience) }} опыта</p>
        <AppRating :rating="doctor.rating" :count="doctor.reviewsCount" size="sm" class="mt-1.5" />
      </div>
    </div>

    <!-- Clinic -->
    <div class="flex items-center gap-1.5 text-xs text-textSecondary mb-4 min-w-0">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
      <span class="truncate">{{ doctor.clinicName }}</span>
    </div>

    <!-- Price + CTA -->
    <div class="mt-auto flex items-center justify-between gap-3">
      <div>
        <span class="text-xs text-textSecondary">Приём от</span>
        <div class="font-bold text-textPrimary text-base">{{ doctor.price.toLocaleString('ru') }} ₽</div>
      </div>
      <AppButton size="sm" @click="appointmentStore.openModal(doctor)">
        Записаться
      </AppButton>
    </div>
  </div>
</template>
