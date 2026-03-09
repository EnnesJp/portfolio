import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { VueWrapper, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUIStore } from '@/stores/ui'
import { mountWithDependencies, setupStoreMocks } from '@/test-utils'

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
        toggleMenu: 'Toggle navigation menu',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        mobileMenu: 'Mobile menu',
      },
      common: {
        toggleTheme: 'Toggle theme',
      },
    },
  },
})

/**
 * Test suite for navigation functionality preservation
 * Validates: Requirements 3.4
 *
 * This test suite ensures that all navigation features work identically
 * in both floating and non-floating states of the header.
 */
describe('TheHeader - Navigation Functionality Preservation', () => {
  let wrapper: VueWrapper<any>
  let navigationStore: any
  let uiStore: any
  let mocks: ReturnType<typeof setupStoreMocks>

  const setupWrapper = async (scrollY: number = 0) => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: scrollY,
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    mocks = setupStoreMocks()

    const result = mountWithDependencies(TheHeader, {
      global: {
        plugins: [i18n],
        stubs: {
          'select-lang': true,
          'theme-toggle': true,
        },
      },
      storeMocks: mocks,
    })

    wrapper = result.wrapper
    navigationStore = useNavigationStore()
    uiStore = useUIStore()

    navigationStore.visibleSections = [
      { id: 'presentation', label: 'Home', order: 1, visible: true },
      { id: 'about', label: 'About', order: 2, visible: true },
      { id: 'companies', label: 'Experience', order: 3, visible: true },
      { id: 'contact', label: 'Contact', order: 4, visible: true },
    ]
    navigationStore.currentSection = 'presentation'

    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    await wrapper.vm.$nextTick()

    return wrapper
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Desktop Navigation Clicks - Default State', () => {
    beforeEach(async () => {
      await setupWrapper(0)
    })

    it('should call scrollToSection when navigation link is clicked in default state', async () => {
      const navLinks = wrapper.findAll('.header__nav-link')
      expect(navLinks.length).toBeGreaterThan(0)

      await navLinks[1].trigger('click')

      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('about')
    })

    it('should emit section-change event when navigation link is clicked in default state', async () => {
      const navLinks = wrapper.findAll('.header__nav-link')

      await navLinks[2].trigger('click')

      expect(wrapper.emitted('section-change')).toBeTruthy()
      expect(wrapper.emitted('section-change')[0]).toEqual(['companies'])
    })

    it('should navigate to all sections in default state', async () => {
      const navLinks = wrapper.findAll('.header__nav-link')

      for (let i = 0; i < navLinks.length; i++) {
        await navLinks[i].trigger('click')
      }

      expect(navigationStore.scrollToSection).toHaveBeenCalledTimes(navLinks.length)
    })
  })

  describe('Desktop Navigation Clicks - Floating State', () => {
    beforeEach(async () => {
      await setupWrapper(100) // Floating (scrollY > 50)
    })

    it('should call scrollToSection when navigation link is clicked in floating state', async () => {
      const navLinks = wrapper.findAll('.header__nav-link')
      expect(navLinks.length).toBeGreaterThan(0)

      await navLinks[1].trigger('click') // Click "About"

      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('about')
    })

    it('should emit section-change event when navigation link is clicked in floating state', async () => {
      const navLinks = wrapper.findAll('.header__nav-link')

      await navLinks[2].trigger('click') // Click "Experience"

      expect(wrapper.emitted('section-change')).toBeTruthy()
      expect(wrapper.emitted('section-change')[0]).toEqual(['companies'])
    })

    it('should navigate to all sections in floating state', async () => {
      const navLinks = wrapper.findAll('.header__nav-link')

      for (let i = 0; i < navLinks.length; i++) {
        await navLinks[i].trigger('click')
      }

      expect(navigationStore.scrollToSection).toHaveBeenCalledTimes(navLinks.length)
    })

    it('should have floating class applied', () => {
      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })
  })

  describe('Navigation Functionality Equivalence', () => {
    it('should have identical desktop navigation behavior in both states', async () => {
      const wrapperDefault = await setupWrapper(0)
      const navLinksDefault = wrapperDefault.findAll('.header__nav-link')
      await navLinksDefault[1].trigger('click')
      const callsDefault = navigationStore.scrollToSection.mock.calls.length

      navigationStore.scrollToSection.mockClear()
      wrapperDefault.unmount()
      const wrapperFloating = await setupWrapper(100)
      const navLinksFloating = wrapperFloating.findAll('.header__nav-link')
      await navLinksFloating[1].trigger('click')
      const callsFloating = navigationStore.scrollToSection.mock.calls.length

      expect(callsDefault).toBe(1)
      expect(callsFloating).toBe(1)
      expect(callsDefault).toBe(callsFloating)

      wrapperFloating.unmount()
    })

    it('should emit identical events in both states', async () => {
      const wrapperDefault = await setupWrapper(0)
      const navLinksDefault = wrapperDefault.findAll('.header__nav-link')
      await navLinksDefault[0].trigger('click')
      const eventsDefault = wrapperDefault.emitted('section-change')

      wrapperDefault.unmount()
      const wrapperFloating = await setupWrapper(100)
      const navLinksFloating = wrapperFloating.findAll('.header__nav-link')
      await navLinksFloating[0].trigger('click')
      const eventsFloating = wrapperFloating.emitted('section-change')

      expect(eventsDefault).toBeTruthy()
      expect(eventsFloating).toBeTruthy()
      expect(eventsDefault![0]).toEqual(eventsFloating![0])

      wrapperFloating.unmount()
    })

    it('should handle multiple navigation clicks identically in both states', async () => {
      const wrapperDefault = await setupWrapper(0)
      const navLinksDefault = wrapperDefault.findAll('.header__nav-link')
      for (let i = 0; i < navLinksDefault.length; i++) {
        await navLinksDefault[i].trigger('click')
      }
      const callsDefault = navigationStore.scrollToSection.mock.calls.length

      navigationStore.scrollToSection.mockClear()
      wrapperDefault.unmount()
      const wrapperFloating = await setupWrapper(100)
      const navLinksFloating = wrapperFloating.findAll('.header__nav-link')
      for (let i = 0; i < navLinksFloating.length; i++) {
        await navLinksFloating[i].trigger('click')
      }
      const callsFloating = navigationStore.scrollToSection.mock.calls.length

      expect(callsDefault).toBe(navLinksDefault.length)
      expect(callsFloating).toBe(navLinksFloating.length)
      expect(callsDefault).toBe(callsFloating)

      wrapperFloating.unmount()
    })
  })

  describe('Section Scrolling Behavior', () => {
    it('should scroll to correct section in default state', async () => {
      await setupWrapper(0)
      const navLinks = wrapper.findAll('.header__nav-link')

      await navLinks[0].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')

      await navLinks[1].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('about')

      await navLinks[2].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('companies')

      await navLinks[3].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('contact')
    })

    it('should scroll to correct section in floating state', async () => {
      await setupWrapper(100)
      const navLinks = wrapper.findAll('.header__nav-link')

      await navLinks[0].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')

      await navLinks[1].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('about')

      await navLinks[2].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('companies')

      await navLinks[3].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('contact')
    })
  })

  describe('Floating State Visual Verification', () => {
    it('should not have floating class when scrollY is 0', async () => {
      await setupWrapper(0)
      expect(wrapper.find('.header--floating').exists()).toBe(false)
    })

    it('should not have floating class when scrollY is below threshold', async () => {
      await setupWrapper(49)
      expect(wrapper.find('.header--floating').exists()).toBe(false)
    })

    it('should not have floating class when scrollY is at threshold (due to hysteresis)', async () => {
      await setupWrapper(50)
      expect(wrapper.find('.header--floating').exists()).toBe(false)
    })

    it('should have floating class when scrollY is above threshold', async () => {
      await setupWrapper(100)
      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })

    it('should have floating class when scrollY is far above threshold', async () => {
      await setupWrapper(500)
      expect(wrapper.find('.header--floating').exists()).toBe(true)
    })
  })

  describe('Navigation Preservation Across State Changes', () => {
    it('should maintain navigation functionality when transitioning from default to floating', async () => {
      await setupWrapper(0)
      const navLinks = wrapper.findAll('.header__nav-link')

      await navLinks[0].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      })
      window.dispatchEvent(new Event('scroll'))
      await flushPromises()
      await wrapper.vm.$nextTick()

      await navLinks[1].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('about')

      expect(navigationStore.scrollToSection).toHaveBeenCalledTimes(2)
    })

    it('should maintain navigation functionality when transitioning from floating to default', async () => {
      await setupWrapper(100)
      const navLinks = wrapper.findAll('.header__nav-link')

      await navLinks[0].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0,
      })
      window.dispatchEvent(new Event('scroll'))
      await flushPromises()
      await wrapper.vm.$nextTick()

      await navLinks[1].trigger('click')
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('about')

      expect(navigationStore.scrollToSection).toHaveBeenCalledTimes(2)
    })
  })
})
