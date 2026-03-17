// doctor.ts
export interface Doctor {
  id: number
  name: string
  photo: string
  specialty: string
  specialties: string[]
  experience: number
  rating: number
  reviewsCount: number
  price: number
  clinicId: number
  clinicName: string
  education: string[]
  bio: string
  awards: string[]
  isAvailable: boolean
  nextAvailable: string
}

export interface DoctorsFilter {
  specialty: string
  clinic: string
  name: string
  sort: 'rating' | 'price_asc' | 'price_desc' | 'experience'
  page: number
  limit: number
}
