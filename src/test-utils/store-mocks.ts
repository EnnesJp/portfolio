import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import type { Store } from 'pinia'

export function createMockPinia(options = {}) {
  return createTestingPinia({
    createSpy: vi.fn,
    stubActions: false,
    ...options,
  })
}

export function createWritableStore<T extends Store>(store: T): T {
  return new Proxy(store, {
    set(target, prop, value) {
      if (prop in target) {
        const currentValue = (target as any)[prop]

        if (currentValue && typeof currentValue === 'object' && currentValue.__v_isRef) {
          if (currentValue._rawValue !== undefined) {
            currentValue._rawValue = value
            currentValue._value = value
            return true
          }
        }
      }
      return Reflect.set(target, prop, value)
    },
  })
}

export function setupStoreMocks() {
  const pinia = createMockPinia()

  return {
    pinia,
    navigationStore: {
      sections: [],
      visibleSections: [],
      currentSection: '',
      isScrolling: false,
      scrollProgress: 0,
      scrollToSection: vi.fn(),
      registerSection: vi.fn(),
      updateCurrentSection: vi.fn(),
    },
    themeStore: {
      currentTheme: 'light',
      isTransitioning: false,
      themeConfig: {
        name: 'light',
        colors: {},
        typography: {},
        animations: {},
        shadows: {},
        spacing: {},
      },
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      initializeTheme: vi.fn(),
      getThemeAwareColor: vi.fn(),
    },
    languageStore: {
      currentLanguage: 'en',
      isChanging: false,
      currentLanguageConfig: {},
      availableLanguages: [],
      isRTL: false,
      setLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
      initializeLanguage: vi.fn(),
      getTranslation: vi.fn(),
    },
    uiStore: {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isMobileMenuOpen: false,
      toggleMobileMenu: vi.fn(),
      closeMobileMenu: vi.fn(),
      updateBreakpoints: vi.fn(),
      initializeResponsiveSystem: vi.fn(() => () => {}),
    },
  }
}
