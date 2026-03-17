<script setup lang="ts">
import { mockClinics } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Контакты' }]
</script>
<template>
  <main class="min-h-screen bg-background">
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <AppBreadcrumbs :items="breadcrumbs" class="mb-3" />
        <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">Контакты</h1>
      </div>
    </div>
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="c in mockClinics" :key="c.id" class="card p-6">
          <h3 class="font-bold text-textPrimary mb-3">{{ c.name }}</h3>
          <div class="space-y-2 text-sm text-textSecondary">
            <p>📍 {{ c.address }}</p>
            <p>🚇 м. {{ c.metro }}</p>
            <a :href="`tel:${c.phone}`" class="text-primary font-semibold block">📞 {{ c.phone }}</a>
            <a :href="`mailto:${c.email}`" class="text-primary block">✉️ {{ c.email }}</a>
            <div v-for="(h, d) in c.workingHours" :key="d" class="flex justify-between"><span>{{ d }}</span><span class="font-medium text-textPrimary">{{ h }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
