import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useAnimatedCounter(target: number, duration = 2000) {
  const count = ref(0)
  const el = ref<HTMLElement | null>(null)
  let started = false

  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (entry.isIntersecting && !started) {
      started = true
      animateCount()
      stop()
    }
  }, { threshold: 0.3 })

  function animateCount() {
    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      count.value = Math.round(eased * target)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return { count, el }
}

export function useScrollReveal() {
  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true
      stop()
    }
  }, { threshold: 0.15 })

  return { el, isVisible }
}
