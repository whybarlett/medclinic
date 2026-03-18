<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockArticles, mockReviews } from '../mocks/index'
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs.vue'
import { formatDate } from '../utils/index'

const route = useRoute()
const article = computed(() => mockArticles.find(a => a.slug === route.params.slug))
const related = computed(() => mockArticles.filter(a => a.slug !== route.params.slug).slice(0, 2))

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Статьи', to: '/articles' },
  { label: article.value?.title || '' },
])
</script>

<template>
  <main class="min-h-screen bg-background">
    <div v-if="!article" class="container-custom py-24 text-center">
      <h1 class="text-2xl font-bold mb-4">Статья не найдена</h1>
      <RouterLink to="/articles" class="btn-primary inline-flex">← Все статьи</RouterLink>
    </div>
    <template v-else>
      <div class="bg-white border-b border-border">
        <div class="container-custom py-4"><AppBreadcrumbs :items="breadcrumbs" /></div>
      </div>
      <div class="container-custom py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Article body -->
          <article class="lg:col-span-2">
            <div class="card overflow-hidden">
              <div class="h-64 md:h-80 overflow-hidden">
                <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
              </div>
              <div class="p-6 md:p-8">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-xs font-semibold text-secondary bg-sky-50 px-3 py-1.5 rounded-full">{{ article.category }}</span>
                  <span class="text-xs text-textSecondary">{{ article.readTime }} мин. чтения</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-bold text-textPrimary mb-4 leading-tight">{{ article.title }}</h1>
                <div class="flex items-center gap-3 pb-5 mb-6 border-b border-border">
                  <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{{ article.author.charAt(0) }}</div>
                  <div>
                    <p class="text-sm font-semibold text-textPrimary">{{ article.author }}</p>
                    <p class="text-xs text-textSecondary">{{ formatDate(article.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
                  </div>
                </div>
                <div class="prose text-textSecondary leading-relaxed space-y-4">
                  <p class="text-base">{{ article.excerpt }}</p>
                  <p>Медицина постоянно развивается, и наши специалисты следят за последними исследованиями, чтобы предоставить вам самую актуальную информацию. Данная статья подготовлена на основе рекомендаций ведущих медицинских организаций и клинического опыта наших врачей.</p>
                  <h2 class="text-xl font-bold text-textPrimary mt-6">Основные принципы</h2>
                  <p>Важно понимать, что каждый организм индивидуален. Перед началом любого лечения или профилактических мер необходимо проконсультироваться с врачом. Наши специалисты всегда готовы помочь вам разобраться в тонкостях вашего здоровья.</p>
                  <h2 class="text-xl font-bold text-textPrimary mt-6">Когда обратиться к врачу</h2>
                  <p>Не откладывайте визит к специалисту, если вас беспокоят симптомы. Ранняя диагностика и своевременное лечение — залог успешного выздоровления. В клиниках МедЦентра вы можете записаться к нужному специалисту онлайн в удобное время.</p>
                </div>
              </div>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="space-y-5">
            <div class="card p-5">
              <h3 class="font-bold text-textPrimary mb-4">Похожие статьи</h3>
              <div class="space-y-4">
                <RouterLink v-for="a in related" :key="a.id" :to="`/articles/${a.slug}`" class="flex gap-3 group">
                  <img :src="a.image" :alt="a.title" class="w-16 h-16 rounded-card object-cover flex-shrink-0" />
                  <div>
                    <p class="text-sm font-semibold text-textPrimary group-hover:text-primary transition-colors line-clamp-2 leading-snug">{{ a.title }}</p>
                    <p class="text-xs text-textSecondary mt-1">{{ a.readTime }} мин</p>
                  </div>
                </RouterLink>
              </div>
            </div>
            <div class="card p-5 bg-primary-50 border-primary/20">
              <h3 class="font-bold text-primary mb-2">Консультация врача</h3>
              <p class="text-sm text-textSecondary mb-4">Есть вопросы? Запишитесь на приём к специалисту</p>
              <RouterLink to="/doctors" class="btn-primary text-sm py-2.5 px-5 w-full justify-center flex">Найти врача</RouterLink>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </main>
</template>
