import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export interface UserProfile {
  id: number
  name: string
  phone: string
  email: string
  birthDate: string
  avatar?: string
  bonusPoints: number
}

export interface UserAppointment {
  id: number
  doctorName: string
  doctorSpecialty: string
  doctorPhoto: string
  clinicName: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  price: number
  comment?: string
}

export interface UserResult {
  id: number
  title: string
  type: 'analysis' | 'mri' | 'ultrasound' | 'conclusion'
  date: string
  doctorName: string
  clinicName: string
  fileUrl?: string
  isNew: boolean
}

export interface Notification {
  id: number
  text: string
  date: string
  isRead: boolean
  type: 'appointment' | 'result' | 'promo' | 'system'
}

// Моковые данные пользователя
const mockAppointments: UserAppointment[] = [
  {
    id: 1,
    doctorName: 'Иванова Елена Сергеевна',
    doctorSpecialty: 'Кардиолог',
    doctorPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
    clinicName: 'МедЦентр на Ленина',
    date: '2026-03-25',
    time: '10:30',
    status: 'upcoming',
    price: 3200,
  },
  {
    id: 2,
    doctorName: 'Смирнова Анна Викторовна',
    doctorSpecialty: 'Педиатр',
    doctorPhoto: 'https://randomuser.me/api/portraits/women/3.jpg',
    clinicName: 'МедЦентр на Фрунзе',
    date: '2026-04-02',
    time: '14:00',
    status: 'upcoming',
    price: 2800,
  },
  {
    id: 3,
    doctorName: 'Козлов Дмитрий Александрович',
    doctorSpecialty: 'Невролог',
    doctorPhoto: 'https://randomuser.me/api/portraits/men/4.jpg',
    clinicName: 'МедЦентр на Кирова',
    date: '2026-03-10',
    time: '11:00',
    status: 'completed',
    price: 3800,
    comment: 'Назначено лечение. Повторный приём через 2 недели.',
  },
  {
    id: 4,
    doctorName: 'Петров Алексей Михайлович',
    doctorSpecialty: 'Хирург',
    doctorPhoto: 'https://randomuser.me/api/portraits/men/2.jpg',
    clinicName: 'МедЦентр Южный',
    date: '2026-02-20',
    time: '09:00',
    status: 'completed',
    price: 4500,
  },
  {
    id: 5,
    doctorName: 'Волкова Мария Дмитриевна',
    doctorSpecialty: 'Гинеколог',
    doctorPhoto: 'https://randomuser.me/api/portraits/women/5.jpg',
    clinicName: 'МедЦентр на Ленина',
    date: '2026-03-05',
    time: '15:30',
    status: 'cancelled',
    price: 3500,
  },
]

const mockResults: UserResult[] = [
  {
    id: 1,
    title: 'Общий анализ крови',
    type: 'analysis',
    date: '2026-03-10',
    doctorName: 'Козлов Д.А.',
    clinicName: 'МедЦентр на Кирова',
    isNew: true,
  },
  {
    id: 2,
    title: 'Биохимический анализ крови',
    type: 'analysis',
    date: '2026-03-10',
    doctorName: 'Козлов Д.А.',
    clinicName: 'МедЦентр на Кирова',
    isNew: true,
  },
  {
    id: 3,
    title: 'МРТ поясничного отдела позвоночника',
    type: 'mri',
    date: '2026-02-20',
    doctorName: 'Петров А.М.',
    clinicName: 'МедЦентр Южный',
    isNew: false,
  },
  {
    id: 4,
    title: 'УЗИ органов брюшной полости',
    type: 'ultrasound',
    date: '2026-02-15',
    doctorName: 'Новикова С.И.',
    clinicName: 'МедЦентр на Ленина',
    isNew: false,
  },
  {
    id: 5,
    title: 'Заключение невролога',
    type: 'conclusion',
    date: '2026-03-10',
    doctorName: 'Козлов Д.А.',
    clinicName: 'МедЦентр на Кирова',
    isNew: false,
  },
]

const mockNotifications: Notification[] = [
  {
    id: 1,
    text: 'Напоминание: завтра в 10:30 приём у кардиолога Ивановой Е.С.',
    date: '2026-03-24',
    isRead: false,
    type: 'appointment',
  },
  {
    id: 2,
    text: 'Готовы результаты: Общий анализ крови и Биохимический анализ крови',
    date: '2026-03-11',
    isRead: false,
    type: 'result',
  },
  {
    id: 3,
    text: 'Скидка 20% на повторный приём к неврологу — только до 31 марта',
    date: '2026-03-15',
    isRead: true,
    type: 'promo',
  },
  {
    id: 4,
    text: 'Ваша запись к гинекологу отменена. Вы можете записаться на другое время.',
    date: '2026-03-05',
    isRead: true,
    type: 'appointment',
  },
]

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(!!localStorage.getItem('user_auth'))
  const isLoginModalOpen = ref(false)
  const loginMode = ref<'login' | 'register'>('login')

  const profile = ref<UserProfile>({
    id: 1,
    name: 'Александр Шевченко',
    phone: '+7 (922) 345-67-89',
    email: 'a.shevchenko@mail.ru',
    birthDate: '1990-05-15',
    bonusPoints: 1250,
  })

  const appointments = ref<UserAppointment[]>(mockAppointments)
  const results = ref<UserResult[]>(mockResults)
  const notifications = ref<Notification[]>(mockNotifications)

  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  const newResults = computed(() =>
    results.value.filter(r => r.isNew).length
  )

  const upcomingAppointments = computed(() =>
    appointments.value.filter(a => a.status === 'upcoming')
  )

  function openLoginModal(mode: 'login' | 'register' = 'login') {
    loginMode.value = mode
    isLoginModalOpen.value = true
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false
  }

  function login(phone: string, _password: string) {
    // Mock login
    isAuthenticated.value = true
    localStorage.setItem('user_auth', '1')
    isLoginModalOpen.value = false
  }

  function register(name: string, phone: string, _password: string) {
    profile.value.name = name
    profile.value.phone = phone
    isAuthenticated.value = true
    localStorage.setItem('user_auth', '1')
    isLoginModalOpen.value = false
  }

  function logout() {
    isAuthenticated.value = false
    localStorage.removeItem('user_auth')
  }

  function markNotificationRead(id: number) {
    const n = notifications.value.find(n => n.id === id)
    if (n) n.isRead = true
  }

  function markAllRead() {
    notifications.value.forEach(n => n.isRead = true)
  }

  function cancelAppointment(id: number) {
    const a = appointments.value.find(a => a.id === id)
    if (a) a.status = 'cancelled'
  }

  return {
    isAuthenticated, isLoginModalOpen, loginMode,
    profile, appointments, results, notifications,
    unreadNotifications, newResults, upcomingAppointments,
    openLoginModal, closeLoginModal, login, register, logout,
    markNotificationRead, markAllRead, cancelAppointment,
  }
})
