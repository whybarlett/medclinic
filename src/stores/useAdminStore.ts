import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDoctors } from '../mocks/doctors'
import { mockClinics, mockActions, mockServiceCategories } from '../mocks/index'
import type { Doctor } from '../types/doctor'
import type { Clinic, Action } from '../types/index'

export interface AdminStats {
  totalDoctors: number
  totalClinics: number
  totalAppointments: number
  totalRevenue: number
  newPatientsMonth: number
  appointmentsToday: number
}

export interface AdminAppointment {
  id: number
  patientName: string
  patientPhone: string
  doctorName: string
  doctorSpecialty: string
  clinicName: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  price: number
}

const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = '1234'

const mockAdminAppointments: AdminAppointment[] = [
  { id: 1, patientName: 'Иванов Алексей', patientPhone: '+7 (922) 111-22-33', doctorName: 'Иванова Елена Сергеевна', doctorSpecialty: 'Кардиолог', clinicName: 'МедЦентр на Ленина', date: '2026-03-25', time: '10:30', status: 'upcoming', price: 3200 },
  { id: 2, patientName: 'Смирнова Ольга', patientPhone: '+7 (913) 222-33-44', doctorName: 'Петров Алексей Михайлович', doctorSpecialty: 'Хирург', clinicName: 'МедЦентр Южный', date: '2026-03-25', time: '11:00', status: 'upcoming', price: 4500 },
  { id: 3, patientName: 'Козлов Дмитрий', patientPhone: '+7 (923) 333-44-55', doctorName: 'Смирнова Анна Викторовна', doctorSpecialty: 'Педиатр', clinicName: 'МедЦентр на Фрунзе', date: '2026-03-24', time: '14:00', status: 'completed', price: 2800 },
  { id: 4, patientName: 'Петрова Мария', patientPhone: '+7 (904) 444-55-66', doctorName: 'Козлов Дмитрий Александрович', doctorSpecialty: 'Невролог', clinicName: 'МедЦентр на Кирова', date: '2026-03-24', time: '09:00', status: 'completed', price: 3800 },
  { id: 5, patientName: 'Волков Сергей', patientPhone: '+7 (908) 555-66-77', doctorName: 'Волкова Мария Дмитриевна', doctorSpecialty: 'Гинеколог', clinicName: 'МедЦентр на Ленина', date: '2026-03-23', time: '15:30', status: 'cancelled', price: 3500 },
  { id: 6, patientName: 'Новикова Елена', patientPhone: '+7 (912) 666-77-88', doctorName: 'Морозов Игорь Петрович', doctorSpecialty: 'Ортопед', clinicName: 'МедЦентр Южный', date: '2026-03-26', time: '16:00', status: 'upcoming', price: 4200 },
  { id: 7, patientName: 'Захаров Павел', patientPhone: '+7 (919) 777-88-99', doctorName: 'Новикова Светлана Ивановна', doctorSpecialty: 'Дерматолог', clinicName: 'МедЦентр на Ленина', date: '2026-03-27', time: '10:00', status: 'upcoming', price: 3000 },
  { id: 8, patientName: 'Титова Анна', patientPhone: '+7 (921) 888-99-00', doctorName: 'Тихонов Роман Сергеевич', doctorSpecialty: 'Онколог', clinicName: 'МедЦентр на Ленина', date: '2026-03-20', time: '12:00', status: 'completed', price: 5000 },
]

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(!!localStorage.getItem('admin_auth'))
  const isLoginOpen = ref(false)
  const loginError = ref('')

  // Данные — копии моков, чтобы можно было редактировать
  const doctors = ref<Doctor[]>(JSON.parse(JSON.stringify(mockDoctors)))
  const clinics = ref<Clinic[]>(JSON.parse(JSON.stringify(mockClinics)))
  const actions = ref<Action[]>(JSON.parse(JSON.stringify(mockActions)))
  const appointments = ref<AdminAppointment[]>(mockAdminAppointments)

  // Настройки сайта
  const siteSettings = ref({
    siteName: 'МедЦентр',
    tagline: 'Сеть клиник',
    phone: '+7 (3822) 00-00-00',
    email: 'info@medclinic.ru',
    address: 'Томск, ул. Ленина, 1',
    workingHours: 'Пн–Пт: 8:00–22:00, Сб–Вс: 9:00–20:00',
    heroTitle1: 'Ваше здоровье — наш приоритет',
    heroSubtitle1: '60+ клиник, 1500+ врачей — запишитесь онлайн за 2 минуты',
    bannerText: 'Акция! Комплексное обследование со скидкой 40%',
    bannerEnabled: true,
    primaryColor: '#003D9C',
    secondaryColor: '#00AEEF',
  })

  const stats = computed<AdminStats>(() => ({
    totalDoctors: doctors.value.length,
    totalClinics: clinics.value.length,
    totalAppointments: appointments.value.length,
    totalRevenue: appointments.value.filter(a => a.status === 'completed').reduce((s, a) => s + a.price, 0),
    newPatientsMonth: 142,
    appointmentsToday: appointments.value.filter(a => a.date === '2026-03-25').length,
  }))

  function login(username: string, password: string): boolean {
    if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      localStorage.setItem('admin_auth', '1')
      loginError.value = ''
      return true
    }
    loginError.value = 'Неверный логин или пароль'
    return false
  }

  function logout() {
    isAuthenticated.value = false
    localStorage.removeItem('admin_auth')
  }

  // Врачи
  function saveDoctor(doctor: Doctor) {
    const idx = doctors.value.findIndex(d => d.id === doctor.id)
    if (idx >= 0) doctors.value[idx] = { ...doctor }
    else doctors.value.push({ ...doctor, id: Date.now() })
  }
  function deleteDoctor(id: number) {
    doctors.value = doctors.value.filter(d => d.id !== id)
  }

  // Клиники
  function saveClinic(clinic: Clinic) {
    const idx = clinics.value.findIndex(c => c.id === clinic.id)
    if (idx >= 0) clinics.value[idx] = { ...clinic }
    else clinics.value.push({ ...clinic, id: Date.now() })
  }
  function deleteClinic(id: number) {
    clinics.value = clinics.value.filter(c => c.id !== id)
  }

  // Акции
  function saveAction(action: Action) {
    const idx = actions.value.findIndex(a => a.id === action.id)
    if (idx >= 0) actions.value[idx] = { ...action }
    else actions.value.push({ ...action, id: Date.now() })
  }
  function deleteAction(id: number) {
    actions.value = actions.value.filter(a => a.id !== id)
  }

  // Записи
  function updateAppointmentStatus(id: number, status: AdminAppointment['status']) {
    const a = appointments.value.find(a => a.id === id)
    if (a) a.status = status
  }

  function saveSiteSettings(settings: typeof siteSettings.value) {
    siteSettings.value = { ...settings }
  }

  return {
    isAuthenticated, isLoginOpen, loginError,
    doctors, clinics, actions, appointments, siteSettings, stats,
    login, logout,
    saveDoctor, deleteDoctor,
    saveClinic, deleteClinic,
    saveAction, deleteAction,
    updateAppointmentStatus, saveSiteSettings,
  }
})
