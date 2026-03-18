<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockClinics, mockReviews } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppRating from '../components/ui/AppRating.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import { formatDate } from '../utils/index'

const route = useRoute()
const appointmentStore = useAppointmentStore()

const clinic = computed(() => mockClinics.find(c => c.id === Number(route.params.id)))
const clinicReviews = computed(() => mockReviews.filter(r => r.clinicId === clinic.value?.id))

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Клиники', to: '/clinics' },
  { label: clinic.value?.name || '' },
])

let map: any = null
const mapEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!mapEl.value || !clinic.value) return
  try {
    const L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
    map = L.map(mapEl.value, { scrollWheelZoom: false }).setView(clinic.value.coordinates, 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
    const icon = L.divIcon({ html: `<div style="width:28px;height:28px;background:#003D9C;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,61,156,0.4)"></div>`, iconSize: [28,28], iconAnchor: [14,28], className: '' })
    L.marker(clinic.value.coordinates, { icon }).addTo(map).openPopup()
  } catch(e) { console.warn(e) }
})
onUnmounted(() => { if (map) { map.remove(); map = null } })
</script>

<template>
  <main class="min-h-screen bg-background">
    <div v-if="!clinic" class="container-custom py-24 text-center">
      <h1 class="text-2xl font-bold mb-4">Клиника не найдена</h1>
      <RouterLink to="/clinics" class="btn-primary inline-flex">← Все клиники</RouterLink>
    </div>
    <template v-else>
      <div class="bg-white border-b border-border">
        <div class="container-custom py-4"><AppBreadcrumbs :items="breadcrumbs" /></div>
      </div>
      <div class="container-custom py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <!-- Photo -->
            <div class="h-64 rounded-card overflow-hidden">
              <img :src="clinic.photo" :alt="clinic.name" class="w-full h-full object-cover" />
            </div>
            <!-- Info -->
            <div class="card p-6">
              <div class="flex items-start justify-between gap-4 mb-5">
                <h1 class="text-2xl font-bold text-textPrimary">{{ clinic.name }}</h1>
                <AppRating :rating="clinic.rating" :count="clinic.reviewsCount" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div class="flex items-start gap-2 text-textSecondary"><svg class="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>{{ clinic.address }}</div>
                <div class="flex items-start gap-2 text-textSecondary"><svg class="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7"/></svg>{{ clinic.metro }}</div>
                <a :href="`tel:${clinic.phone}`" class="flex items-center gap-2 text-primary font-semibold"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>{{ clinic.phone }}</a>
                <a :href="`mailto:${clinic.email}`" class="flex items-center gap-2 text-primary"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>{{ clinic.email }}</a>
              </div>
              <!-- Hours -->
              <div class="mt-5 pt-5 border-t border-border">
                <h3 class="font-bold text-textPrimary mb-3">Режим работы</h3>
                <div class="space-y-1.5">
                  <div v-for="(hours, day) in clinic.workingHours" :key="day" class="flex justify-between text-sm">
                    <span class="text-textSecondary">{{ day }}</span>
                    <span class="font-semibold text-textPrimary">{{ hours }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Map -->
            <div class="rounded-card overflow-hidden shadow-card" style="height:300px;position:relative;isolation:isolate">
              <div ref="mapEl" style="width:100%;height:100%" />
            </div>
            <!-- Reviews -->
            <div class="card p-6">
              <h2 class="font-bold text-textPrimary mb-4">Отзывы ({{ clinicReviews.length }})</h2>
              <div v-if="clinicReviews.length" class="space-y-4">
                <div v-for="r in clinicReviews" :key="r.id" class="border border-border rounded-card p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-sm">{{ r.authorName }}</span>
                    <AppRating :rating="r.rating" size="sm" />
                  </div>
                  <p class="text-sm text-textSecondary">{{ r.text }}</p>
                  <p class="text-xs text-textSecondary mt-2">{{ formatDate(r.date, { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
                </div>
              </div>
              <p v-else class="text-textSecondary text-sm">Отзывов пока нет</p>
            </div>
          </div>
          <!-- Sidebar -->
          <div class="sticky top-24 h-fit">
            <div class="card p-5">
              <AppButton @click="appointmentStore.openModal()" full-width size="lg" class="mb-3">Записаться</AppButton>
              <a :href="`tel:${clinic.phone}`" class="w-full flex items-center justify-center gap-2 py-3 border-2 border-border rounded-btn text-sm font-semibold hover:border-primary hover:text-primary transition-colors">{{ clinic.phone }}</a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
