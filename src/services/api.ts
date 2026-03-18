// src/services/api.ts
// HTTP-клиент для работы с PHP бэкендом

import axios from 'axios'

// ← Измени на адрес твоего PHP сервера (XAMPP/OpenServer)
export const BASE_URL = 'http://localhost/medclinic/backend/api'

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Интерцептор для обработки ошибок
http.interceptors.response.use(
  res => res.data.data ?? res.data,
  err => {
    const msg = err.response?.data?.error ?? 'Ошибка соединения с сервером'
    console.error('[API Error]', msg)
    return Promise.reject(new Error(msg))
  }
)

// ──────────────────────────────────────────────
// Врачи
// ──────────────────────────────────────────────
export const doctorsApi = {
  getAll: (params?: {
    specialty?: string
    clinic?: string
    name?: string
    sort?: string
    page?: number
    limit?: number
  }) => http.get('/doctors.php', { params }),

  getById: (id: number) =>
    http.get('/doctors.php', { params: { id } }),

  create: (data: Record<string, unknown>) =>
    http.post('/doctors.php', data),

  update: (id: number, data: Record<string, unknown>) =>
    http.put(`/doctors.php?id=${id}`, data),

  delete: (id: number) =>
    http.delete(`/doctors.php?id=${id}`),
}

// ──────────────────────────────────────────────
// Клиники
// ──────────────────────────────────────────────
export const clinicsApi = {
  getAll: (region = 1) =>
    http.get('/clinics.php', { params: { region } }),

  getById: (id: number) =>
    http.get('/clinics.php', { params: { id } }),

  create: (data: Record<string, unknown>) =>
    http.post('/clinics.php', data),

  update: (id: number, data: Record<string, unknown>) =>
    http.put(`/clinics.php?id=${id}`, data),

  delete: (id: number) =>
    http.delete(`/clinics.php?id=${id}`),
}

// ──────────────────────────────────────────────
// Услуги
// ──────────────────────────────────────────────
export const servicesApi = {
  getAll: (category?: string) =>
    http.get('/services.php', { params: category ? { category } : {} }),

  getCategories: () =>
    http.get('/services.php', { params: { type: 'categories' } }),
}

// ──────────────────────────────────────────────
// Записи на приём
// ──────────────────────────────────────────────
export const appointmentsApi = {
  getAll: (params?: {
    user_id?: number
    status?: string
    search?: string
    page?: number
  }) => http.get('/appointments.php', { params }),

  create: (data: {
    doctor_id: number
    clinic_id: number
    date: string
    time: string
    patient_name: string
    patient_phone: string
    patient_email?: string
    comment?: string
    service_id?: number
  }) => http.post('/appointments.php', data),

  updateStatus: (id: number, status: string) =>
    http.put(`/appointments.php?id=${id}`, { status }),
}

// ──────────────────────────────────────────────
// Акции
// ──────────────────────────────────────────────
export const actionsApi = {
  getAll: () => http.get('/actions.php'),
  getById: (id: number) => http.get('/actions.php', { params: { id } }),
  create: (data: Record<string, unknown>) => http.post('/actions.php', data),
  update: (id: number, data: Record<string, unknown>) => http.put(`/actions.php?id=${id}`, data),
  delete: (id: number) => http.delete(`/actions.php?id=${id}`),
}

// ──────────────────────────────────────────────
// Отзывы
// ──────────────────────────────────────────────
export const reviewsApi = {
  getAll: (params?: { doctor_id?: number; clinic_id?: number }) =>
    http.get('/reviews.php', { params }),

  create: (data: {
    author_name: string
    rating: number
    text: string
    doctor_id?: number
    clinic_id?: number
  }) => http.post('/reviews.php', data),
}

// ──────────────────────────────────────────────
// Авторизация
// ──────────────────────────────────────────────
export const authApi = {
  login: (phone: string, password: string) =>
    http.post('/auth.php?action=login', { phone, password }),

  register: (name: string, phone: string, password: string, email?: string) =>
    http.post('/auth.php?action=register', { name, phone, password, email }),

  adminLogin: (username: string, password: string) =>
    http.post('/auth.php?action=admin_login', { username, password }),
}

// ──────────────────────────────────────────────
// Настройки
// ──────────────────────────────────────────────
export const settingsApi = {
  getAll: () => http.get('/settings.php'),
  save: (data: Record<string, string>) => http.put('/settings.php', data),
}

// ──────────────────────────────────────────────
// Статистика (для админа)
// ──────────────────────────────────────────────
export const statsApi = {
  get: () => http.get('/stats.php'),
}
