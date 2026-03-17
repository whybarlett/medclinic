<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { mockClinics } from '../../mocks/index'
import AppButton from '../ui/AppButton.vue'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import type { Clinic } from '../../types/index'

const appointmentStore = useAppointmentStore()
const selectedClinic = ref<Clinic>(mockClinics[0])
let map: any = null
let L: any = null
let markers: any[] = []

const mapEl = ref<HTMLElement | null>(null)

async function initMap() {
  if (!mapEl.value || map) return
  try {
    L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')
    // Fix default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    map = L.map(mapEl.value, { zoomControl: true, scrollWheelZoom: false }).setView([55.75, 37.61], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    mockClinics.forEach(clinic => {
      const customIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:#003D9C;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,61,156,0.4)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: '',
      })
      const marker = L.marker(clinic.coordinates, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:200px;font-family:sans-serif">
            <h4 style="font-weight:700;color:#003D9C;margin:0 0 6px">${clinic.name}</h4>
            <p style="margin:0 0 4px;font-size:13px;color:#4b5563">${clinic.address}</p>
            <p style="margin:0;font-size:12px;color:#6b7280">м. ${clinic.metro}</p>
          </div>
        `)
      marker.on('click', () => { selectedClinic.value = clinic })
      markers.push(marker)
    })
  } catch (e) {
    console.warn('Map init failed', e)
  }
}

function flyToClinic(clinic: Clinic) {
  selectedClinic.value = clinic
  if (map) map.flyTo(clinic.coordinates, 14, { duration: 1 })
}

onMounted(() => { setTimeout(initMap, 300) })
onUnmounted(() => { if (map) { map.remove(); map = null } })
</script>

<template>
  <section class="py-16 md:py-20 bg-background">
    <div class="container-custom">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 class="section-title">Наши клиники</h2>
          <p class="section-subtitle mt-2">Найдите ближайшую клинику в вашем районе</p>
        </div>
        <AppButton variant="outline" size="sm">
          <RouterLink to="/clinics">Все клиники</RouterLink>
        </AppButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[480px]">
        <!-- Sidebar: clinic list -->
        <div class="lg:col-span-2 flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-hide">
          <button
            v-for="clinic in mockClinics"
            :key="clinic.id"
            @click="flyToClinic(clinic)"
            :class="[
              'text-left p-4 rounded-card border-2 transition-all duration-200 w-full',
              selectedClinic.id === clinic.id
                ? 'border-primary bg-primary-50 shadow-card'
                : 'border-border bg-white hover:border-primary/40 hover:shadow-card'
            ]"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="font-bold text-sm text-textPrimary">{{ clinic.name }}</h4>
                <p class="text-xs text-textSecondary mt-0.5">{{ clinic.address }}</p>
                <div class="flex items-center gap-1.5 mt-2 text-xs text-textSecondary">
                  <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                  м. {{ clinic.metro }}
                  <span class="mx-1 text-border">·</span>
                  <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {{ clinic.rating }}
                </div>
              </div>
              <div v-if="selectedClinic.id === clinic.id" class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
            </div>
            <!-- Working hours (show on active) -->
            <Transition name="expand">
              <div v-if="selectedClinic.id === clinic.id" class="mt-3 pt-3 border-t border-primary/20 space-y-1">
                <p v-for="(hours, day) in clinic.workingHours" :key="day" class="text-xs flex justify-between">
                  <span class="text-textSecondary">{{ day }}</span>
                  <span class="font-semibold text-textPrimary">{{ hours }}</span>
                </p>
                <AppButton size="sm" class="w-full mt-3 text-xs" @click.stop="appointmentStore.openModal()">
                  Записаться в эту клинику
                </AppButton>
              </div>
            </Transition>
          </button>
        </div>

        <!-- Map -->
        <div class="lg:col-span-3 rounded-card overflow-hidden min-h-[360px] bg-gray-100 relative shadow-card">
          <div ref="mapEl" class="w-full h-full min-h-[360px]" />
          <!-- Map loading fallback -->
          <div v-if="!map" class="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div class="text-center text-textSecondary">
              <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              <p class="text-sm">Загрузка карты...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 200px; }
</style>
