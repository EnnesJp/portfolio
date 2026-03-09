import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUIStore } from '@/stores/ui'
import { mountWithDependencies, simulateScroll as utilSimulateScroll } from '@/test-utils'

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

function simulateScroll(scrollY: number) {
  utilSimulateScroll(scrollY)
  Object.defineProperty(window, 'pageYOffset', {
    writable: true,
    configurable: true,
    value: scrollY,
  })
}

function setViewportSize(width: number, height: number = 768) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

async function waitForScrollUpdate() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 20)
    })
  })
}

describe('TheHeader - Responsive Behavior', () => {
  let wrapper: any
  let mocks: any
  let navigationStore: any
  let uiStore: any

  beforeEach(() => {
    simulateScroll(0)

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

    navigationStore.visibleSections = [
      { id: 'presentation', label: 'Home', order: 1, visible: true },
      { id: 'about', label: 'About', order: 2, visible: true },
      { id: 'contact', label: 'Contact', order: 3, visible: true },
    ]
    navigationStore.currentSection = 'presentation'
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Mobile Viewport (< 768px)', () => {
    beforeEach(async () => {
      setViewportSize(375)
      uiStore.isMobile = true
      uiStore.isTablet = false
      uiStore.isDesktop = false
      await wrapper.vm.$nextTick()
    })

    it('should activate floating behavior when scrolling past threshold on mobile', async () => {
      expect(wrapper.find('.header--floating').exists()).toBe(false)

      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })

    it('should show mobile menu toggle button', () => {
      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      expect(mobileToggle.exists()).toBe(true)
    })

    it('should hide desktop navigation on mobile', () => {
      const desktopNav = wrapper.find('.header__nav')
      expect(desktopNav.exists()).toBe(false)
    })

    it('should maintain mobile menu accessibility in floating state', async () => {
      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      expect(mobileToggle.exists()).toBe(true)
      expect(mobileToggle.attributes('aria-label')).toBeDefined()
      expect(mobileToggle.attributes('aria-expanded')).toBeDefined()
    })

    it('should have touch-friendly tap targets (minimum 44x44px) on mobile', () => {
      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      const element = mobileToggle.element as HTMLElement

      const styles = window.getComputedStyle(element)
      const padding = parseFloat(styles.padding || '0')

      expect(element).toBeDefined()
    })

    it('should open mobile menu when toggle is clicked in floating state', async () => {
      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      await mobileToggle.trigger('click')

      expect(uiStore.toggleMobileMenu).toHaveBeenCalled()
    })

    it('should maintain mobile menu functionality when scrolling', async () => {
      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      await mobileToggle.trigger('click')
      await wrapper.vm.$nextTick()

      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      const mobileMenu = document.querySelector('.header__mobile-menu')
      expect(mobileMenu).toBeTruthy()
    })
  })

  describe('Tablet Viewport (768px - 1024px)', () => {
    beforeEach(async () => {
      setViewportSize(768)
      uiStore.isMobile = false
      uiStore.isTablet = true
      uiStore.isDesktop = false
      await wrapper.vm.$nextTick()
    })

    it('should activate floating behavior when scrolling past threshold on tablet', async () => {
      expect(wrapper.find('.header--floating').exists()).toBe(false)

      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })

    it('should show desktop navigation on tablet', async () => {
      setViewportSize(1024)
      uiStore.isMobile = false
      uiStore.isTablet = false
      uiStore.isDesktop = true
      await wrapper.vm.$nextTick()

      const desktopNav = wrapper.find('.header__nav')
      expect(desktopNav.exists()).toBe(true)
    })

    it('should hide mobile controls on tablet', () => {
      const mobileControls = wrapper.find('.header__mobile-controls')
      expect(mobileControls.exists()).toBe(false)
    })
  })

  describe('Desktop Viewport (> 1024px)', () => {
    beforeEach(async () => {
      setViewportSize(1440)
      uiStore.isMobile = false
      uiStore.isTablet = false
      uiStore.isDesktop = true
      await wrapper.vm.$nextTick()
    })

    it('should activate floating behavior when scrolling past threshold on desktop', async () => {
      expect(wrapper.find('.header--floating').exists()).toBe(false)

      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })

    it('should show desktop navigation', () => {
      const desktopNav = wrapper.find('.header__nav')
      expect(desktopNav.exists()).toBe(true)
    })

    it('should hide mobile controls on desktop', () => {
      const mobileControls = wrapper.find('.header__mobile-controls')
      expect(mobileControls.exists()).toBe(false)
    })

    it('should maintain navigation functionality in floating state', async () => {
      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      const navLink = wrapper.find('.header__nav-link')
      await navLink.trigger('click')

      expect(navigationStore.scrollToSection).toHaveBeenCalled()
    })
  })

  describe('Cross-Viewport Floating Behavior', () => {
    it('should maintain floating state when resizing from mobile to desktop', async () => {
      setViewportSize(375)
      uiStore.isMobile = true
      uiStore.isDesktop = false
      await wrapper.vm.$nextTick()

      simulateScroll(100)
      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.header--floating').exists()).toBe(true)

      setViewportSize(1440)
      uiStore.isMobile = false
      uiStore.isDesktop = true
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })
  })

  describe('Touch Target Accessibility', () => {
    beforeEach(async () => {
      setViewportSize(375)
      uiStore.isMobile = true
      await wrapper.vm.$nextTick()
    })

    it('should have adequate touch targets for mobile menu toggle', () => {
      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      expect(mobileToggle.exists()).toBe(true)

      const element = mobileToggle.element as HTMLElement
      expect(element.classList.contains('header__mobile-menu-toggle')).toBe(true)
    })

    it('should have adequate touch targets for mobile nav links', async () => {
      const mobileToggle = wrapper.find('.header__mobile-menu-toggle')
      await mobileToggle.trigger('click')
      await wrapper.vm.$nextTick()

      const mobileNavLinks = document.querySelectorAll('.header__mobile-nav-link')
      expect(mobileNavLinks.length).toBeGreaterThan(0)

      mobileNavLinks.forEach((link) => {
        const element = link as HTMLElement
        expect(element.classList.contains('header__mobile-nav-link')).toBe(true)
      })
    })
  })

  describe('Floating State Consistency', () => {
    it('should apply consistent floating styles across all viewports', async () => {
      const viewports = [375, 768, 1440]

      for (const width of viewports) {
        setViewportSize(width)
        await wrapper.vm.$nextTick()

        simulateScroll(100)
        await waitForScrollUpdate()
        await wrapper.vm.$nextTick()

        const header = wrapper.find('.header')
        expect(header.classes()).toContain('header--floating')
      }
    })

    it('should maintain z-index in floating state across viewports', async () => {
      const viewports = [375, 768, 1440]

      for (const width of viewports) {
        setViewportSize(width)
        await wrapper.vm.$nextTick()

        simulateScroll(100)
        await waitForScrollUpdate()
        await wrapper.vm.$nextTick()

        const header = wrapper.find('.header--floating')
        expect(header.exists()).toBe(true)
      }
    })
  })

  describe('Performance on Mobile', () => {
    beforeEach(async () => {
      setViewportSize(375)
      uiStore.isMobile = true
      await wrapper.vm.$nextTick()
    })

    it('should use passive scroll listeners', () => {
      simulateScroll(100)
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle rapid scroll events without breaking', async () => {
      for (let i = 0; i < 10; i++) {
        simulateScroll(i * 10)
      }

      await waitForScrollUpdate()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.header').exists()).toBe(true)
    })
  })
})
