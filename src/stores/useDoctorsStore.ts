import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Doctor, DoctorsFilter } from '../types/doctor'
import { mockDoctors } from '../mocks/doctors'

export const useDoctorsStore = defineStore('doctors', () => {
  const doctors = ref<Doctor[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const lastFetched = ref<number | null>(null)
  const CACHE_TTL = 5 * 60 * 1000

  const filters = ref<DoctorsFilter>({
    specialty: '', clinic: '', name: '', sort: 'rating', page: 1, limit: 8,
  })

  const specialties = computed(() => {
    const all = mockDoctors.flatMap(d => d.specialties)
    return [...new Set(all)].sort()
  })

  async function fetchDoctors(newFilters?: Partial<DoctorsFilter>) {
    if (newFilters) Object.assign(filters.value, newFilters)
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < CACHE_TTL && !newFilters) return

    isLoading.value = true
    await new Promise(r => setTimeout(r, 400))

    let result = [...mockDoctors]
    if (filters.value.name) {
      result = result.filter(d => d.name.toLowerCase().includes(filters.value.name.toLowerCase()))
    }
    if (filters.value.specialty) {
      result = result.filter(d => d.specialties.includes(filters.value.specialty))
    }
    if (filters.value.clinic) {
      result = result.filter(d => d.clinicId === Number(filters.value.clinic))
    }

    if (filters.value.sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (filters.value.sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    else if (filters.value.sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    else if (filters.value.sort === 'experience') result.sort((a, b) => b.experience - a.experience)

    total.value = result.length
    const start = (filters.value.page - 1) * filters.value.limit
    doctors.value = result.slice(start, start + filters.value.limit)
    lastFetched.value = Date.now()
    isLoading.value = false
  }

  function fetchDoctorById(id: number): Doctor | undefined {
    return mockDoctors.find(d => d.id === id)
  }

  function getTopDoctors(n = 6): Doctor[] {
    return [...mockDoctors].sort((a, b) => b.rating - a.rating).slice(0, n)
  }

  return { doctors, total, filters, isLoading, specialties, fetchDoctors, fetchDoctorById, getTopDoctors }
})
