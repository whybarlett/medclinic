<script setup lang="ts">
import AppButton from '../components/ui/AppButton.vue'
import { useAppointmentStore } from '../stores/useAppointmentStore'
const store = useAppointmentStore()
</script>
<template>
  <main class="min-h-screen bg-background">
    <div class="bg-gradient-to-br from-primary to-[#00256E] text-white py-20">
      <div class="container-custom text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 text-white">О компании МедЦентр</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">Более 15 лет мы помогаем людям быть здоровыми. Сеть современных медицинских клиник по всей России.</p>
      </div>
    </div>
    <div class="container-custom py-16 space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-2xl font-bold text-textPrimary mb-4">Наша миссия</h2>
          <p class="text-textSecondary leading-relaxed mb-4">МедЦентр — это сеть современных медицинских клиник, объединённых одной целью: сделать качественную медицину доступной для каждого человека.</p>
          <p class="text-textSecondary leading-relaxed">Мы строим систему, в которой пациент чувствует себя в центре внимания, где лечение основано на доказательной медицине, а сервис — на уважении и заботе.</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="item in [['60+','Клиник'],['1500+','Врачей'],['1 млн+','Пациентов'],['15+','Лет опыта']]" :key="item[0]" class="card p-6 text-center">
            <div class="text-3xl font-black text-primary mb-1">{{ item[0] }}</div>
            <div class="text-sm text-textSecondary">{{ item[1] }}</div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <AppButton size="lg" @click="store.openModal()">Записаться на приём</AppButton>
      </div>
    </div>
  </main>
</template>
