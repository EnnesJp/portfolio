import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { performanceMonitor } from '@/utils/performance'

export interface UseScrollDetectionOptions {
  threshold?: number
  debounceMs?: number
  enablePerformanceMonitoring?: boolean
}

export interface UseScrollDetectionReturn {
  isFloating: Ref<boolean>
  scrollY: Ref<number>
}

export function useScrollDetection(
  options: UseScrollDetectionOptions = {},
): UseScrollDetectionReturn {
  const { threshold = 50, debounceMs = 10, enablePerformanceMonitoring = false } = options

  const isFloating = ref<boolean>(false)
  const scrollY = ref<number>(0)

  let rafId: number | null = null
  let timeoutId: number | null = null
  const hysteresis = 10

  const requestFrame = (callback: FrameRequestCallback): number => {
    if (typeof window.requestAnimationFrame !== 'undefined') {
      return window.requestAnimationFrame(callback)
    }
    return window.setTimeout(callback, 16) as unknown as number
  }

  const cancelFrame = (id: number): void => {
    if (typeof window.cancelAnimationFrame !== 'undefined') {
      window.cancelAnimationFrame(id)
    } else {
      window.clearTimeout(id)
    }
  }

  const getScrollPosition = (): number => {
    if (typeof window.scrollY !== 'undefined') {
      return window.scrollY
    }

    if (typeof window.pageYOffset !== 'undefined') {
      return window.pageYOffset
    }

    if (document.documentElement && typeof document.documentElement.scrollTop !== 'undefined') {
      return document.documentElement.scrollTop
    }

    if (document.body && typeof document.body.scrollTop !== 'undefined') {
      return document.body.scrollTop
    }

    return 0
  }

  const updateScrollState = () => {
    const currentScrollY = getScrollPosition()

    scrollY.value = currentScrollY

    if (isFloating.value) {
      if (currentScrollY < threshold - hysteresis) {
        isFloating.value = false
      }
    } else {
      if (currentScrollY > threshold + hysteresis) {
        isFloating.value = true
      }
    }

    if (enablePerformanceMonitoring) {
      performanceMonitor.recordRAFCall()
    }

    rafId = null
  }

  const handleScroll = () => {
    if (enablePerformanceMonitoring) {
      performanceMonitor.recordScrollEvent()
    }

    if (rafId !== null) {
      cancelFrame(rafId)
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      rafId = requestFrame(updateScrollState)
    }, debounceMs)
  }

  onMounted(() => {
    updateScrollState()

    let supportsPassive = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true
          return true
        },
      })
      window.addEventListener('test' as any, null as any, opts)
      window.removeEventListener('test' as any, null as any, opts)
    } catch (e) {
      supportsPassive = false
    }

    const eventOptions = supportsPassive ? { passive: true } : false
    window.addEventListener('scroll', handleScroll, eventOptions)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)

    if (rafId !== null) {
      cancelFrame(rafId)
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })

  return {
    isFloating,
    scrollY,
  }
}
