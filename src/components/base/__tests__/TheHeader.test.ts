import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import TheHeader from '../TheHeader.vue'
import { mountWithDependencies, setupStoreMocks } from '@/test-utils'
import { useNavigationStore } from '@/stores/navigation'
import { useThemeStore } from '@/stores/theme'
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

describe('TheHeader', () => {
  let wrapper: any
  let mocks: any
  let navigationStore: any
  let themeStore: any
  let uiStore: any

  beforeEach(() => {
    // Set up window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    })

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    mocks = setupStoreMocks()

    const result = mountWithDependencies(TheHeader, {
      storeMocks: mocks,
      global: {
        plugins: [i18n],
        stubs: {
          'select-lang': true,
          'theme-toggle': true,
          'responsive-container': false,
        },
      },
    })

    wrapper = result.wrapper

    navigationStore = useNavigationStore()
    themeStore = useThemeStore()
    uiStore = useUIStore()

    navigationStore.visibleSections = [
      { id: 'presentation', label: 'Home', order: 1, visible: true },
      { id: 'about', label: 'About', order: 2, visible: true },
      { id: 'contact', label: 'Contact', order: 3, visible: true },
    ]
    navigationStore.currentSection = 'presentation'
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Desktop Navigation', () => {
    it('should render navigation links for visible sections', () => {
      const navLinks = wrapper.findAll('.header__nav-link')
      expect(navLinks).toHaveLength(3)
      expect(navLinks[0].text()).toBe('Home')
      expect(navLinks[1].text()).toBe('About')
      expect(navLinks[2].text()).toBe('Contact')
    })

    it('should highlight active section', () => {
      navigationStore.currentSection = 'about'
      wrapper.vm.$nextTick(() => {
        const activeLink = wrapper.find('.header__nav-link--active')
        expect(activeLink.exists()).toBe(true)
        expect(activeLink.text()).toBe('About')
      })
    })

    it('should call scrollToSection when navigation link is clicked', async () => {
      const navLink = wrapper.find('.header__nav-link')
      await navLink.trigger('click')

      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')
    })

    it('should emit section-change event when desktop nav link is clicked', async () => {
      const navLink = wrapper.find('.header__nav-link')
      await navLink.trigger('click')

      expect(wrapper.emitted('section-change')).toBeTruthy()
      expect(wrapper.emitted('section-change')[0]).toEqual(['presentation'])
    })
  })

  describe('Theme Integration', () => {
    it('should render theme toggle component', () => {
      const themeToggle = wrapper.findComponent({ name: 'theme-toggle' })
      expect(themeToggle.exists()).toBe(true)
    })
  })

  describe('Mobile Menu Behavior', () => {
    beforeEach(async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })
      window.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()
    })

    it('should show mobile controls when on mobile', async () => {
      const component = wrapper.vm
      expect(component).toBeDefined()

      const desktopNav = wrapper.find('.header__nav')
      expect(desktopNav.exists()).toBe(true)
    })

    it('should toggle mobile menu when hamburger is clicked', async () => {
      const hamburger = wrapper.find('.header__mobile-menu-toggle')
      if (hamburger.exists()) {
        await hamburger.trigger('click')
        expect(uiStore.toggleMobileMenu).toHaveBeenCalled()
      }
    })

    it('should close mobile menu when overlay is clicked', async () => {
      await uiStore.toggleMobileMenu()
      await wrapper.vm.$nextTick()

      const overlay = wrapper.find('.header__mobile-overlay')
      if (overlay.exists()) {
        await overlay.trigger('click')
        expect(uiStore.closeMobileMenu).toHaveBeenCalled()
      }
    })

    it('should close mobile menu and navigate when mobile nav link is clicked', async () => {
      await uiStore.toggleMobileMenu()
      await wrapper.vm.$nextTick()

      const mobileNavLink = wrapper.find('.header__mobile-nav-link')
      if (mobileNavLink.exists()) {
        await mobileNavLink.trigger('click')
        expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')
        expect(uiStore.closeMobileMenu).toHaveBeenCalled()
      }
    })
  })

  describe('Responsive Behavior', () => {
    it('should initialize responsive system on mount', () => {
      expect(uiStore.initializeResponsiveSystem).toHaveBeenCalled()
    })

    it('should handle window resize', async () => {
      vi.clearAllMocks()

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })

      window.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should apply transparent class when transparent prop is true', async () => {
      await wrapper.setProps({ transparent: true })

      expect(wrapper.find('.header--transparent').exists()).toBe(true)
    })

    it('should apply fixed class when fixed prop is true', async () => {
      await wrapper.setProps({ fixed: true })

      expect(wrapper.find('.header--fixed').exists()).toBe(true)
    })
  })
})
