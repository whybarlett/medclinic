<script setup lang="ts">
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import AppButton from '../ui/AppButton.vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()
const appointmentStore = useAppointmentStore()

const navLinks = [
  { label: 'Главная', to: '/', icon: '🏠' },
  { label: 'Услуги', to: '/services', icon: '⚕️' },
  { label: 'Врачи', to: '/doctors', icon: '👨‍⚕️' },
  { label: 'Клиники', to: '/clinics', icon: '🏥' },
  { label: 'Акции', to: '/actions', icon: '🎁' },
  { label: 'Статьи', to: '/articles', icon: '📰' },
  { label: 'О нас', to: '/about', icon: '🏢' },
  { label: 'Контакты', to: '/contacts', icon: '📞' },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/50" @click="emit('close')" />
        <Transition name="slide-in">
          <div v-if="isOpen" class="absolute inset-y-0 left-0 w-80 max-w-full bg-white flex flex-col shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-border">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v4h4v2h-4v4h-2v-4H7v-2h4V7z"/></svg>
                </div>
                <span class="font-bold text-primary text-lg">МедЦентр</span>
              </div>
              <button @click="emit('close')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Закрыть меню">
                <svg class="w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Nav -->
            <nav class="flex-1 overflow-y-auto py-4 px-4">
              <RouterLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                @click="emit('close')"
                class="flex items-center gap-3 px-4 py-3 rounded-btn hover:bg-primary-50 hover:text-primary transition-colors text-textPrimary font-medium"
              >
                <span class="text-xl">{{ link.icon }}</span>
                {{ link.label }}
              </RouterLink>
            </nav>

            <!-- Bottom -->
            <div class="px-5 py-4 border-t border-border space-y-3">
              <AppButton @click="() => { appointmentStore.openModal(); emit('close') }" full-width>
                Записаться на приём
              </AppButton>
              <a href="tel:+74950000000" class="flex items-center justify-center gap-2 text-primary font-semibold py-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +7 (495) 000-00-00
              </a>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.25s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
.slide-in-enter-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-in-leave-active { transition: transform 0.2s ease-in; }
.slide-in-enter-from, .slide-in-leave-to { transform: translateX(-100%); }
</style>
