<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useRegionStore } from '../../stores/useRegionStore'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import { useUserStore } from '../../stores/useUserStore'
import { mockServiceCategories } from '../../mocks/index'
import AppButton from '../ui/AppButton.vue'
import MobileMenu from './MobileMenu.vue'

const router = useRouter()
const route = useRoute()
const regionStore = useRegionStore()
const appointmentStore = useAppointmentStore()
const userStore = useUserStore()

const { y } = useScroll(window)
const isScrolled = computed(() => y.value > 20)

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isServicesMegaOpen = ref(false)
const searchQuery = ref('')
const bannerClosed = ref(localStorage.getItem('banner_closed') === '1')

let megaTimer: ReturnType<typeof setTimeout> | null = null
function openMega() {
  if (megaTimer) clearTimeout(megaTimer)
  isServicesMegaOpen.value = true
}
function closeMegaDelayed() {
  megaTimer = setTimeout(() => { isServicesMegaOpen.value = false }, 150)
}

const navLinks = [
  { label: 'Услуги', to: '/services', hasMega: true },
  { label: 'Врачи', to: '/doctors' },
  { label: 'Клиники', to: '/clinics', hasMega: true },
  { label: 'Акции', to: '/actions' },
  { label: 'Статьи', to: '/articles' },
  { label: 'О нас', to: '/about' },
  { label: 'Контакты', to: '/contacts' },
]

const popularSearches = ['МРТ головного мозга', 'Кардиолог', 'УЗИ брюшной полости', 'Анализ крови', 'Педиатр']

function closeBanner() {
  bannerClosed.value = true
  localStorage.setItem('banner_closed', '1')
}

function doSearch() {
  if (searchQuery.value.trim()) {
    isSearchOpen.value = false
    router.push({ path: '/doctors', query: { q: searchQuery.value } })
  }
}

function isActiveRoute(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <!-- Sticky promo banner -->
  <div v-if="!bannerClosed" class="bg-secondary text-white text-sm py-2 text-center relative">
    <span>🎉 Акция! Комплексное обследование со скидкой 40%</span>
    <RouterLink to="/actions/1" class="ml-2 underline font-semibold hover:no-underline">Подробнее</RouterLink>
    <button @click="closeBanner" class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded" aria-label="Закрыть баннер">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>

  <!-- Header -->
  <header :class="['sticky top-0 z-40 bg-white transition-shadow duration-300', isScrolled ? 'shadow-header' : '']">
    <!-- Top bar -->
    <div class="border-b border-border/50 hidden md:block">
      <div class="container-custom flex items-center justify-between py-2 text-sm">
        <!-- City -->
        <div class="flex items-center gap-1 text-textSecondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Томск
        </div>

        <!-- Right: phone + actions -->
        <div class="flex items-center gap-4">
          <a :href="`tel:${regionStore.currentRegion.phone}`" class="flex items-center gap-1.5 text-primary font-semibold hover:text-primary-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            {{ regionStore.currentRegion.phone }}
          </a>
          <RouterLink v-if="userStore.isAuthenticated" to="/cabinet" class="flex items-center gap-1.5 text-textSecondary hover:text-primary transition-colors relative">
            <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">{{ userStore.profile.name.charAt(0) }}</div>
            <span>{{ userStore.profile.name.split(' ')[0] }}</span>
            <span v-if="userStore.unreadNotifications > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center">{{ userStore.unreadNotifications }}</span>
          </RouterLink>
          <button v-else @click="userStore.openLoginModal()" class="text-textSecondary hover:text-primary transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Личный кабинет
          </button>
        </div>
      </div>
    </div>

    <!-- Main nav -->
    <div class="container-custom flex items-center justify-between py-3 gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 flex-shrink-0">
        <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v4h4v2h-4v4h-2v-4H7v-2h4V7z"/></svg>
        </div>
        <div class="hidden sm:block">
          <div class="font-bold text-xl leading-none text-primary">МедЦентр</div>
          <div class="text-xs text-textSecondary leading-none mt-0.5">Сеть клиник</div>
        </div>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-1">
        <template v-for="link in navLinks" :key="link.to">
          <!-- Services with mega menu -->
          <div
            v-if="link.to === '/services'"
            class="relative"
            @mouseenter="openMega"
            @mouseleave="closeMegaDelayed"
          >
            <RouterLink
              :to="link.to"
              :class="['px-3 py-2 rounded-btn text-sm font-medium transition-colors flex items-center gap-1',
                isActiveRoute(link.to) || isServicesMegaOpen ? 'text-primary bg-primary-50' : 'text-textPrimary hover:text-primary hover:bg-gray-50']"
            >
              {{ link.label }}
              <svg :class="['w-3.5 h-3.5 transition-transform', isServicesMegaOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </RouterLink>
            <Transition name="dropdown">
              <div
                v-if="isServicesMegaOpen"
                class="absolute top-full left-0 mt-1 bg-white border border-border rounded-card shadow-card w-[520px] z-50 p-4"
                @mouseenter="openMega"
                @mouseleave="closeMegaDelayed"
              >
                <div class="grid grid-cols-2 gap-1">
                  <RouterLink
                    v-for="cat in mockServiceCategories"
                    :key="cat.id"
                    :to="`/services?cat=${cat.slug}`"
                    @click="isServicesMegaOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-btn hover:bg-primary-50 transition-colors group"
                  >
                    <div
                      class="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      :style="{ backgroundColor: cat.color + '18' }"
                    >{{ cat.icon }}</div>
                    <div>
                      <div class="text-sm font-semibold text-textPrimary group-hover:text-primary transition-colors">{{ cat.name }}</div>
                      <div class="text-xs text-textSecondary">{{ cat.servicesCount }} услуг</div>
                    </div>
                  </RouterLink>
                </div>
                <div class="border-t border-border mt-3 pt-3">
                  <RouterLink to="/services" @click="isServicesMegaOpen = false" class="text-sm font-semibold text-primary hover:underline">
                    Смотреть все услуги →
                  </RouterLink>
                </div>
              </div>
            </Transition>
          </div>
          <!-- Regular link -->
          <RouterLink
            v-else
            :to="link.to"
            :class="['px-3 py-2 rounded-btn text-sm font-medium transition-colors flex items-center gap-1',
              isActiveRoute(link.to) ? 'text-primary bg-primary-50' : 'text-textPrimary hover:text-primary hover:bg-gray-50']"
          >
            {{ link.label }}
          </RouterLink>
        </template>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-2">
        <!-- Search -->
        <button @click="isSearchOpen = true" class="p-2 rounded-btn hover:bg-gray-100 transition-colors text-textSecondary hover:text-primary" aria-label="Поиск">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
        <AppButton @click="appointmentStore.openModal()" size="sm" class="hidden sm:inline-flex">
          Записаться
        </AppButton>
        <!-- Mobile burger -->
        <button @click="isMobileMenuOpen = true" class="p-2 rounded-btn hover:bg-gray-100 transition-colors lg:hidden" aria-label="Меню">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Search overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isSearchOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4" @click.self="isSearchOpen = false">
        <div class="bg-white rounded-card shadow-2xl w-full max-w-2xl p-6 animate-slide-up">
          <div class="flex items-center gap-3 border-b-2 border-primary pb-3">
            <svg class="w-5 h-5 text-textSecondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="searchQuery"
              @keydown.enter="doSearch"
              autofocus
              placeholder="Введите услугу или врача..."
              class="flex-1 text-lg outline-none text-textPrimary placeholder-gray-400"
            />
            <button @click="isSearchOpen = false" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="mt-4">
            <p class="text-sm text-textSecondary mb-3">Популярные запросы</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in popularSearches"
                :key="s"
                @click="() => { searchQuery = s; doSearch() }"
                class="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary text-sm rounded-full transition-colors text-textPrimary"
              >{{ s }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Mobile menu -->
  <MobileMenu :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
