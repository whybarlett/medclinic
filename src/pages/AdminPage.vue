<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/useAdminStore'
import type { Doctor } from '../types/doctor'
import type { Clinic, Action } from '../types/index'
import { formatDate } from '../utils/index'

const router = useRouter()
const admin = useAdminStore()

// Если не авторизован — показываем форму входа
const loginForm = reactive({ username: '', password: '' })
function doLogin() {
  if (admin.login(loginForm.username, loginForm.password)) {
    loginForm.username = ''
    loginForm.password = ''
  }
}

const activeTab = ref('dashboard')
const tabs = [
  { key: 'dashboard', label: 'Дашборд', icon: '📊' },
  { key: 'appointments', label: 'Записи', icon: '📅' },
  { key: 'doctors', label: 'Врачи', icon: '👨‍⚕️' },
  { key: 'clinics', label: 'Клиники', icon: '🏥' },
  { key: 'actions', label: 'Акции', icon: '🎁' },
  { key: 'settings', label: 'Настройки', icon: '⚙️' },
]

// ── Фильтры таблиц ──
const apptSearch = ref('')
const apptStatus = ref('')
const docSearch = ref('')

const filteredAppointments = computed(() => {
  return admin.appointments.filter(a => {
    const q = apptSearch.value.toLowerCase()
    const matchQ = !q || a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q)
    const matchS = !apptStatus.value || a.status === apptStatus.value
    return matchQ && matchS
  })
})
const filteredDoctors = computed(() => {
  const q = docSearch.value.toLowerCase()
  return admin.doctors.filter(d => !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
})

// ── Модал редактирования врача ──
const doctorModal = ref(false)
const editingDoctor = ref<Partial<Doctor>>({})
function openDoctorModal(doctor?: Doctor) {
  editingDoctor.value = doctor ? { ...doctor } : {
    name: '', specialty: '', specialties: [], experience: 0,
    rating: 5.0, reviewsCount: 0, price: 0, clinicId: 1,
    clinicName: '', education: [], bio: '', awards: [],
    isAvailable: true, nextAvailable: new Date().toISOString().split('T')[0],
    photo: 'https://randomuser.me/api/portraits/men/99.jpg',
  }
  doctorModal.value = true
}
function saveDoctor() {
  admin.saveDoctor(editingDoctor.value as Doctor)
  doctorModal.value = false
}
function deleteDoctor(id: number) {
  if (confirm('Удалить врача?')) admin.deleteDoctor(id)
}

// ── Модал редактирования клиники ──
const clinicModal = ref(false)
const editingClinic = ref<Partial<Clinic>>({})
function openClinicModal(clinic?: Clinic) {
  editingClinic.value = clinic ? { ...clinic } : {
    name: '', address: '', city: 'Томск', phone: '', email: '',
    coordinates: [56.484, 84.948], workingHours: { 'Пн–Пт': '8:00–22:00', 'Сб–Вс': '9:00–20:00' },
    photo: '', rating: 5.0, reviewsCount: 0, metro: '', services: [],
  }
  clinicModal.value = true
}
function saveClinic() {
  admin.saveClinic(editingClinic.value as Clinic)
  clinicModal.value = false
}

// ── Модал редактирования акции ──
const actionModal = ref(false)
const editingAction = ref<Partial<Action>>({})
function openActionModal(action?: Action) {
  editingAction.value = action ? { ...action } : {
    title: '', description: '', image: '',
    originalPrice: 0, discountPrice: 0, discountPercent: 0,
    validUntil: '', categoryName: '',
  }
  actionModal.value = true
}
function saveAction() {
  if (!editingAction.value.discountPercent && editingAction.value.originalPrice && editingAction.value.discountPrice) {
    editingAction.value.discountPercent = Math.round((1 - editingAction.value.discountPrice / editingAction.value.originalPrice) * 100)
  }
  admin.saveAction(editingAction.value as Action)
  actionModal.value = false
}

// ── Настройки ──
const editSettings = ref({ ...admin.siteSettings })
function saveSettings() {
  admin.saveSiteSettings(editSettings.value)
  alert('Настройки сохранены!')
}

const statusLabel: Record<string, string> = { upcoming: 'Предстоящий', completed: 'Завершён', cancelled: 'Отменён' }
const statusColor: Record<string, string> = {
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}
</script>

<template>
  <!-- ══════════════ LOGIN ══════════════ -->
  <main v-if="!admin.isAuthenticated" class="min-h-screen bg-gradient-to-br from-primary to-[#001f5e] flex items-center justify-center p-4">
    <div class="bg-white rounded-[20px] shadow-2xl w-full max-w-sm p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v4h4v2h-4v4h-2v-4H7v-2h4V7z"/></svg>
        </div>
        <h1 class="text-2xl font-bold text-textPrimary">Панель администратора</h1>
        <p class="text-textSecondary text-sm mt-1">МедЦентр</p>
      </div>

      <div v-if="admin.loginError" class="bg-red-50 border border-red-200 rounded-input p-3 mb-4 text-sm text-red-600 text-center">
        {{ admin.loginError }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Логин</label>
          <input v-model="loginForm.username" @keydown.enter="doLogin" placeholder="admin" class="input-field" />
        </div>
        <div>
          <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Пароль</label>
          <input v-model="loginForm.password" @keydown.enter="doLogin" type="password" placeholder="••••••••" class="input-field" />
        </div>
        <button @click="doLogin" class="btn-primary w-full justify-center py-3 text-base">
          Войти
        </button>
      </div>

      <div class="mt-5 bg-primary-50 rounded-input p-3 text-center">
        <p class="text-xs text-primary font-medium">💡 Логин: <b>admin</b> · Пароль: <b>admin123</b></p>
      </div>
    </div>
  </main>

  <!-- ══════════════ ADMIN PANEL ══════════════ -->
  <div v-else class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-[#0a1628] text-white flex flex-col flex-shrink-0 min-h-screen">
      <!-- Logo -->
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v4h4v2h-4v4h-2v-4H7v-2h4V7z"/></svg>
          </div>
          <div>
            <div class="font-bold text-sm">МедЦентр</div>
            <div class="text-white/40 text-xs">Панель управления</div>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 space-y-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium transition-all text-left',
            activeTab === tab.key
              ? 'bg-primary text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="text-base">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>

      <!-- Bottom -->
      <div class="p-4 border-t border-white/10 space-y-2">
        <RouterLink to="/" class="flex items-center gap-2 px-4 py-2.5 text-white/60 hover:text-white text-sm rounded-btn hover:bg-white/10 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          На сайт
        </RouterLink>
        <button @click="admin.logout(); router.push('/')" class="w-full flex items-center gap-2 px-4 py-2.5 text-white/60 hover:text-red-400 text-sm rounded-btn hover:bg-white/10 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Выйти
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-auto">

      <!-- Top bar -->
      <div class="bg-white border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 class="text-lg font-bold text-textPrimary">
          {{ tabs.find(t => t.key === activeTab)?.icon }} {{ tabs.find(t => t.key === activeTab)?.label }}
        </h1>
        <div class="flex items-center gap-3 text-sm text-textSecondary">
          <span class="w-2 h-2 rounded-full bg-success inline-block" />
          Администратор
        </div>
      </div>

      <div class="p-8">

        <!-- ══ ДАШБОРД ══ -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6 animate-fade-in">
          <!-- Stats grid -->
          <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div v-for="item in [
              { label: 'Врачей', value: admin.stats.totalDoctors, icon: '👨‍⚕️', color: 'bg-blue-50 text-blue-700' },
              { label: 'Клиник', value: admin.stats.totalClinics, icon: '🏥', color: 'bg-green-50 text-green-700' },
              { label: 'Всего записей', value: admin.stats.totalAppointments, icon: '📅', color: 'bg-purple-50 text-purple-700' },
              { label: 'Записей сегодня', value: admin.stats.appointmentsToday, icon: '🔔', color: 'bg-orange-50 text-orange-700' },
              { label: 'Новых пациентов', value: admin.stats.newPatientsMonth, icon: '👥', color: 'bg-pink-50 text-pink-700' },
              { label: 'Выручка (завер.)', value: admin.stats.totalRevenue.toLocaleString('ru') + ' ₽', icon: '💰', color: 'bg-yellow-50 text-yellow-700' },
            ]" :key="item.label" class="bg-white rounded-card p-4 border border-border shadow-sm">
              <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3', item.color]">{{ item.icon }}</div>
              <div class="text-xl font-black text-textPrimary">{{ item.value }}</div>
              <div class="text-xs text-textSecondary mt-0.5">{{ item.label }}</div>
            </div>
          </div>

          <!-- Recent appointments -->
          <div class="bg-white rounded-card border border-border shadow-sm">
            <div class="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 class="font-bold text-textPrimary">Последние записи</h3>
              <button @click="activeTab = 'appointments'" class="text-xs text-primary hover:underline font-semibold">Все записи →</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead><tr class="border-b border-border bg-gray-50">
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Пациент</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Врач</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Дата</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Сумма</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Статус</th>
                </tr></thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="apt in admin.appointments.slice(0, 5)" :key="apt.id" class="hover:bg-gray-50 transition-colors">
                    <td class="py-3 px-4">
                      <div class="font-semibold text-textPrimary">{{ apt.patientName }}</div>
                      <div class="text-xs text-textSecondary">{{ apt.patientPhone }}</div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-textPrimary">{{ apt.doctorName.split(' ').slice(0,2).join(' ') }}</div>
                      <div class="text-xs text-secondary">{{ apt.doctorSpecialty }}</div>
                    </td>
                    <td class="py-3 px-4 text-textSecondary">{{ apt.date }}, {{ apt.time }}</td>
                    <td class="py-3 px-4 font-bold text-textPrimary">{{ apt.price.toLocaleString('ru') }} ₽</td>
                    <td class="py-3 px-4">
                      <span :class="['text-xs font-bold px-2.5 py-1 rounded-full border', statusColor[apt.status]]">{{ statusLabel[apt.status] }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="item in [
              { label: 'Добавить врача', icon: '👨‍⚕️', tab: 'doctors', action: () => { activeTab = 'doctors'; openDoctorModal() } },
              { label: 'Добавить клинику', icon: '🏥', tab: 'clinics', action: () => { activeTab = 'clinics'; openClinicModal() } },
              { label: 'Создать акцию', icon: '🎁', tab: 'actions', action: () => { activeTab = 'actions'; openActionModal() } },
              { label: 'Настройки сайта', icon: '⚙️', tab: 'settings', action: () => activeTab = 'settings' },
            ]" :key="item.label"
              @click="item.action()"
              class="bg-white rounded-card p-5 border border-border hover:border-primary/40 hover:shadow-card transition-all text-left group"
            >
              <div class="text-2xl mb-2">{{ item.icon }}</div>
              <div class="text-sm font-semibold text-textPrimary group-hover:text-primary transition-colors">{{ item.label }}</div>
            </button>
          </div>
        </div>

        <!-- ══ ЗАПИСИ ══ -->
        <div v-else-if="activeTab === 'appointments'" class="animate-fade-in">
          <div class="bg-white rounded-card border border-border shadow-sm">
            <!-- Filters -->
            <div class="px-6 py-4 border-b border-border flex flex-wrap gap-3 items-center">
              <div class="flex items-center gap-2 bg-gray-50 rounded-input px-3 py-2 flex-1 min-w-[200px]">
                <svg class="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input v-model="apptSearch" placeholder="Поиск по пациенту или врачу..." class="bg-transparent outline-none text-sm flex-1" />
              </div>
              <select v-model="apptStatus" class="border border-border rounded-input px-3 py-2 text-sm text-textPrimary outline-none">
                <option value="">Все статусы</option>
                <option value="upcoming">Предстоящие</option>
                <option value="completed">Завершённые</option>
                <option value="cancelled">Отменённые</option>
              </select>
              <div class="text-xs text-textSecondary">Найдено: {{ filteredAppointments.length }}</div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead><tr class="border-b border-border bg-gray-50">
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Пациент</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Врач</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Клиника</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Дата / Время</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Сумма</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Статус</th>
                  <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Действия</th>
                </tr></thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="apt in filteredAppointments" :key="apt.id" class="hover:bg-gray-50 transition-colors">
                    <td class="py-3 px-4">
                      <div class="font-semibold text-textPrimary">{{ apt.patientName }}</div>
                      <div class="text-xs text-textSecondary">{{ apt.patientPhone }}</div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-textPrimary">{{ apt.doctorName.split(' ').slice(0, 2).join(' ') }}</div>
                      <div class="text-xs text-secondary">{{ apt.doctorSpecialty }}</div>
                    </td>
                    <td class="py-3 px-4 text-textSecondary text-xs">{{ apt.clinicName }}</td>
                    <td class="py-3 px-4">
                      <div class="text-textPrimary font-medium">{{ apt.date }}</div>
                      <div class="text-xs text-textSecondary">{{ apt.time }}</div>
                    </td>
                    <td class="py-3 px-4 font-bold text-textPrimary">{{ apt.price.toLocaleString('ru') }} ₽</td>
                    <td class="py-3 px-4">
                      <span :class="['text-xs font-bold px-2.5 py-1 rounded-full border', statusColor[apt.status]]">{{ statusLabel[apt.status] }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <select
                        :value="apt.status"
                        @change="admin.updateAppointmentStatus(apt.id, ($event.target as HTMLSelectElement).value as any)"
                        class="border border-border rounded-input px-2 py-1 text-xs text-textPrimary outline-none"
                      >
                        <option value="upcoming">Предстоящий</option>
                        <option value="completed">Завершён</option>
                        <option value="cancelled">Отменён</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ══ ВРАЧИ ══ -->
        <div v-else-if="activeTab === 'doctors'" class="animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input v-model="docSearch" placeholder="Поиск врача..." class="input-field pl-9 py-2 text-sm w-64" />
              </div>
              <span class="text-sm text-textSecondary">{{ filteredDoctors.length }} врачей</span>
            </div>
            <button @click="openDoctorModal()" class="btn-primary text-sm py-2.5 px-5">+ Добавить врача</button>
          </div>

          <div class="bg-white rounded-card border border-border shadow-sm overflow-hidden">
            <table class="w-full text-sm">
              <thead><tr class="border-b border-border bg-gray-50">
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Врач</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Специальность</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Клиника</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Опыт</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Рейтинг</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Цена</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Статус</th>
                <th class="text-left py-3 px-4 font-semibold text-textSecondary text-xs uppercase tracking-wide">Действия</th>
              </tr></thead>
              <tbody class="divide-y divide-border">
                <tr v-for="doc in filteredDoctors" :key="doc.id" class="hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <img :src="doc.photo" :alt="doc.name" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <span class="font-semibold text-textPrimary text-xs">{{ doc.name }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-secondary font-semibold text-xs">{{ doc.specialty }}</td>
                  <td class="py-3 px-4 text-textSecondary text-xs">{{ doc.clinicName }}</td>
                  <td class="py-3 px-4 text-textPrimary text-xs">{{ doc.experience }} лет</td>
                  <td class="py-3 px-4">
                    <span class="flex items-center gap-1 text-xs font-bold text-yellow-500">⭐ {{ doc.rating }}</span>
                  </td>
                  <td class="py-3 px-4 font-bold text-textPrimary text-xs">{{ doc.price.toLocaleString('ru') }} ₽</td>
                  <td class="py-3 px-4">
                    <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', doc.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500']">
                      {{ doc.isAvailable ? 'Активен' : 'Недоступен' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-1">
                      <button @click="openDoctorModal(doc)" class="p-1.5 rounded hover:bg-primary-50 text-textSecondary hover:text-primary transition-colors" title="Редактировать">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button @click="deleteDoctor(doc.id)" class="p-1.5 rounded hover:bg-red-50 text-textSecondary hover:text-error transition-colors" title="Удалить">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ══ КЛИНИКИ ══ -->
        <div v-else-if="activeTab === 'clinics'" class="animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-textSecondary">{{ admin.clinics.length }} клиник</span>
            <button @click="openClinicModal()" class="btn-primary text-sm py-2.5 px-5">+ Добавить клинику</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div v-for="clinic in admin.clinics" :key="clinic.id" class="bg-white rounded-card border border-border shadow-sm overflow-hidden">
              <div class="h-36 overflow-hidden bg-gray-100">
                <img v-if="clinic.photo" :src="clinic.photo" :alt="clinic.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-4xl">🏥</div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-textPrimary mb-1">{{ clinic.name }}</h3>
                <p class="text-xs text-textSecondary mb-1">📍 {{ clinic.address }}</p>
                <p class="text-xs text-textSecondary mb-3">📞 {{ clinic.phone }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-yellow-500">⭐ {{ clinic.rating }}</span>
                  <div class="flex gap-1">
                    <button @click="openClinicModal(clinic)" class="p-1.5 rounded hover:bg-primary-50 text-textSecondary hover:text-primary transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="admin.deleteClinic(clinic.id)" class="p-1.5 rounded hover:bg-red-50 text-textSecondary hover:text-error transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ АКЦИИ ══ -->
        <div v-else-if="activeTab === 'actions'" class="animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-textSecondary">{{ admin.actions.length }} акций</span>
            <button @click="openActionModal()" class="btn-primary text-sm py-2.5 px-5">+ Создать акцию</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div v-for="action in admin.actions" :key="action.id" class="bg-white rounded-card border border-border shadow-sm overflow-hidden">
              <div class="h-36 overflow-hidden bg-gray-100 relative">
                <img v-if="action.image" :src="action.image" :alt="action.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎁</div>
                <span class="absolute top-2 left-2 bg-error text-white text-xs font-black px-2 py-0.5 rounded-full">−{{ action.discountPercent }}%</span>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-textPrimary text-sm mb-1 line-clamp-2">{{ action.title }}</h3>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-textSecondary text-xs line-through">{{ action.originalPrice.toLocaleString('ru') }} ₽</span>
                  <span class="text-error font-black text-base">{{ action.discountPrice.toLocaleString('ru') }} ₽</span>
                </div>
                <p class="text-xs text-textSecondary mt-1">До: {{ action.validUntil }}</p>
                <div class="flex gap-1 mt-3">
                  <button @click="openActionModal(action)" class="flex-1 py-1.5 border border-primary text-primary text-xs font-semibold rounded-btn hover:bg-primary hover:text-white transition-colors">Редактировать</button>
                  <button @click="admin.deleteAction(action.id)" class="py-1.5 px-2.5 border border-border text-textSecondary text-xs rounded-btn hover:border-error hover:text-error transition-colors">🗑</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ НАСТРОЙКИ ══ -->
        <div v-else-if="activeTab === 'settings'" class="animate-fade-in max-w-3xl space-y-6">

          <div class="bg-white rounded-card border border-border shadow-sm p-6 space-y-4">
            <h3 class="font-bold text-textPrimary text-base border-b border-border pb-3">Основная информация</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Название сайта</label>
                <input v-model="editSettings.siteName" class="input-field text-sm" />
              </div>
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Слоган</label>
                <input v-model="editSettings.tagline" class="input-field text-sm" />
              </div>
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Телефон</label>
                <input v-model="editSettings.phone" class="input-field text-sm" />
              </div>
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Email</label>
                <input v-model="editSettings.email" class="input-field text-sm" />
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Адрес главного офиса</label>
                <input v-model="editSettings.address" class="input-field text-sm" />
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Часы работы</label>
                <input v-model="editSettings.workingHours" class="input-field text-sm" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-card border border-border shadow-sm p-6 space-y-4">
            <h3 class="font-bold text-textPrimary text-base border-b border-border pb-3">Главный слайдер (слайд 1)</h3>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Заголовок</label>
              <input v-model="editSettings.heroTitle1" class="input-field text-sm" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Подзаголовок</label>
              <input v-model="editSettings.heroSubtitle1" class="input-field text-sm" />
            </div>
          </div>

          <div class="bg-white rounded-card border border-border shadow-sm p-6 space-y-4">
            <h3 class="font-bold text-textPrimary text-base border-b border-border pb-3">Промо-баннер в шапке</h3>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="editSettings.bannerEnabled" class="w-4 h-4 accent-primary" />
              <span class="text-sm font-medium text-textPrimary">Показывать баннер</span>
            </label>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Текст баннера</label>
              <input v-model="editSettings.bannerText" class="input-field text-sm" />
            </div>
          </div>

          <div class="bg-white rounded-card border border-border shadow-sm p-6 space-y-4">
            <h3 class="font-bold text-textPrimary text-base border-b border-border pb-3">Цвета бренда</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-2">Основной цвет</label>
                <div class="flex items-center gap-3">
                  <input type="color" v-model="editSettings.primaryColor" class="w-12 h-10 rounded-input border border-border cursor-pointer" />
                  <input v-model="editSettings.primaryColor" class="input-field text-sm font-mono" />
                </div>
                <div class="h-8 rounded-input mt-2 transition-colors" :style="{ background: editSettings.primaryColor }" />
              </div>
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-2">Акцентный цвет</label>
                <div class="flex items-center gap-3">
                  <input type="color" v-model="editSettings.secondaryColor" class="w-12 h-10 rounded-input border border-border cursor-pointer" />
                  <input v-model="editSettings.secondaryColor" class="input-field text-sm font-mono" />
                </div>
                <div class="h-8 rounded-input mt-2 transition-colors" :style="{ background: editSettings.secondaryColor }" />
              </div>
            </div>
          </div>

          <button @click="saveSettings" class="btn-primary text-base py-3 px-8">
            💾 Сохранить все настройки
          </button>
        </div>

      </div>
    </main>
  </div>

  <!-- ══ МОДАЛ: ВРАЧ ══ -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="doctorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="doctorModal = false">
        <div class="bg-white rounded-modal shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 class="font-bold text-lg">{{ editingDoctor.id ? 'Редактировать врача' : 'Добавить врача' }}</h3>
            <button @click="doctorModal = false" class="p-2 hover:bg-gray-100 rounded-lg text-textSecondary">✕</button>
          </div>
          <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">ФИО *</label>
              <input v-model="editingDoctor.name" class="input-field text-sm" placeholder="Иванова Елена Сергеевна" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Специальность *</label>
              <input v-model="editingDoctor.specialty" class="input-field text-sm" placeholder="Кардиолог" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Опыт (лет)</label>
              <input v-model.number="editingDoctor.experience" type="number" class="input-field text-sm" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Цена приёма (₽)</label>
              <input v-model.number="editingDoctor.price" type="number" class="input-field text-sm" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Рейтинг (1–5)</label>
              <input v-model.number="editingDoctor.rating" type="number" min="1" max="5" step="0.1" class="input-field text-sm" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Клиника</label>
              <input v-model="editingDoctor.clinicName" class="input-field text-sm" placeholder="МедЦентр на Ленина" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Фото (URL)</label>
              <input v-model="editingDoctor.photo" class="input-field text-sm" placeholder="https://..." />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">О враче</label>
              <textarea v-model="editingDoctor.bio" rows="3" class="input-field text-sm resize-none" placeholder="Краткое описание..." />
            </div>
            <div class="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" v-model="editingDoctor.isAvailable" id="doc-avail" class="w-4 h-4 accent-primary" />
              <label for="doc-avail" class="text-sm font-medium text-textPrimary cursor-pointer">Доступен для записи</label>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-border flex gap-3 justify-end">
            <button @click="doctorModal = false" class="btn-outline text-sm py-2.5 px-6">Отмена</button>
            <button @click="saveDoctor" class="btn-primary text-sm py-2.5 px-6">Сохранить</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ МОДАЛ: КЛИНИКА ══ -->
    <Transition name="modal">
      <div v-if="clinicModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="clinicModal = false">
        <div class="bg-white rounded-modal shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 class="font-bold text-lg">{{ editingClinic.id ? 'Редактировать клинику' : 'Добавить клинику' }}</h3>
            <button @click="clinicModal = false" class="p-2 hover:bg-gray-100 rounded-lg text-textSecondary">✕</button>
          </div>
          <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Название *</label>
              <input v-model="editingClinic.name" class="input-field text-sm" placeholder="МедЦентр на Ленина" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Адрес *</label>
              <input v-model="editingClinic.address" class="input-field text-sm" placeholder="ул. Ленина, 1, Томск" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Телефон</label>
              <input v-model="editingClinic.phone" class="input-field text-sm" placeholder="+7 (3822) 00-00-00" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Email</label>
              <input v-model="editingClinic.email" class="input-field text-sm" placeholder="clinic@medclinic.ru" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Район / Метро</label>
              <input v-model="editingClinic.metro" class="input-field text-sm" placeholder="Ленинский район" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Рейтинг</label>
              <input v-model.number="editingClinic.rating" type="number" min="1" max="5" step="0.1" class="input-field text-sm" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Фото (URL)</label>
              <input v-model="editingClinic.photo" class="input-field text-sm" placeholder="https://..." />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-border flex gap-3 justify-end">
            <button @click="clinicModal = false" class="btn-outline text-sm py-2.5 px-6">Отмена</button>
            <button @click="saveClinic" class="btn-primary text-sm py-2.5 px-6">Сохранить</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ МОДАЛ: АКЦИЯ ══ -->
    <Transition name="modal">
      <div v-if="actionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="actionModal = false">
        <div class="bg-white rounded-modal shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 class="font-bold text-lg">{{ editingAction.id ? 'Редактировать акцию' : 'Создать акцию' }}</h3>
            <button @click="actionModal = false" class="p-2 hover:bg-gray-100 rounded-lg text-textSecondary">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Название акции *</label>
              <input v-model="editingAction.title" class="input-field text-sm" placeholder="Комплексное обследование" />
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Описание</label>
              <textarea v-model="editingAction.description" rows="3" class="input-field text-sm resize-none" placeholder="Что входит в акцию..." />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Цена без скидки (₽)</label>
                <input v-model.number="editingAction.originalPrice" type="number" class="input-field text-sm" />
              </div>
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Цена со скидкой (₽)</label>
                <input v-model.number="editingAction.discountPrice" type="number" class="input-field text-sm" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Категория</label>
                <input v-model="editingAction.categoryName" class="input-field text-sm" placeholder="Кардиология" />
              </div>
              <div>
                <label class="text-xs font-semibold text-textSecondary block mb-1.5">Действует до</label>
                <input v-model="editingAction.validUntil" type="date" class="input-field text-sm" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-textSecondary block mb-1.5">Изображение (URL)</label>
              <input v-model="editingAction.image" class="input-field text-sm" placeholder="https://..." />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-border flex gap-3 justify-end">
            <button @click="actionModal = false" class="btn-outline text-sm py-2.5 px-6">Отмена</button>
            <button @click="saveAction" class="btn-primary text-sm py-2.5 px-6">Сохранить</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
