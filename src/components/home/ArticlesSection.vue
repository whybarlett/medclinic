<script setup lang="ts">
import { mockArticles } from '../../mocks/index'
import AppButton from '../ui/AppButton.vue'
import { formatDate } from '../../utils/index'
</script>

<template>
  <section class="py-16 md:py-20 bg-background">
    <div class="container-custom">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 class="section-title">Статьи о здоровье</h2>
          <p class="section-subtitle mt-2">Полезные материалы от наших врачей</p>
        </div>
        <AppButton variant="outline" size="sm">
          <RouterLink to="/articles">Все статьи</RouterLink>
        </AppButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RouterLink
          v-for="article in mockArticles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="card overflow-hidden group block"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="article.image"
              :alt="article.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold text-secondary bg-sky-50 px-2.5 py-1 rounded-full">{{ article.category }}</span>
              <span class="text-xs text-textSecondary">{{ article.readTime }} мин</span>
            </div>
            <h3 class="font-bold text-textPrimary mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-textSecondary text-sm leading-relaxed line-clamp-2 mb-4">
              {{ article.excerpt }}
            </p>
            <div class="flex items-center justify-between text-xs text-textSecondary border-t border-border pt-3">
              <span>{{ article.author }}</span>
              <span>{{ formatDate(article.publishedAt, { day: 'numeric', month: 'long' }) }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
