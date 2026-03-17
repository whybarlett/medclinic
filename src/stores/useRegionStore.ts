import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Region } from '../types/index'

const regions: Region[] = [
  { id: 1, name: 'Москва', phone: '+7 (495) 000-00-00', domain: 'moscow', isDefault: true },
  { id: 2, name: 'Санкт-Петербург', phone: '+7 (812) 000-00-00', domain: 'spb', isDefault: false },
  { id: 3, name: 'Новосибирск', phone: '+7 (383) 000-00-00', domain: 'nsk', isDefault: false },
  { id: 4, name: 'Екатеринбург', phone: '+7 (343) 000-00-00', domain: 'ekb', isDefault: false },
  { id: 5, name: 'Казань', phone: '+7 (843) 000-00-00', domain: 'kazan', isDefault: false },
  { id: 6, name: 'Краснодар', phone: '+7 (861) 000-00-00', domain: 'krd', isDefault: false },
  { id: 7, name: 'Нижний Новгород', phone: '+7 (831) 000-00-00', domain: 'nn', isDefault: false },
  { id: 8, name: 'Ростов-на-Дону', phone: '+7 (863) 000-00-00', domain: 'rostov', isDefault: false },
]

export const useRegionStore = defineStore('region', () => {
  const currentRegion = ref<Region>(
    JSON.parse(localStorage.getItem('region') || 'null') ?? regions[0]
  )
  const allRegions = ref<Region[]>(regions)

  function setRegion(region: Region) {
    currentRegion.value = region
    localStorage.setItem('region', JSON.stringify(region))
  }

  async function detectRegion() {
    try {
      const saved = localStorage.getItem('region')
      if (saved) { currentRegion.value = JSON.parse(saved); return }
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      const city = data.city as string
      const found = regions.find(r => r.name.toLowerCase().includes(city?.toLowerCase()))
      if (found) setRegion(found)
    } catch { /* silently fail, keep default */ }
  }

  return { currentRegion, allRegions, setRegion, detectRegion }
})
