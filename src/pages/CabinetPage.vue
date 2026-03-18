<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import AppButton from '../components/ui/AppButton.vue'
import AppRating from '../components/ui/AppRating.vue'
import { formatDate } from '../utils/index'

const router = useRouter()
const userStore = useUserStore()
const appointmentStore = useAppointmentStore()

const activeTab = ref('appointments')
const isEditingProfile = ref(false)
const editProfile = ref({ ...userStore.profile })
const cancelConfirmId = ref<number | null>(null)

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/')
    userStore.openLoginModal()
  }
})

const tabs = [
  { key: 'appointments', label: 'Мои записи', icon: '📅' },
  { key: 'results', label: 'Результаты', icon: '📋' },
  { key: 'notifications', label: 'Уведомления', icon: '🔔' },
  { key: 'profile', label: 'Профиль', icon: '👤' },
]

const statusLabel: Record<string, string> = {
  upcoming: 'Предстоящий',
  completed: 'Завершён',
  cancelled: 'Отменён',
}
const statusColor: Record<string, string> = {
  upcoming: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

const typeIcon: Record<string, string> = {
  analysis: '🧪',
  mri: '🧲',
  ultrasound: '📡',
  conclusion: '📄',
}
const typeLabel: Record<string, string> = {
  analysis: 'Анализ',
  mri: 'МРТ',
  ultrasound: 'УЗИ',
  conclusion: 'Заключение',
}

const notifIcon: Record<string, string> = {
  appointment: '📅',
  result: '📋',
  promo: '🎁',
  system: '⚙️',
}

function saveProfile() {
  Object.assign(userStore.profile, editProfile.value)
  isEditingProfile.value = false
}

function confirmCancel(id: number) {
  cancelConfirmId.value = id
}

function doCancel(id: number) {
  userStore.cancelAppointment(id)
  cancelConfirmId.value = null
}
</script>

<template>
  <main v-if="userStore.isAuthenticated" class="min-h-screen bg-background">
    <!-- Page header -->
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {{ userStore.profile.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-xl font-bold text-textPrimary">{{ userStore.profile.name }}</h1>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-textSecondary text-sm">{{ userStore.profile.phone }}</span>
                <span class="flex items-center gap-1 text-xs font-semibold text-warning bg-yellow-50 px-2.5 py-1 rounded-full">
                  ⭐ {{ userStore.profile.bonusPoints }} бонусов
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <AppButton variant="outline" size="sm" @click="appointmentStore.openModal()">
              + Записаться
            </AppButton>
            <button @click="userStore.logout(); router.push('/')" class="text-sm text-textSecondary hover:text-error transition-colors flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Выйти
            </button>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div class="bg-primary-50 rounded-card p-3 text-center">
            <div class="text-2xl font-black text-primary">{{ userStore.upcomingAppointments.length }}</div>
            <div class="text-xs text-textSecondary mt-0.5">предстоящих записей</div>
          </div>
          <div class="bg-green-50 rounded-card p-3 text-center">
            <div class="text-2xl font-black text-success">{{ userStore.results.length }}</div>
            <div class="text-xs text-textSecondary mt-0.5">результатов</div>
          </div>
          <div class="bg-orange-50 rounded-card p-3 text-center">
            <div class="text-2xl font-black text-orange-500">{{ userStore.newResults }}</div>
            <div class="text-xs text-textSecondary mt-0.5">новых результата</div>
          </div>
          <div class="bg-yellow-50 rounded-card p-3 text-center">
            <div class="text-2xl font-black text-yellow-500">{{ userStore.unreadNotifications }}</div>
            <div class="text-xs text-textSecondary mt-0.5">новых уведомления</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar tabs -->
        <div class="lg:col-span-1">
          <div class="card p-2 sticky top-24">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key; if(tab.key === 'notifications') userStore.markAllRead()"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-semibold transition-all text-left relative',
                activeTab === tab.key ? 'bg-primary text-white' : 'text-textPrimary hover:bg-gray-50'
              ]"
            >
              <span class="text-base">{{ tab.icon }}</span>
              {{ tab.label }}
              <!-- Badge -->
              <span
                v-if="tab.key === 'notifications' && userStore.unreadNotifications > 0"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center"
              >{{ userStore.unreadNotifications }}</span>
              <span
                v-if="tab.key === 'results' && userStore.newResults > 0"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center"
              >{{ userStore.newResults }}</span>
            </button>
          </div>
        </div>

        <!-- Main content -->
        <div class="lg:col-span-3">

          <!-- ── ЗАПИСИ ── -->
          <div v-if="activeTab === 'appointments'" class="space-y-4 animate-fade-in">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-bold text-textPrimary">Мои записи</h2>
              <AppButton size="sm" @click="appointmentStore.openModal()">+ Новая запись</AppButton>
            </div>

            <!-- Filter pills -->
            <div class="flex gap-2 flex-wrap">
              <span v-for="s in ['all','upcoming','completed','cancelled']" :key="s" class="px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors bg-white border-border text-textSecondary hover:border-primary/40">
                {{ s === 'all' ? 'Все' : statusLabel[s] }}
              </span>
            </div>

            <div
              v-for="apt in userStore.appointments"
              :key="apt.id"
              class="card p-5"
            >
              <div class="flex items-start gap-4">
                <img :src="apt.doctorPhoto" :alt="apt.doctorName" class="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 class="font-bold text-textPrimary text-sm">{{ apt.doctorName }}</h3>
                      <p class="text-xs text-secondary font-semibold mt-0.5">{{ apt.doctorSpecialty }}</p>
                      <p class="text-xs text-textSecondary mt-0.5">{{ apt.clinicName }}</p>
                    </div>
                    <span :class="['text-xs font-bold px-2.5 py-1 rounded-full', statusColor[apt.status]]">
                      {{ statusLabel[apt.status] }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4 mt-3">
                    <div class="flex items-center gap-1.5 text-sm text-textPrimary font-semibold">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      {{ formatDate(apt.date, { day: 'numeric', month: 'long' }) }}, {{ apt.time }}
                    </div>
                    <div class="text-sm font-bold text-textPrimary">{{ apt.price.toLocaleString('ru') }} ₽</div>
                  </div>
                  <p v-if="apt.comment" class="text-xs text-textSecondary mt-2 bg-gray-50 rounded-input px-3 py-2">
                    💬 {{ apt.comment }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="apt.status === 'upcoming'" class="flex gap-2 mt-4 pt-4 border-t border-border">
                <button class="flex-1 py-2 text-xs font-semibold border border-border rounded-btn text-textPrimary hover:border-primary hover:text-primary transition-colors">
                  Перенести
                </button>
                <button
                  @click="confirmCancel(apt.id)"
                  class="flex-1 py-2 text-xs font-semibold border border-border rounded-btn text-textSecondary hover:border-error hover:text-error transition-colors"
                >Отменить</button>
              </div>

              <!-- Cancel confirm -->
              <div v-if="cancelConfirmId === apt.id" class="mt-3 bg-red-50 border border-red-200 rounded-card p-4">
                <p class="text-sm font-semibold text-red-700 mb-3">Вы уверены что хотите отменить запись?</p>
                <div class="flex gap-2">
                  <button @click="doCancel(apt.id)" class="flex-1 py-2 text-xs font-bold bg-error text-white rounded-btn hover:bg-red-600">Да, отменить</button>
                  <button @click="cancelConfirmId = null" class="flex-1 py-2 text-xs font-semibold border border-border rounded-btn hover:bg-gray-50">Нет, оставить</button>
                </div>
              </div>

              <div v-if="apt.status === 'completed'" class="flex gap-2 mt-4 pt-4 border-t border-border">
                <button class="flex-1 py-2 text-xs font-semibold border border-primary text-primary rounded-btn hover:bg-primary hover:text-white transition-colors">
                  Записаться повторно
                </button>
                <button class="flex-1 py-2 text-xs font-semibold border border-border rounded-btn text-textSecondary hover:border-primary hover:text-primary transition-colors">
                  Оставить отзыв
                </button>
              </div>
            </div>
          </div>

          <!-- ── РЕЗУЛЬТАТЫ ── -->
          <div v-else-if="activeTab === 'results'" class="animate-fade-in">
            <h2 class="text-lg font-bold text-textPrimary mb-4">Результаты и документы</h2>

            <!-- New results banner -->
            <div v-if="userStore.newResults > 0" class="bg-primary-50 border border-primary/20 rounded-card p-4 mb-5 flex items-center gap-3">
              <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">🔔</div>
              <div>
                <p class="font-bold text-primary text-sm">{{ userStore.newResults }} новых результата</p>
                <p class="text-xs text-textSecondary mt-0.5">Доступны для просмотра и скачивания</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="result in userStore.results"
                :key="result.id"
                class="card p-4 flex items-center gap-4"
              >
                <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {{ typeIcon[result.type] }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-textPrimary text-sm truncate">{{ result.title }}</h3>
                    <span v-if="result.isNew" class="text-xs font-bold text-white bg-secondary px-2 py-0.5 rounded-full flex-shrink-0">Новый</span>
                  </div>
                  <p class="text-xs text-textSecondary mt-0.5">
                    {{ typeLabel[result.type] }} · {{ formatDate(result.date, { day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </p>
                  <p class="text-xs text-textSecondary">{{ result.doctorName }} · {{ result.clinicName }}</p>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <button class="flex items-center gap-1.5 px-3 py-2 border border-primary text-primary text-xs font-semibold rounded-btn hover:bg-primary hover:text-white transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    Смотреть
                  </button>
                  <button class="flex items-center gap-1.5 px-3 py-2 border border-border text-textSecondary text-xs font-semibold rounded-btn hover:border-primary hover:text-primary transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── УВЕДОМЛЕНИЯ ── -->
          <div v-else-if="activeTab === 'notifications'" class="animate-fade-in">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-textPrimary">Уведомления</h2>
              <button @click="userStore.markAllRead()" class="text-xs text-primary hover:underline font-semibold">
                Отметить все как прочитанные
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="notif in userStore.notifications"
                :key="notif.id"
                @click="userStore.markNotificationRead(notif.id)"
                :class="['card p-4 flex items-start gap-4 cursor-pointer transition-all', !notif.isRead ? 'border-l-4 border-l-primary' : 'opacity-70']"
              >
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', !notif.isRead ? 'bg-primary-50' : 'bg-gray-100']">
                  {{ notifIcon[notif.type] }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-textPrimary leading-relaxed" :class="!notif.isRead ? 'font-semibold' : ''">
                    {{ notif.text }}
                  </p>
                  <p class="text-xs text-textSecondary mt-1">
                    {{ formatDate(notif.date, { day: 'numeric', month: 'long' }) }}
                  </p>
                </div>
                <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              </div>
            </div>

            <div v-if="userStore.notifications.length === 0" class="text-center py-16 text-textSecondary">
              <div class="text-5xl mb-3">🔔</div>
              <p class="font-semibold">Уведомлений нет</p>
            </div>
          </div>

          <!-- ── ПРОФИЛЬ ── -->
          <div v-else-if="activeTab === 'profile'" class="animate-fade-in">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-textPrimary">Личные данные</h2>
              <AppButton v-if="!isEditingProfile" variant="outline" size="sm" @click="isEditingProfile = true; editProfile = { ...userStore.profile }">
                ✏️ Редактировать
              </AppButton>
              <div v-else class="flex gap-2">
                <AppButton size="sm" @click="saveProfile">Сохранить</AppButton>
                <AppButton variant="outline" size="sm" @click="isEditingProfile = false">Отмена</AppButton>
              </div>
            </div>

            <div class="card p-6 space-y-5">
              <!-- Avatar -->
              <div class="flex items-center gap-4 pb-5 border-b border-border">
                <div class="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-3xl">
                  {{ userStore.profile.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-bold text-textPrimary">{{ userStore.profile.name }}</p>
                  <p class="text-sm text-textSecondary">Пациент МедЦентра</p>
                  <div class="flex items-center gap-1.5 mt-2">
                    <span class="text-warning">⭐</span>
                    <span class="text-sm font-bold text-textPrimary">{{ userStore.profile.bonusPoints }}</span>
                    <span class="text-xs text-textSecondary">бонусных баллов</span>
                  </div>
                </div>
              </div>

              <!-- Fields -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-semibold text-textSecondary block mb-1.5">Полное имя</label>
                  <input v-if="isEditingProfile" v-model="editProfile.name" class="input-field text-sm" />
                  <p v-else class="text-textPrimary font-semibold text-sm py-2">{{ userStore.profile.name }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-textSecondary block mb-1.5">Телефон</label>
                  <input v-if="isEditingProfile" v-model="editProfile.phone" class="input-field text-sm" />
                  <p v-else class="text-textPrimary font-semibold text-sm py-2">{{ userStore.profile.phone }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-textSecondary block mb-1.5">Email</label>
                  <input v-if="isEditingProfile" v-model="editProfile.email" type="email" class="input-field text-sm" />
                  <p v-else class="text-textPrimary font-semibold text-sm py-2">{{ userStore.profile.email }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-textSecondary block mb-1.5">Дата рождения</label>
                  <input v-if="isEditingProfile" v-model="editProfile.birthDate" type="date" class="input-field text-sm" />
                  <p v-else class="text-textPrimary font-semibold text-sm py-2">
                    {{ formatDate(userStore.profile.birthDate) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Security -->
            <div class="card p-6 mt-4">
              <h3 class="font-bold text-textPrimary mb-4">Безопасность</h3>
              <div class="space-y-3">
                <button class="w-full flex items-center justify-between p-3 rounded-input hover:bg-gray-50 transition-colors text-left">
                  <div class="flex items-center gap-3">
                    <span class="text-xl">🔒</span>
                    <div>
                      <p class="text-sm font-semibold text-textPrimary">Изменить пароль</p>
                      <p class="text-xs text-textSecondary">Последнее изменение: никогда</p>
                    </div>
                  </div>
                  <svg class="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button class="w-full flex items-center justify-between p-3 rounded-input hover:bg-gray-50 transition-colors text-left">
                  <div class="flex items-center gap-3">
                    <span class="text-xl">📱</span>
                    <div>
                      <p class="text-sm font-semibold text-textPrimary">Двухфакторная аутентификация</p>
                      <p class="text-xs text-textSecondary">Не подключена</p>
                    </div>
                  </div>
                  <svg class="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <!-- Bonuses -->
            <div class="card p-6 mt-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-textPrimary">Бонусная программа</h3>
                <span class="text-2xl font-black text-yellow-500">⭐ {{ userStore.profile.bonusPoints }}</span>
              </div>
              <p class="text-sm text-textSecondary mb-4">За каждый приём вы получаете бонусные баллы. 1 балл = 1 рубль скидки.</p>
              <div class="bg-white/80 rounded-card p-3">
                <div class="flex justify-between text-xs text-textSecondary mb-1.5">
                  <span>Серебряный</span>
                  <span>Золотой (2000 баллов)</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" :style="`width: ${(userStore.profile.bonusPoints / 2000) * 100}%`" />
                </div>
                <p class="text-xs text-textSecondary mt-1.5">Ещё {{ 2000 - userStore.profile.bonusPoints }} баллов до Золотого статуса</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>
