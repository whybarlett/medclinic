<script setup lang="ts">
import { mockArticles } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import { formatDate } from '../utils/index'
const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Статьи' }]
</script>
<template>
  <main class="min-h-screen bg-background">
    <div class="bg-white border-b border-border">
      <div class="container-custom py-6">
        <AppBreadcrumbs :items="breadcrumbs" class="mb-3" />
        <h1 class="text-2xl md:text-3xl font-bold text-textPrimary">Статьи о здоровье</h1>
        <p class="text-textSecondary text-sm mt-1">Полезные материалы от врачей МедЦентра</p>
      </div>
    </div>
    <div class="container-custom py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink v-for="a in mockArticles" :key="a.id" :to="`/articles/${a.slug}`" class="card overflow-hidden group block">
        <div class="h-48 overflow-hidden"><img :src="a.image" :alt="a.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div class="p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-semibold text-secondary bg-sky-50 px-2.5 py-1 rounded-full">{{ a.category }}</span>
            <span class="text-xs text-textSecondary">{{ a.readTime }} мин</span>
          </div>
          <h3 class="font-bold text-textPrimary mb-2 line-clamp-2 group-hover:text-primary transition-colors">{{ a.title }}</h3>
          <p class="text-textSecondary text-sm line-clamp-2 mb-4">{{ a.excerpt }}</p>
          <div class="flex justify-between text-xs text-textSecondary border-t border-border pt-3">
            <span>{{ a.author }}</span>
            <span>{{ formatDate(a.publishedAt, { day: 'numeric', month: 'long' }) }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </main>
</template>
