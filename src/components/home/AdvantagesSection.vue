<script setup lang="ts">
import { useAnimatedCounter, useScrollReveal } from '../../composables/useAnimations'
import { yearWord } from '../../utils/index'

const c1 = useAnimatedCounter(60)
const c2 = useAnimatedCounter(1500)
const c3 = useAnimatedCounter(1)
const c4 = useAnimatedCounter(15)
const { el: sectionEl, isVisible } = useScrollReveal()

const advantages = [
  { icon: '🏆', title: 'Врачи с опытом 10+ лет', desc: 'Более 80% наших специалистов — кандидаты и доктора наук' },
  { icon: '🔬', title: 'Современное оборудование', desc: 'МРТ 3 Тесла, КТ, аппараты УЗИ экспертного класса' },
  { icon: '🕐', title: 'Работаем 24/7', desc: 'Неотложная помощь и дежурный врач круглосуточно' },
  { icon: '💻', title: 'Онлайн запись', desc: 'Запишитесь к нужному врачу в любое время за 2 минуты' },
  { icon: '📋', title: 'Электронные результаты', desc: 'Результаты анализов и заключения в личном кабинете' },
  { icon: '✅', title: 'Гарантия качества', desc: 'Сертифицированные клиники, международные стандарты JCI' },
]

const counters = [
  { ref: c1.count, el: c1.el, suffix: '+', label: 'клиник', unit: '' },
  { ref: c2.count, el: c2.el, suffix: '+', label: 'врачей', unit: '' },
  { ref: c3.count, el: c3.el, suffix: ' млн+', label: 'пациентов', unit: '' },
  { ref: c4.count, el: c4.el, suffix: '+', label: 'лет на рынке', unit: '' },
]
</script>

<template>
  <section class="py-16 md:py-24 bg-white" ref="sectionEl">
    <div class="container-custom">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="section-title">Почему выбирают МедЦентр</h2>
        <p class="section-subtitle mx-auto max-w-2xl">Мы создаём условия, в которых вы чувствуете себя в безопасности и получаете лечение мирового уровня</p>
      </div>

      <!-- Advantages grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div
          v-for="(adv, i) in advantages"
          :key="adv.title"
          :class="[
            'p-6 rounded-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 group',
            isVisible ? 'animate-slide-up' : 'opacity-0',
          ]"
          :style="{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }"
        >
          <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            {{ adv.icon }}
          </div>
          <h3 class="font-bold text-textPrimary mb-2">{{ adv.title }}</h3>
          <p class="text-textSecondary text-sm leading-relaxed">{{ adv.desc }}</p>
        </div>
      </div>

      <!-- Animated counters -->
      <div class="bg-gradient-to-br from-primary to-[#00256E] rounded-card p-8 md:p-12">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
          <div :ref="c1.el">
            <div class="text-4xl md:text-5xl font-bold text-secondary">{{ c1.count }}+</div>
            <div class="text-white/70 mt-1 text-sm font-medium">клиник</div>
          </div>
          <div :ref="c2.el">
            <div class="text-4xl md:text-5xl font-bold text-secondary">{{ c2.count }}+</div>
            <div class="text-white/70 mt-1 text-sm font-medium">врачей</div>
          </div>
          <div :ref="c3.el">
            <div class="text-4xl md:text-5xl font-bold text-secondary">{{ c3.count }} млн+</div>
            <div class="text-white/70 mt-1 text-sm font-medium">пациентов</div>
          </div>
          <div :ref="c4.el">
            <div class="text-4xl md:text-5xl font-bold text-secondary">{{ c4.count }}+</div>
            <div class="text-white/70 mt-1 text-sm font-medium">лет на рынке</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
