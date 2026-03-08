import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUIStore } from '@/stores/ui'

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

describe('TheHeader - Accessibility Features', () => {
  let wrapper: any
  let navigationStore: any
  let uiStore: any

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        navigation: {
          visibleSections: [
            { id: 'presentation', label: 'Home', order: 1, visible: true },
            { id: 'about', label: 'About', order: 2, visible: true },
            { id: 'contact', label: 'Contact', order: 3, visible: true },
          ],
          currentSection: 'presentation',
        },
        ui: {
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          isMobileMenuOpen: false,
          screenWidth: 1024,
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

    navigationStore = useNavigationStore()
    uiStore = useUIStore()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('ARIA Attributes Preservation', () => {
    it('should maintain role="banner" in both default and floating states', async () => {
      const header = wrapper.find('header')
      expect(header.attributes('role')).toBe('banner')

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(header.attributes('role')).toBe('banner')
      expect(header.classes()).toContain('header--floating')
    })

    it('should maintain navigation role and aria-label in floating state', async () => {
      const nav = wrapper.find('nav[role="navigation"]')
      expect(nav.attributes('role')).toBe('navigation')
      expect(nav.attributes('aria-label')).toBe('Main navigation')

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const navFloating = wrapper.find('nav[role="navigation"]')
      expect(navFloating.attributes('role')).toBe('navigation')
      expect(navFloating.attributes('aria-label')).toBe('Main navigation')
    })
  })

  describe('Focus Visibility in Floating State', () => {
    it('should maintain focus styles on navigation links in floating state', async () => {
      uiStore.isDesktop = true
      uiStore.isMobile = false
      await wrapper.vm.$nextTick()

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('.header')
      expect(header.classes()).toContain('header--floating')

      const navLink = wrapper.find('.header__nav-link')
      expect(navLink.exists()).toBe(true)
      await navLink.trigger('focus')

      expect(navLink.element).toBeTruthy()
    })
  })

  describe('Keyboard Navigation in Floating State', () => {
    it('should handle Enter key on navigation links in floating state', async () => {
      uiStore.isDesktop = true
      uiStore.isMobile = false
      await wrapper.vm.$nextTick()

      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const navLink = wrapper.find('.header__nav-link')
      expect(navLink.exists()).toBe(true)
      await navLink.trigger('keydown.enter')

      expect(navigationStore.scrollToSection).toHaveBeenCalled()
    })
  })

  describe('Screen Reader Support', () => {
    it('should maintain semantic HTML structure in floating state', async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 })
      window.dispatchEvent(new Event('scroll'))
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
      expect(header.element.tagName).toBe('HEADER')

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.element.tagName).toBe('NAV')

      const list = wrapper.find('ul')
      expect(list.exists()).toBe(true)
      expect(list.element.tagName).toBe('UL')
    })
  })
})
