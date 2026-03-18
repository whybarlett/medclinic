<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/useUserStore'
import AppModal from '../ui/AppModal.vue'
import AppButton from '../ui/AppButton.vue'
import { maskPhone } from '../../utils/index'

const userStore = useUserStore()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const phone = ref('')
const password = ref('')
const name = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

function onPhoneInput(e: Event) {
  phone.value = maskPhone((e.target as HTMLInputElement).value)
}

async function submit() {
  error.value = ''
  if (!phone.value || phone.value.length < 10) {
    error.value = 'Введите корректный номер телефона'
    return
  }
  if (!password.value || password.value.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }
  if (mode.value === 'register') {
    if (!name.value.trim()) { error.value = 'Введите ваше имя'; return }
    if (password.value !== confirmPassword.value) { error.value = 'Пароли не совпадают'; return }
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 800))

  if (mode.value === 'login') {
    userStore.login(phone.value, password.value)
  } else {
    userStore.register(name.value, phone.value, password.value)
  }
  loading.value = false
  router.push('/cabinet')
}

function switchMode(m: 'login' | 'register') {
  mode.value = m
  error.value = ''
  password.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <AppModal :open="userStore.isLoginModalOpen" @close="userStore.closeLoginModal" size="sm" :show-close="false">
    <template #header>
      <div class="w-full">
        <!-- Заголовок + крестик на одной строке -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-textPrimary">
            {{ mode === 'login' ? 'Вход в кабинет' : 'Регистрация' }}
          </h2>
          <button @click="userStore.closeLoginModal" class="p-2 rounded-lg hover:bg-gray-100 text-textSecondary transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <!-- Табы на всю ширину -->
        <div class="flex w-full bg-gray-100 rounded-input p-1">
          <button
            @click="switchMode('login')"
            :class="['flex-1 py-2 text-sm font-semibold rounded-btn transition-all', mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-textSecondary hover:text-textPrimary']"
          >Войти</button>
          <button
            @click="switchMode('register')"
            :class="['flex-1 py-2 text-sm font-semibold rounded-btn transition-all', mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-textSecondary hover:text-textPrimary']"
          >Зарегистрироваться</button>
        </div>
      </div>
    </template>

    <div class="p-6 space-y-4">
      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-input p-3 text-sm text-red-600 flex items-center gap-2">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ error }}
      </div>

      <!-- Name (register only) -->
      <div v-if="mode === 'register'">
        <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Ваше имя *</label>
        <input v-model="name" placeholder="Иван Иванов" class="input-field" />
      </div>

      <!-- Phone -->
      <div>
        <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Телефон *</label>
        <input
          :value="phone"
          @input="onPhoneInput"
          placeholder="+7 (___) ___-__-__"
          type="tel"
          class="input-field"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Пароль *</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Минимум 6 символов"
            class="input-field pr-10"
            @keydown.enter="submit"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-primary transition-colors"
          >
            <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
          </button>
        </div>
      </div>

      <!-- Confirm password (register only) -->
      <div v-if="mode === 'register'">
        <label class="text-sm font-semibold text-textPrimary mb-1.5 block">Повторите пароль *</label>
        <input v-model="confirmPassword" type="password" placeholder="Повторите пароль" class="input-field" @keydown.enter="submit" />
      </div>

      <!-- Forgot password (login only) -->
      <div v-if="mode === 'login'" class="text-right">
        <button class="text-sm text-primary hover:underline font-medium">Забыли пароль?</button>
      </div>

      <!-- Agreement (register only) -->
      <label v-if="mode === 'register'" class="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" class="mt-0.5 accent-primary" checked />
        <span class="text-xs text-textSecondary leading-relaxed">
          Согласен(а) с <span class="text-primary">условиями использования</span> и <span class="text-primary">политикой конфиденциальности</span>
        </span>
      </label>

      <AppButton @click="submit" :loading="loading" full-width size="lg">
        {{ mode === 'login' ? 'Войти' : 'Создать аккаунт' }}
      </AppButton>

      <!-- Demo hint -->
      <div class="bg-primary-50 rounded-input p-3 text-center">
        <p class="text-xs text-primary font-medium">
          💡 Для демо: введите любой телефон и пароль (6+ символов)
        </p>
      </div>

      <!-- Social login -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border" /></div>
        <div class="relative flex justify-center"><span class="bg-white px-3 text-xs text-textSecondary">или войдите через</span></div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button class="flex items-center justify-center gap-2 py-2.5 border border-border rounded-btn hover:bg-gray-50 transition-colors text-sm font-semibold text-textPrimary">
          <span class="text-lg">ВК</span> ВКонтакте
        </button>
        <button class="flex items-center justify-center gap-2 py-2.5 border border-border rounded-btn hover:bg-gray-50 transition-colors text-sm font-semibold text-textPrimary">
          <span class="text-lg">📱</span> Госуслуги
        </button>
      </div>
    </div>
  </AppModal>
</template>
