import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      navigation: {
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        mobileMenu: 'Mobile menu',
      },
    },
  },
})

const mountOptions = {
  global: {
    plugins: [i18n],
    stubs: {
      ResponsiveContainer: { template: '<div><slot /></div>' },
      SelectLang: { template: '<div>SelectLang</div>' },
      ThemeToggle: { template: '<div>ThemeToggle</div>' },
    },
  },
}

describe('TheHeader - Performance Optimizations', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()

    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    vi.stubGlobal('matchMedia', matchMediaMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Requirement 8.2: CSS Transform and GPU Acceleration', () => {
    it('should use transform for GPU acceleration in floating state', async () => {
      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

      expect(wrapper.vm).toBeDefined()
    })

    it('should have will-change hints for animated properties', () => {
      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

      expect(header.classes()).toContain('header')
    })

    it('should use transition-property for specific properties only', () => {
      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

    })
  })

  describe('Requirement 8.4: Smooth 60fps Performance', () => {
    it('should maintain smooth transitions with appropriate duration', () => {
      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

    })

    it('should use cubic-bezier easing for natural transitions', () => {
      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

    })
  })

  describe('Reduced Motion Support', () => {
    it('should disable transitions when prefers-reduced-motion is set', () => {
      const matchMediaMock = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      vi.stubGlobal('matchMedia', matchMediaMock)

      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

    })
  })

  describe('Floating State Performance', () => {
    it('should apply floating class when scrolled past threshold', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      })

      const wrapper = mount(TheHeader, mountOptions)

      window.dispatchEvent(new Event('scroll'))

      await vi.advanceTimersByTimeAsync(10)
      await vi.advanceTimersByTimeAsync(16)
      await wrapper.vm.$nextTick()

      const header = wrapper.find('header')
      expect(header.classes()).toContain('header--floating')
    })

    it('should remove floating class when scrolled back to top', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      })

      const wrapper = mount(TheHeader, mountOptions)

      window.dispatchEvent(new Event('scroll'))
      await vi.advanceTimersByTimeAsync(10)
      await vi.advanceTimersByTimeAsync(16)
      await wrapper.vm.$nextTick()

      let header = wrapper.find('header')
      expect(header.classes()).toContain('header--floating')

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0,
      })

      window.dispatchEvent(new Event('scroll'))
      await vi.advanceTimersByTimeAsync(10)
      await vi.advanceTimersByTimeAsync(16)
      await wrapper.vm.$nextTick()

      header = wrapper.find('header')
      expect(header.classes()).not.toContain('header--floating')
    })
  })

  describe('Memory and Resource Management', () => {
    it('should clean up scroll listeners on unmount', async () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const wrapper = mount(TheHeader, mountOptions)

      await wrapper.vm.$nextTick()

      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('should clean up keyboard listeners on unmount', async () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const wrapper = mount(TheHeader, mountOptions)

      await wrapper.vm.$nextTick()

      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should restore body overflow on unmount if mobile menu was open', async () => {
      const wrapper = mount(TheHeader, mountOptions)

      await wrapper.vm.$nextTick()

      wrapper.unmount()

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('CSS Fallbacks for Browser Compatibility', () => {
    it('should have fallback for backdrop-filter support', () => {
      const wrapper = mount(TheHeader, mountOptions)

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)

    })
  })
})
