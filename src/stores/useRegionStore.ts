import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Region } from '../types/index'

const tomsk: Region = {
  id: 1,
  name: 'Томск',
  phone: '+7 (3822) 00-00-00',
  domain: 'tomsk',
  isDefault: true,
}

export const useRegionStore = defineStore('region', () => {
  const currentRegion = ref<Region>(tomsk)
  const allRegions = ref<Region[]>([tomsk])

  function setRegion(_region: Region) {
    // single city, no-op
  }

  async function detectRegion() {
    // single city, no-op
  }

  return { currentRegion, allRegions, setRegion, detectRegion }
})
