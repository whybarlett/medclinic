<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useAppointmentStore } from '../../stores/useAppointmentStore'

const store = useAppointmentStore()
const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const { y } = useScroll(window)
const showWidgets = computed(() => y.value > 400)

const cookieAccepted = ref(localStorage.getItem('cookie_consent') !== null)

function acceptCookies() {
  localStorage.setItem('cookie_consent', '1')
  cookieAccepted.value = true
}
function declineCookies() {
  localStorage.setItem('cookie_consent', '0')
  cookieAccepted.value = true
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Floating appointment button -->
  <Transition name="float">
    <div v-if="showWidgets && !isAdmin" class="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
      <!-- Back to top -->
      <button
        @click="scrollToTop"
        class="w-11 h-11 bg-white border border-border rounded-full shadow-card flex items-center justify-center text-textSecondary hover:text-primary hover:border-primary hover:shadow-card-hover transition-all"
        aria-label="Наверх"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
      </button>
      <!-- Appointment CTA -->
      <button
        @click="store.openModal()"
        class="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:bg-primary-600 active:scale-95 transition-all font-semibold text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class="hidden sm:inline">Записаться</span>
      </button>
    </div>
  </Transition>

  <!-- Cookie banner -->
  <Transition name="cookie">
    <div v-if="!cookieAccepted && !isAdmin" class="fixed bottom-0 left-0 right-0 z-40 p-4">
      <div class="max-w-3xl mx-auto bg-white border border-border rounded-card shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <span class="text-2xl flex-shrink-0">🍪</span>
          <p class="text-sm text-textSecondary leading-relaxed">
            Мы используем файлы cookie для улучшения сайта и персонализации контента.
            <a href="#" class="text-primary hover:underline ml-1">Подробнее</a>
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <button @click="declineCookies" class="flex-1 sm:flex-none px-4 py-2 border border-border rounded-btn text-sm text-textSecondary hover:bg-gray-50 transition-colors font-medium">
            Отклонить
          </button>
          <button @click="acceptCookies" class="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-btn text-sm font-semibold hover:bg-primary-600 transition-colors">
            Принять
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.float-enter-active, .float-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.float-enter-from, .float-leave-to { opacity: 0; transform: translateY(20px) scale(0.9); }
.cookie-enter-active, .cookie-leave-active { transition: all 0.4s ease; }
.cookie-enter-from, .cookie-leave-to { opacity: 0; transform: translateY(100%); }
</style>
