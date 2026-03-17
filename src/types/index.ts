// service.ts
export interface Service {
  id: number
  slug: string
  name: string
  categoryId: number
  categoryName: string
  description: string
  price: number
  duration: number
  icon: string
  isPopular: boolean
}

export interface ServiceCategory {
  id: number
  name: string
  slug: string
  icon: string
  servicesCount: number
  color: string
}

// clinic.ts
export interface Clinic {
  id: number
  name: string
  address: string
  city: string
  phone: string
  email: string
  coordinates: [number, number]
  workingHours: { [key: string]: string }
  photo: string
  rating: number
  reviewsCount: number
  metro: string
  services: number[]
}

// appointment.ts
export interface TimeSlot {
  time: string
  available: boolean
}

export interface PatientForm {
  name: string
  phone: string
  email: string
  birthDate: string
  comment: string
  agreePersonalData: boolean
}

export interface Appointment {
  id?: number
  doctorId: number | null
  serviceId: number | null
  clinicId: number | null
  date: string | null
  time: string | null
  patient: PatientForm
}

// region.ts
export interface Region {
  id: number
  name: string
  phone: string
  domain: string
  isDefault: boolean
}

// action.ts
export interface Action {
  id: number
  title: string
  description: string
  image: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  validUntil: string
  categoryName: string
}

// article.ts
export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  category: string
  readTime: number
}

// review.ts
export interface Review {
  id: number
  authorName: string
  avatar?: string
  rating: number
  date: string
  text: string
  doctorId?: number
  clinicId?: number
}
