import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useScrollDetection } from '../useScrollDetection'

describe('useScrollDetection - Browser Compatibility Fallbacks', () => {
  let originalScrollY: PropertyDescriptor | undefined
  let originalPageYOffset: PropertyDescriptor | undefined
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame
  let originalCancelAnimationFrame: typeof window.cancelAnimationFrame

  beforeEach(() => {
    originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')
    originalPageYOffset = Object.getOwnPropertyDescriptor(window, 'pageYOffset')
    originalRequestAnimationFrame = window.requestAnimationFrame
    originalCancelAnimationFrame = window.cancelAnimationFrame
  })

  afterEach(() => {
    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY)
    }
    if (originalPageYOffset) {
      Object.defineProperty(window, 'pageYOffset', originalPageYOffset)
    }
    window.requestAnimationFrame = originalRequestAnimationFrame
    window.cancelAnimationFrame = originalCancelAnimationFrame
  })

  describe('Scroll Position Detection Fallbacks', () => {
    it('should use window.scrollY when available', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      })

      const TestComponent = defineComponent({
        setup() {
          const { scrollY } = useScrollDetection()
          return () => h('div', scrollY.value)
        },
      })

      const wrapper = mount(TestComponent)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toBe('100')
    })

    it('should fallback to window.pageYOffset when scrollY is undefined', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      })

      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 150,
      })

      const TestComponent = defineComponent({
        setup() {
          const { scrollY } = useScrollDetection()
          return () => h('div', scrollY.value)
        },
      })

      const wrapper = mount(TestComponent)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toBe('150')
    })

    it('should fallback to document.documentElement.scrollTop when both scrollY and pageYOffset are undefined', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: undefined,
      })

      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 200,
      })

      const TestComponent = defineComponent({
        setup() {
          const { scrollY } = useScrollDetection()
          return () => h('div', scrollY.value)
        },
      })

      const wrapper = mount(TestComponent)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toBe('200')
    })

    it('should return 0 when all scroll position methods are unavailable', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(document.body, 'scrollTop', {
        writable: true,
        configurable: true,
        value: undefined,
      })

      const TestComponent = defineComponent({
        setup() {
          const { scrollY } = useScrollDetection()
          return () => h('div', scrollY.value)
        },
      })

      const wrapper = mount(TestComponent)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toBe('0')
    })
  })

  describe('requestAnimationFrame Fallbacks', () => {
    it('should use requestAnimationFrame when available', async () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

      const TestComponent = defineComponent({
        setup() {
          const { scrollY } = useScrollDetection()
          return () => h('div', scrollY.value)
        },
      })

      mount(TestComponent)
      await new Promise((resolve) => setTimeout(resolve, 50))

      window.dispatchEvent(new Event('scroll'))
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(rafSpy).toHaveBeenCalled()
    })

    it('should fallback to setTimeout when requestAnimationFrame is undefined', async () => {
      ;(window as any).requestAnimationFrame = undefined
      ;(window as any).cancelAnimationFrame = undefined

      const setTimeoutSpy = vi.spyOn(window, 'setTimeout')

      const TestComponent = defineComponent({
        setup() {
          const { scrollY } = useScrollDetection()
          return () => h('div', scrollY.value)
        },
      })

      mount(TestComponent)
      await new Promise((resolve) => setTimeout(resolve, 50))

      window.dispatchEvent(new Event('scroll'))
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(setTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Passive Event Listener Fallback', () => {
    it('should use passive event listeners when supported', async () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      const TestComponent = defineComponent({
        setup() {
          useScrollDetection()
          return () => h('div')
        },
      })

      mount(TestComponent)
      await new Promise((resolve) => setTimeout(resolve, 50))

      const scrollListenerCall = addEventListenerSpy.mock.calls.find((call) => call[0] === 'scroll')

      expect(scrollListenerCall).toBeDefined()
      const eventOptions = scrollListenerCall?.[2]
      expect(
        eventOptions === false ||
          (typeof eventOptions === 'object' && eventOptions.passive === true),
      ).toBe(true)
    })
  })

  describe('Floating State Behavior', () => {
    it('should correctly determine floating state with fallback scroll detection', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 100,
      })

      const TestComponent = defineComponent({
        setup() {
          const { isFloating } = useScrollDetection({ threshold: 50 })
          return () => h('div', isFloating.value ? 'floating' : 'not-floating')
        },
      })

      const wrapper = mount(TestComponent)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toBe('floating')
    })

    it('should not be floating when scroll position is below threshold using fallback', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 30,
      })

      const TestComponent = defineComponent({
        setup() {
          const { isFloating } = useScrollDetection({ threshold: 50 })
          return () => h('div', isFloating.value ? 'floating' : 'not-floating')
        },
      })

      const wrapper = mount(TestComponent)
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toBe('not-floating')
    })
  })
})
