<script setup lang="ts">
import { mockActions } from '../../mocks/index'
import AppBadge from '../ui/AppBadge.vue'
import AppButton from '../ui/AppButton.vue'
import { formatShortDate } from '../../utils/index'

const actions = mockActions.slice(0, 4)
</script>

<template>
  <section class="py-16 md:py-20 bg-background">
    <div class="container-custom">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 class="section-title">Акции и спецпредложения</h2>
          <p class="section-subtitle mt-2">Выгодные программы обследования со скидками до 50%</p>
        </div>
        <AppButton variant="outline" size="sm">
          <RouterLink to="/actions">Все акции</RouterLink>
        </AppButton>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <RouterLink
          v-for="action in actions"
          :key="action.id"
          :to="`/actions/${action.id}`"
          class="card overflow-hidden group block"
        >
          <!-- Image -->
          <div class="relative h-44 overflow-hidden">
            <img
              :src="action.image"
              :alt="action.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="bg-error text-white text-xs font-bold px-2.5 py-1 rounded-full">
                −{{ action.discountPercent }}%
              </span>
            </div>
            <div class="absolute bottom-3 left-3">
              <AppBadge variant="neutral">{{ action.categoryName }}</AppBadge>
            </div>
          </div>
          <!-- Body -->
          <div class="p-4">
            <h3 class="font-bold text-textPrimary text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {{ action.title }}
            </h3>
            <p class="text-textSecondary text-xs leading-relaxed line-clamp-2 mb-3">
              {{ action.description }}
            </p>
            <!-- Price -->
            <div class="flex items-center justify-between">
              <div>
                <span class="text-textSecondary text-xs line-through">{{ action.originalPrice.toLocaleString('ru') }} ₽</span>
                <div class="font-bold text-error text-lg leading-none">{{ action.discountPrice.toLocaleString('ru') }} ₽</div>
              </div>
              <div class="text-xs text-textSecondary text-right">
                до {{ formatShortDate(action.validUntil) }}
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
