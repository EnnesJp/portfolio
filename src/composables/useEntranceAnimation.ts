import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseEntranceAnimationOptions {
  threshold?: number // default: 0.1 (10% visible)
  rootMargin?: string // default: '0px'
}

export interface UseEntranceAnimationReturn {
  sectionRef: Ref<HTMLElement | undefined>
  isVisible: Ref<boolean>
}

export function useEntranceAnimation(
  options: UseEntranceAnimationOptions = {},
): UseEntranceAnimationReturn {
  const { threshold = 0.1, rootMargin = '0px' } = options

  const sectionRef = ref<HTMLElement | undefined>(undefined)
  const isVisible = ref<boolean>(false)

  let observer: IntersectionObserver | null = null

  const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  onMounted(() => {
    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion()) {
      isVisible.value = true
      return
    }

    // Fallback for browsers without IntersectionObserver support
    if (typeof IntersectionObserver === 'undefined') {
      isVisible.value = true
      return
    }

    const element = sectionRef.value
    if (!element) {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isVisible.value = true
            // Fire once, then disconnect
            observer?.disconnect()
            observer = null
            break
          }
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    sectionRef,
    isVisible,
  }
}
