<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { mockClinics } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import AppRating from '../components/ui/AppRating.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import type { Clinic } from '../types/index'

const appointmentStore = useAppointmentStore()
const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Клиники' }]
const selectedClinic = ref<Clinic>(mockClinics[0])
const showMap = ref(false)
const mapReady = ref(false)

let map: any = null
let L: any = null
const mapEl = ref<HTMLElement | null>(null)

async function initMap() {
  if (!mapEl.value || map) return
  try {
    L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
    map = L.map(mapEl.value, { scrollWheelZoom: false }).setView([56.484, 84.948], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
    mockClinics.forEach(c => {
      const icon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:#003D9C;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,61,156,0.4)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: '',
      })
      L.marker(c.coordinates, { icon }).addTo(map).on('click', () => { selectedClinic.value = c })
    })
    mapReady.value = true
  } catch(e) { console.warn('map fail', e) }
}

onMounted(() => { if (showMap.value) setTimeout(initMap, 200) })
onUnmounted(() => { if (map) { map.remove(); map = null } })

async function toggleMap() {
  showMap.value = !showMap.value
  if (showMap.value && !map) setTimeout(initMap, 100)
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <AppBreadcrumbs :items="breadcrumbs" class="mb-3" />
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">Клиники МедЦентр</h1>
            <p class="text-textSecondary text-sm mt-1">{{ mockClinics.length }} клиник в Томске</p>
          </div>
          <button
            @click="toggleMap"
            :class="['flex items-center gap-2 px-4 py-2.5 border-2 rounded-btn text-sm font-semibold transition-colors', showMap ? 'border-primary bg-primary text-white' : 'border-border text-textPrimary hover:border-primary']"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            {{ showMap ? 'Скрыть карту' : 'На карте' }}
          </button>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">
      <!-- Map — isolation:isolate запирает z-индексы Leaflet внутри контейнера -->
      <Transition name="expand">
        <div
          v-if="showMap"
          class="mb-8 shadow-card bg-gray-100"
          style="position: relative; isolation: isolate; height: 320px; border-radius: 16px; overflow: hidden;"
        >
          <div ref="mapEl" style="width: 100%; height: 100%;" />
          <div v-if="!mapReady" class="absolute inset-0 flex items-center justify-center bg-gray-100 pointer-events-none">
            <p class="text-sm text-textSecondary">Загрузка карты...</p>
          </div>
        </div>
      </Transition>

      <!-- Clinics grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="clinic in mockClinics" :key="clinic.id" class="card overflow-hidden group">
          <div class="h-44 overflow-hidden">
            <img :src="clinic.photo" :alt="clinic.name" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div class="p-5">
            <div class="flex items-start justify-between gap-2 mb-3">
              <h3 class="font-bold text-textPrimary group-hover:text-primary transition-colors">{{ clinic.name }}</h3>
              <AppRating :rating="clinic.rating" :count="clinic.reviewsCount" size="sm" class="flex-shrink-0" />
            </div>
            <div class="space-y-1.5 text-sm mb-4">
              <div class="flex items-center gap-2 text-textSecondary">
                <svg class="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                {{ clinic.address }}
              </div>
              <div class="flex items-center gap-2 text-textSecondary">
                <svg class="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7"/></svg>
                {{ clinic.metro }}
              </div>
              <div class="flex items-center gap-2 text-textSecondary">
                <svg class="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span v-for="(h, d) in clinic.workingHours" :key="d" class="mr-2">{{ d }}: {{ h }}</span>
              </div>
              <a :href="`tel:${clinic.phone}`" class="flex items-center gap-2 text-primary font-semibold">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                {{ clinic.phone }}
              </a>
            </div>
            <div class="flex gap-2">
              <AppButton size="sm" @click="appointmentStore.openModal()" class="flex-1">Записаться</AppButton>
              <RouterLink :to="`/clinics/${clinic.id}`" class="flex-1 flex items-center justify-center px-4 py-2 border-2 border-border rounded-btn text-sm font-semibold text-textPrimary hover:border-primary hover:text-primary transition-colors">Подробнее</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.expand-enter-to, .expand-leave-from { max-height: 400px; opacity: 1; }
</style>
