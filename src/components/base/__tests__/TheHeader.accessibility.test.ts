import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUIStore } from '@/stores/ui'
import { mountWithDependencies, simulateScroll } from '@/test-utils'

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
  let mocks: any

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })

    const result = mountWithDependencies(TheHeader, {
      global: {
        plugins: [i18n],
        stubs: {
          'select-lang': true,
          'theme-toggle': true,
          'responsive-container': {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    wrapper = result.wrapper
    mocks = result.mocks

    navigationStore = useNavigationStore()
    uiStore = useUIStore()

    uiStore.updateBreakpoints()

    navigationStore.$patch({
      sections: [
        { id: 'presentation', label: 'Home', order: 1, visible: true },
        { id: 'about', label: 'About', order: 2, visible: true },
        { id: 'contact', label: 'Contact', order: 3, visible: true },
      ],
      currentSection: 'presentation',
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('ARIA Attributes Preservation', () => {
    it('should maintain role="banner" in both default and floating states', async () => {
      const header = wrapper.find('header')
      expect(header.attributes('role')).toBe('banner')

      simulateScroll(100)
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const headerAfterScroll = wrapper.find('header')
      expect(headerAfterScroll.attributes('role')).toBe('banner')
      expect(headerAfterScroll.classes()).toContain('header--floating')
    })

    it('should maintain navigation role and aria-label in floating state', async () => {
      const nav = wrapper.find('nav[role="navigation"]')
      expect(nav.attributes('role')).toBe('navigation')
      expect(nav.attributes('aria-label')).toBe('Main navigation')

      simulateScroll(100)
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const navFloating = wrapper.find('nav[role="navigation"]')
      expect(navFloating.attributes('role')).toBe('navigation')
      expect(navFloating.attributes('aria-label')).toBe('Main navigation')
    })
  })

  describe('Focus Visibility in Floating State', () => {
    it('should maintain focus styles on navigation links in floating state', async () => {
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 100))

      simulateScroll(100)
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
      await wrapper.vm.$nextTick()

      simulateScroll(100)
      await wrapper.vm.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      const navLink = wrapper.find('.header__nav-link')
      expect(navLink.exists()).toBe(true)
      await navLink.trigger('click')

      expect(navigationStore.scrollToSection).toHaveBeenCalled()
    })
  })

  describe('Screen Reader Support', () => {
    it('should maintain semantic HTML structure in floating state', async () => {
      simulateScroll(100)
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
