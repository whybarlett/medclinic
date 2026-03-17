<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import { mockDoctors } from '../../mocks/doctors'
import { mockClinics } from '../../mocks/index'
import { getWeekDays, maskPhone } from '../../utils/index'
import AppModal from '../ui/AppModal.vue'
import AppButton from '../ui/AppButton.vue'
import type { Doctor } from '../../types/doctor'

const store = useAppointmentStore()

// ───── Step 1 ─────
const doctorSearch = ref('')
const filteredDoctors = computed(() => {
  const q = doctorSearch.value.toLowerCase()
  if (!q) return mockDoctors.slice(0, 6)
  return mockDoctors.filter(d =>
    d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
  ).slice(0, 6)
})

function selectDoctor(doctor: Doctor) {
  store.selectedDoctor = doctor
  doctorSearch.value = doctor.name
}

// ───── Step 2 ─────
const weekDays = getWeekDays()
const timeSlots = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','17:00','17:30','18:00','18:30']
const unavailableSlots = ['09:30','11:00','14:30','17:00']

// ───── Step 3 ─────
function onPhoneInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  store.patientData.phone = maskPhone(val)
}

function step1Valid() { return !!(store.selectedDoctor || store.selectedServiceName) }
function step2Valid() { return !!(store.selectedDate && store.selectedTime) }
function step3Valid() {
  const p = store.patientData
  return p.name.trim().length >= 2 && p.phone.length >= 10 && p.agreePersonalData
}

const canProceed = computed(() => {
  if (store.currentStep === 1) return step1Valid()
  if (store.currentStep === 2) return step2Valid()
  return true
})

async function handleNext() {
  if (store.currentStep < 3) { store.nextStep(); return }
  if (!step3Valid()) return
  await store.submitAppointment()
}

const stepLabels = ['Врач / Услуга', 'Дата и время', 'Ваши данные']
</script>

<template>
  <AppModal :open="store.isOpen" @close="store.closeModal" size="lg" :title="store.isSuccess ? '' : 'Запись на приём'">
    <template #header>
      <div class="w-full">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-xl font-bold text-textPrimary">
            {{ store.isSuccess ? '✅ Запись подтверждена!' : 'Запись на приём' }}
          </h2>
        </div>
        <!-- Stepper -->
        <div v-if="!store.isSuccess" class="flex items-center gap-0 mt-4">
          <template v-for="(label, i) in stepLabels" :key="i">
            <div class="flex items-center gap-2 flex-1">
              <div :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0',
                store.currentStep > i + 1 ? 'bg-success text-white' :
                store.currentStep === i + 1 ? 'bg-primary text-white ring-4 ring-primary/20' :
                'bg-gray-100 text-textSecondary'
              ]">
                <svg v-if="store.currentStep > i + 1" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span :class="['text-xs font-medium hidden sm:block', store.currentStep === i + 1 ? 'text-primary' : 'text-textSecondary']">{{ label }}</span>
            </div>
            <div v-if="i < 2" :class="['flex-1 h-0.5 mx-2 max-w-12', store.currentStep > i + 1 ? 'bg-success' : 'bg-gray-200']" />
          </template>
        </div>
      </div>
    </template>

    <!-- Success screen -->
    <div v-if="store.isSuccess" class="p-8 text-center">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h3 class="text-2xl font-bold text-textPrimary mb-3">Вы записаны!</h3>
      <p class="text-textSecondary mb-2">
        Подтверждение отправлено на <strong>{{ store.patientData.email || store.patientData.phone }}</strong>
      </p>
      <div v-if="store.selectedDoctor" class="bg-primary-50 rounded-card p-4 mb-6 text-left max-w-sm mx-auto">
        <p class="text-sm font-semibold text-primary">{{ store.selectedDoctor.name }}</p>
        <p class="text-sm text-textSecondary">{{ store.selectedDate }} в {{ store.selectedTime }}</p>
      </div>
      <AppButton @click="() => { store.resetForm(); store.closeModal() }" variant="outline">
        Закрыть
      </AppButton>
    </div>

    <!-- Step 1: Select doctor -->
    <div v-else-if="store.currentStep === 1" class="p-6 space-y-5">
      <div>
        <label class="text-sm font-semibold text-textPrimary mb-2 block">Врач или специальность</label>
        <div class="relative">
          <input
            v-model="doctorSearch"
            placeholder="Начните вводить имя врача или специальность..."
            class="input-field pr-10"
          />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <!-- Doctor suggestions -->
        <div v-if="!store.selectedDoctor || doctorSearch !== store.selectedDoctor.name" class="mt-2 space-y-1.5 max-h-56 overflow-y-auto">
          <button
            v-for="doc in filteredDoctors"
            :key="doc.id"
            @click="selectDoctor(doc)"
            class="w-full flex items-center gap-3 p-3 rounded-input hover:bg-primary-50 transition-colors text-left border border-transparent hover:border-primary/20"
          >
            <img :src="doc.photo" :alt="doc.name" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            <div class="min-w-0">
              <div class="text-sm font-semibold text-textPrimary truncate">{{ doc.name }}</div>
              <div class="text-xs text-textSecondary">{{ doc.specialty }} · от {{ doc.price.toLocaleString('ru') }} ₽</div>
            </div>
            <div class="ml-auto flex-shrink-0">
              <div class="flex items-center gap-0.5 text-xs text-yellow-500 font-semibold">⭐ {{ doc.rating }}</div>
            </div>
          </button>
        </div>
        <!-- Selected doctor badge -->
        <div v-if="store.selectedDoctor && doctorSearch === store.selectedDoctor.name" class="mt-3 flex items-center gap-3 p-3 bg-primary-50 border border-primary/20 rounded-card">
          <img :src="store.selectedDoctor.photo" class="w-10 h-10 rounded-lg object-cover" :alt="store.selectedDoctor.name" />
          <div>
            <div class="text-sm font-bold text-primary">{{ store.selectedDoctor.name }}</div>
            <div class="text-xs text-textSecondary">{{ store.selectedDoctor.specialty }}</div>
          </div>
          <button @click="() => { store.selectedDoctor = null; doctorSearch = '' }" class="ml-auto text-textSecondary hover:text-error transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <!-- Clinic selector -->
      <div>
        <label class="text-sm font-semibold text-textPrimary mb-2 block">Клиника</label>
        <select v-model="store.selectedClinicId" class="input-field">
          <option :value="null">Любая клиника</option>
          <option v-for="c in mockClinics" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
    </div>

    <!-- Step 2: Date & Time -->
    <div v-else-if="store.currentStep === 2" class="p-6 space-y-6">
      <!-- Date picker -->
      <div>
        <label class="text-sm font-semibold text-textPrimary mb-3 block">Выберите дату</label>
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            v-for="day in weekDays"
            :key="day.label"
            @click="store.selectedDate = day.date.toISOString().split('T')[0]"
            :class="[
              'flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-card border-2 transition-all min-w-[72px]',
              store.selectedDate === day.date.toISOString().split('T')[0]
                ? 'border-primary bg-primary text-white'
                : 'border-border hover:border-primary/40 text-textPrimary'
            ]"
          >
            <span class="text-xs font-medium">{{ day.dayName }}</span>
            <span class="text-sm font-bold mt-0.5">{{ day.date.getDate() }}</span>
            <span class="text-xs opacity-70">{{ day.date.toLocaleString('ru', { month: 'short' }) }}</span>
          </button>
        </div>
      </div>
      <!-- Time slots -->
      <div>
        <label class="text-sm font-semibold text-textPrimary mb-3 block">Выберите время</label>
        <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <button
            v-for="slot in timeSlots"
            :key="slot"
            :disabled="unavailableSlots.includes(slot)"
            @click="store.selectedTime = slot"
            :class="[
              'py-2.5 rounded-input text-sm font-semibold transition-all border-2',
              unavailableSlots.includes(slot)
                ? 'border-transparent bg-gray-100 text-gray-300 cursor-not-allowed'
                : store.selectedTime === slot
                ? 'border-primary bg-primary text-white'
                : 'border-border hover:border-primary/40 text-textPrimary'
            ]"
          >{{ slot }}</button>
        </div>
        <p class="text-xs text-textSecondary mt-3">Серые слоты — уже заняты</p>
      </div>
    </div>

    <!-- Step 3: Patient data -->
    <div v-else class="p-6 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">ФИО <span class="text-error">*</span></label>
          <input v-model="store.patientData.name" placeholder="Иванов Иван Иванович" class="input-field" />
        </div>
        <div>
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Телефон <span class="text-error">*</span></label>
          <input
            :value="store.patientData.phone"
            @input="onPhoneInput"
            placeholder="+7 (___) ___-__-__"
            type="tel"
            class="input-field"
          />
        </div>
        <div>
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Email</label>
          <input v-model="store.patientData.email" type="email" placeholder="example@mail.ru" class="input-field" />
        </div>
        <div>
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Дата рождения</label>
          <input v-model="store.patientData.birthDate" type="date" class="input-field" />
        </div>
        <div class="sm:col-span-2">
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Комментарий</label>
          <textarea v-model="store.patientData.comment" placeholder="Опишите жалобы или уточните запрос..." rows="3" class="input-field resize-none" />
        </div>
      </div>
      <!-- Consent -->
      <label class="flex items-start gap-3 cursor-pointer group">
        <div class="relative mt-0.5 flex-shrink-0">
          <input v-model="store.patientData.agreePersonalData" type="checkbox" class="sr-only peer" />
          <div class="w-5 h-5 border-2 border-border rounded peer-checked:bg-primary peer-checked:border-primary transition-colors group-hover:border-primary/50"></div>
          <svg class="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
        </div>
        <span class="text-sm text-textSecondary leading-relaxed">
          Согласен(а) на обработку <a href="#" class="text-primary hover:underline">персональных данных</a> в соответствии с Политикой конфиденциальности
        </span>
      </label>
    </div>

    <template #footer>
      <div v-if="!store.isSuccess" class="flex items-center justify-between gap-4">
        <button
          v-if="store.currentStep > 1"
          @click="store.prevStep"
          class="flex items-center gap-2 text-textSecondary hover:text-textPrimary font-medium transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Назад
        </button>
        <div v-else />
        <AppButton
          @click="handleNext"
          :loading="store.isSubmitting"
          :disabled="!canProceed"
        >
          {{ store.currentStep === 3 ? 'Подтвердить запись' : 'Далее' }}
          <svg v-if="store.currentStep < 3" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>
