<script setup lang="ts">
import { ref } from 'vue'
import { getWeekDays } from '../../utils/index'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import type { Doctor } from '../../types/doctor'

const props = defineProps<{ doctor: Doctor }>()
const appointmentStore = useAppointmentStore()

const weekDays = getWeekDays()
const selectedDay = ref(0)
const selectedTime = ref<string | null>(null)

const allSlots = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','17:00','17:30','18:00']
const unavailableByDay: Record<number, string[]> = {
  0: ['09:30','11:00','14:30'],
  1: ['10:00','14:00','17:00'],
  2: ['09:00','11:30','15:30'],
  3: ['10:30','14:30','17:30'],
  4: ['09:30','15:00','18:00'],
  5: ['11:00','14:00','17:00'],
  6: [],
}

function getAvailable(dayIdx: number) {
  return allSlots.filter(s => !unavailableByDay[dayIdx]?.includes(s))
}

function selectSlot(time: string) {
  selectedTime.value = time
  appointmentStore.selectedDate = weekDays[selectedDay.value].date.toISOString().split('T')[0]
  appointmentStore.selectedTime = time
}

function openAppointment() {
  appointmentStore.openModal(props.doctor)
  appointmentStore.currentStep = selectedTime.value ? 2 : 1
}
</script>

<template>
  <div class="space-y-4">
    <!-- Day selector -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        v-for="(day, i) in weekDays"
        :key="i"
        @click="selectedDay = i; selectedTime = null"
        :class="[
          'flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-card border-2 transition-all min-w-[64px]',
          selectedDay === i
            ? 'border-primary bg-primary text-white'
            : 'border-border hover:border-primary/40 text-textPrimary'
        ]"
      >
        <span class="text-xs font-medium">{{ day.dayName }}</span>
        <span class="text-sm font-bold mt-0.5">{{ day.date.getDate() }}</span>
        <span class="text-[10px] mt-0.5 opacity-70">{{ day.date.toLocaleString('ru', { month: 'short' }) }}</span>
      </button>
    </div>

    <!-- Time slots -->
    <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
      <button
        v-for="slot in allSlots"
        :key="slot"
        :disabled="unavailableByDay[selectedDay]?.includes(slot)"
        @click="selectSlot(slot)"
        :class="[
          'py-2 rounded-input text-sm font-semibold transition-all border-2',
          unavailableByDay[selectedDay]?.includes(slot)
            ? 'border-transparent bg-gray-100 text-gray-300 cursor-not-allowed line-through'
            : selectedTime === slot
            ? 'border-primary bg-primary text-white shadow-sm'
            : 'border-border hover:border-primary/50 text-textPrimary'
        ]"
      >{{ slot }}</button>
    </div>

    <!-- Book button -->
    <Transition name="fade-slide">
      <div v-if="selectedTime" class="bg-primary-50 border border-primary/20 rounded-card p-4 flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-primary">
            {{ weekDays[selectedDay].dayName }}, {{ weekDays[selectedDay].date.toLocaleDateString('ru', { day: 'numeric', month: 'long' }) }}
          </p>
          <p class="text-textSecondary text-sm">в {{ selectedTime }}</p>
        </div>
        <button
          @click="openAppointment"
          class="btn-primary text-sm py-2.5 px-5 flex-shrink-0"
        >
          Записаться
        </button>
      </div>
    </Transition>

    <p class="text-xs text-textSecondary">Серые ячейки — занято. Запись на ближайшие 7 дней.</p>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(-8px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
