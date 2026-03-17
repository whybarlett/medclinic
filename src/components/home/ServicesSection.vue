<script setup lang="ts">
import { useScrollReveal } from '../../composables/useAnimations'
import { mockServiceCategories } from '../../mocks/index'
import AppButton from '../ui/AppButton.vue'

const { el, isVisible } = useScrollReveal()
</script>

<template>
  <section class="py-16 md:py-20 bg-background" ref="el">
    <div class="container-custom">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 class="section-title">Наши услуги</h2>
          <p class="section-subtitle mt-2">Полный спектр медицинской помощи в одном месте</p>
        </div>
        <AppButton variant="outline" size="sm">
          <RouterLink to="/services">Все услуги</RouterLink>
        </AppButton>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <RouterLink
          v-for="(cat, i) in mockServiceCategories"
          :key="cat.id"
          :to="`/services?cat=${cat.slug}`"
          :class="[
            'group flex flex-col items-center text-center p-4 md:p-5 bg-white rounded-card border border-border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/20',
            isVisible ? 'animate-slide-up opacity-100' : 'opacity-0',
          ]"
          :style="{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110"
            :style="{ backgroundColor: cat.color + '18' }"
          >
            {{ cat.icon }}
          </div>
          <span class="font-semibold text-textPrimary text-sm group-hover:text-primary transition-colors leading-tight">
            {{ cat.name }}
          </span>
          <span class="text-xs text-textSecondary mt-1">{{ cat.servicesCount }} услуг</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
