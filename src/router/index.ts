import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
    meta: { title: 'МедЦентр — Сеть медицинских клиник', description: 'Лучшие врачи Москвы. Онлайн-запись, современное оборудование, 60+ клиник.' },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../pages/ServicesPage.vue'),
    meta: { title: 'Услуги — МедЦентр', description: 'Все медицинские услуги: диагностика, МРТ, УЗИ, анализы и многое другое.' },
  },
  {
    path: '/services/:slug',
    name: 'service-detail',
    component: () => import('../pages/ServiceDetailPage.vue'),
    meta: { title: 'Услуга — МедЦентр' },
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: () => import('../pages/DoctorsPage.vue'),
    meta: { title: 'Врачи — МедЦентр', description: 'Найдите лучшего специалиста среди 1500+ врачей нашей сети.' },
  },
  {
    path: '/doctors/:id',
    name: 'doctor-detail',
    component: () => import('../pages/DoctorDetailPage.vue'),
    meta: { title: 'Врач — МедЦентр' },
  },
  {
    path: '/clinics',
    name: 'clinics',
    component: () => import('../pages/ClinicsPage.vue'),
    meta: { title: 'Клиники — МедЦентр', description: 'Найдите ближайшую клинику МедЦентр в вашем городе.' },
  },
  {
    path: '/clinics/:id',
    name: 'clinic-detail',
    component: () => import('../pages/ClinicDetailPage.vue'),
    meta: { title: 'Клиника — МедЦентр' },
  },
  {
    path: '/actions',
    name: 'actions',
    component: () => import('../pages/ActionsPage.vue'),
    meta: { title: 'Акции и скидки — МедЦентр', description: 'Специальные предложения и акции для наших пациентов.' },
  },
  {
    path: '/actions/:id',
    name: 'action-detail',
    component: () => import('../pages/ActionDetailPage.vue'),
    meta: { title: 'Акция — МедЦентр' },
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../pages/ArticlesPage.vue'),
    meta: { title: 'Статьи о здоровье — МедЦентр' },
  },
  {
    path: '/articles/:slug',
    name: 'article-detail',
    component: () => import('../pages/ArticleDetailPage.vue'),
    meta: { title: 'Статья — МедЦентр' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/AboutPage.vue'),
    meta: { title: 'О компании — МедЦентр' },
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('../pages/ContactsPage.vue'),
    meta: { title: 'Контакты — МедЦентр' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFoundPage.vue'),
    meta: { title: '404 — Страница не найдена' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  const title = to.meta.title as string
  const description = to.meta.description as string
  if (title) document.title = title
  if (description) {
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta) }
    meta.setAttribute('content', description)
  }
})

export default router
