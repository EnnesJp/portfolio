import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import TheHeader from '../TheHeader.vue'
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
      },
      common: {
        toggleTheme: 'Toggle theme',
      },
    },
  },
})

describe('TheHeader', () => {
  let wrapper: any
  let navigationStore: any
  let themeStore: any
  let uiStore: any

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    wrapper = mount(TheHeader, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          'select-lang': true,
          'theme-toggle': true,
        },
      },
    })

    navigationStore = useNavigationStore()
    themeStore = useThemeStore()
    uiStore = useUIStore()

    navigationStore.visibleSections = [
      { id: 'presentation', label: 'Home', order: 1, visible: true },
      { id: 'about', label: 'About', order: 2, visible: true },
      { id: 'contact', label: 'Contact', order: 3, visible: true },
    ]
    navigationStore.currentSection = 'presentation'
    themeStore.currentTheme = 'light'
    uiStore.isMobile = false
    uiStore.isMobileMenuOpen = false
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

    it('should emit section-change event when mobile nav link is clicked', async () => {
      uiStore.isMobile = true
      await wrapper.vm.$nextTick()
      
      const mobileNavLink = wrapper.find('.header__mobile-nav-link')
      await mobileNavLink.trigger('click')
      
      expect(wrapper.emitted('section-change')).toBeTruthy()
      expect(wrapper.emitted('section-change')[0]).toEqual(['presentation'])
    })
  })

  describe('Theme Integration', () => {
    it('should display correct logo based on theme', async () => {
      themeStore.currentTheme = 'light'
      await wrapper.vm.$nextTick()
      
      const logo = wrapper.find('.header__logo img')
      expect(logo.attributes('src')).toContain('logo-dark.png')
      
      themeStore.currentTheme = 'dark'
      await wrapper.vm.$nextTick()
      
      expect(logo.attributes('src')).toContain('logo-white.png')
    })

    it('should render theme toggle component', () => {
      const themeToggle = wrapper.findComponent({ name: 'theme-toggle' })
      expect(themeToggle.exists()).toBe(true)
    })
  })

  describe('Mobile Menu Behavior', () => {
    beforeEach(async () => {
      uiStore.isMobile = true
      await wrapper.vm.$nextTick()
    })

    it('should show mobile controls when on mobile', () => {
      const mobileControls = wrapper.find('.header__mobile-controls')
      expect(mobileControls.exists()).toBe(true)
      
      const desktopNav = wrapper.find('.header__nav')
      expect(desktopNav.exists()).toBe(false)
    })

    it('should toggle mobile menu when hamburger is clicked', async () => {
      const hamburger = wrapper.find('.header__mobile-menu-toggle')
      await hamburger.trigger('click')
      
      expect(uiStore.toggleMobileMenu).toHaveBeenCalled()
    })

    it('should show mobile menu when isMobileMenuOpen is true', async () => {
      uiStore.isMobileMenuOpen = true
      await wrapper.vm.$nextTick()
      
      const mobileMenu = wrapper.find('.header__mobile-menu--open')
      expect(mobileMenu.exists()).toBe(true)
    })

    it('should close mobile menu when overlay is clicked', async () => {
      uiStore.isMobileMenuOpen = true
      await wrapper.vm.$nextTick()
      
      const overlay = wrapper.find('.header__mobile-overlay')
      await overlay.trigger('click')
      
      expect(uiStore.closeMobileMenu).toHaveBeenCalled()
    })

    it('should close mobile menu and navigate when mobile nav link is clicked', async () => {
      uiStore.isMobileMenuOpen = true
      await wrapper.vm.$nextTick()
      
      const mobileNavLink = wrapper.find('.header__mobile-nav-link')
      await mobileNavLink.trigger('click')
      
      expect(navigationStore.scrollToSection).toHaveBeenCalledWith('presentation')
      expect(uiStore.closeMobileMenu).toHaveBeenCalled()
    })
  })

  describe('Responsive Behavior', () => {
    it('should update breakpoints on mount', () => {
      expect(uiStore.updateBreakpoints).toHaveBeenCalled()
    })

    it('should handle window resize', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })
      
      window.dispatchEvent(new Event('resize'))
      
      expect(uiStore.updateBreakpoints).toHaveBeenCalled()
    })
  })

  describe('Logo Interaction', () => {
    it('should scroll to top when logo is clicked', async () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
      
      const logo = wrapper.find('.header__logo img')
      await logo.trigger('click')
      
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
      
      scrollToSpy.mockRestore()
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