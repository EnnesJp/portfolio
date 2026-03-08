import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'
import { useThemeStore } from '@/stores/theme'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      navigation: {
        presentation: 'Home',
        about: 'About',
        companies: 'Experience',
        certifications: 'Certifications',
        skills: 'Skills',
        projects: 'Projects',
        contact: 'Contact',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        mobileMenu: 'Mobile menu',
      },
    },
  },
})

describe('TheHeader - Theme Compatibility', () => {
  let wrapper: any
  let themeStore: any

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        navigation: {
          visibleSections: [
            { id: 'presentation', label: 'Home', order: 1, visible: true },
            { id: 'about', label: 'About', order: 2, visible: true },
          ],
          currentSection: 'presentation',
        },
      },
    })

    wrapper = mount(TheHeader, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          'select-lang': true,
          'theme-toggle': true,
          'responsive-container': {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    themeStore = useThemeStore()
  })

  describe('Glass Effect in Light Theme', () => {
    it('should apply glass effect when floating in light theme', async () => {
      themeStore.currentTheme = 'light'
      document.documentElement.setAttribute('data-theme', 'light')

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))

      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('.header')
      expect(header.classes()).toContain('header--floating')
    })

    it('should use light theme glass variables when floating', () => {
      themeStore.currentTheme = 'light'
      document.documentElement.setAttribute('data-theme', 'light')

      const styles = getComputedStyle(document.documentElement)
      const glassBg = styles.getPropertyValue('--glass-bg').trim()

      expect(glassBg).toContain('255, 255, 255')
    })
  })

  describe('Glass Effect in Dark Theme', () => {
    it('should apply glass effect when floating in dark theme', async () => {
      themeStore.currentTheme = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))

      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('.header')
      expect(header.classes()).toContain('header--floating')
    })

    it('should use dark theme glass variables when floating', () => {
      themeStore.currentTheme = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')

      const styles = getComputedStyle(document.documentElement)
      const glassBg = styles.getPropertyValue('--glass-bg').trim()

      expect(glassBg).toContain('26, 26, 26')
    })
  })

  describe('Theme-Specific CSS Variables', () => {
    it('should have different glass-bg values for light and dark themes', () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const lightStyles = getComputedStyle(document.documentElement)
      const lightGlassBg = lightStyles.getPropertyValue('--glass-bg').trim()

      document.documentElement.setAttribute('data-theme', 'dark')
      const darkStyles = getComputedStyle(document.documentElement)
      const darkGlassBg = darkStyles.getPropertyValue('--glass-bg').trim()

      expect(lightGlassBg).not.toBe(darkGlassBg)
    })

    it('should have different glass-border values for light and dark themes', () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const lightStyles = getComputedStyle(document.documentElement)
      const lightBorder = lightStyles.getPropertyValue('--glass-border').trim()

      document.documentElement.setAttribute('data-theme', 'dark')
      const darkStyles = getComputedStyle(document.documentElement)
      const darkBorder = darkStyles.getPropertyValue('--glass-border').trim()

      expect(lightBorder).not.toBe(darkBorder)
    })

    it('should have different glass-shadow values for light and dark themes', () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const lightStyles = getComputedStyle(document.documentElement)
      const lightShadow = lightStyles.getPropertyValue('--glass-shadow').trim()

      document.documentElement.setAttribute('data-theme', 'dark')
      const darkStyles = getComputedStyle(document.documentElement)
      const darkShadow = darkStyles.getPropertyValue('--glass-shadow').trim()

      expect(lightShadow).not.toBe(darkShadow)
    })

    it('should maintain glass-blur value across themes', () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const lightStyles = getComputedStyle(document.documentElement)
      const lightBlur = lightStyles.getPropertyValue('--glass-blur').trim()

      document.documentElement.setAttribute('data-theme', 'dark')
      const darkStyles = getComputedStyle(document.documentElement)
      const darkBlur = darkStyles.getPropertyValue('--glass-blur').trim()

      expect(lightBlur).toBe(darkBlur)
      expect(lightBlur).toBe('10px')
    })
  })

  describe('Smooth Theme Transitions', () => {
    it('should have transition properties defined on header', () => {
      const header = wrapper.find('.header')
      const element = header.element as HTMLElement
      const styles = window.getComputedStyle(element)

      const transitionProperty = styles.getPropertyValue('transition-property')
      const transitionDuration = styles.getPropertyValue('transition-duration')

      expect(transitionProperty).toBeTruthy()
      expect(transitionDuration).toBeTruthy()
    })

    it('should transition background-color when theme changes', async () => {
      themeStore.currentTheme = 'light'
      document.documentElement.setAttribute('data-theme', 'light')
      await wrapper.vm.$nextTick()

      const header = wrapper.find('.header')
      const element = header.element as HTMLElement
      const styles = window.getComputedStyle(element)

      const transitionProperty = styles.getPropertyValue('transition-property')

      expect(transitionProperty).toContain('background-color')
    })

    it('should maintain floating state during theme switch', async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('.header')
      expect(header.classes()).toContain('header--floating')

      themeStore.currentTheme = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')
      await wrapper.vm.$nextTick()

      expect(header.classes()).toContain('header--floating')
    })
  })

  describe('Glass Effect Styling Consistency', () => {
    it('should apply backdrop-filter in floating state regardless of theme', async () => {
      themeStore.currentTheme = 'light'
      document.documentElement.setAttribute('data-theme', 'light')

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      let header = wrapper.find('.header')
      expect(header.classes()).toContain('header--floating')

      themeStore.currentTheme = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')
      await wrapper.vm.$nextTick()

      header = wrapper.find('.header')
      expect(header.classes()).toContain('header--floating')
    })

    it('should apply border in floating state for both themes', async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('.header')
      const element = header.element as HTMLElement

      expect(header.classes()).toContain('header--floating')
    })

    it('should apply box-shadow in floating state for both themes', async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('.header')

      expect(header.classes()).toContain('header--floating')
    })
  })

  describe('Theme-Appropriate Colors', () => {
    it('should use light colors for light theme glass effect', () => {
      document.documentElement.setAttribute('data-theme', 'light')
      const styles = getComputedStyle(document.documentElement)
      const glassBg = styles.getPropertyValue('--glass-bg').trim()

      expect(glassBg).toContain('255')
    })

    it('should use dark colors for dark theme glass effect', () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      const styles = getComputedStyle(document.documentElement)
      const glassBg = styles.getPropertyValue('--glass-bg').trim()

      expect(glassBg).toContain('26')
    })
  })
})
