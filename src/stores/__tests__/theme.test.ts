import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { fc, test } from '@fast-check/vitest'
import { useThemeStore } from '../theme'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

const setPropertyMock = vi.fn()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(globalThis, 'document', {
  value: {
    documentElement: {
      style: {
        setProperty: setPropertyMock,
      },
    },
  },
  writable: true,
})

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({
      createSpy: vi.fn,
    }))
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.prop([fc.constantFrom('light', 'dark')])('should apply theme consistently across all components', (theme) => {
    const store = useThemeStore()
    
    store.setTheme(theme)
    
    expect(store.currentTheme).toBe(theme)
    
    const config = store.themeConfig
    expect(config.name).toBe(theme)
    expect(config.colors).toBeDefined()
    
    const requiredColors = ['primary', 'secondary', 'background', 'surface', 'text', 'textSecondary', 'accent', 'border']
    requiredColors.forEach(colorKey => {
      expect(config.colors[colorKey as keyof typeof config.colors]).toBeDefined()
      expect(typeof config.colors[colorKey as keyof typeof config.colors]).toBe('string')
    })
    
    expect(setPropertyMock).toHaveBeenCalledTimes(requiredColors.length)
    requiredColors.forEach(colorKey => {
      expect(setPropertyMock).toHaveBeenCalledWith(
        `--color-${colorKey}`,
        config.colors[colorKey as keyof typeof config.colors]
      )
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('portfolio-theme', theme)
  })

  test.prop([fc.constantFrom('light', 'dark')])('should toggle theme correctly', (initialTheme) => {
    const store = useThemeStore()
    
    store.setTheme(initialTheme)
    vi.clearAllMocks()
    
    store.toggleTheme()
    
    const expectedTheme = initialTheme === 'light' ? 'dark' : 'light'
    expect(store.currentTheme).toBe(expectedTheme)
    
    expect(store.isTransitioning).toBe(true)
    
    expect(setPropertyMock).toHaveBeenCalled()
    expect(localStorageMock.setItem).toHaveBeenCalledWith('portfolio-theme', expectedTheme)
  })

  test.prop([fc.constantFrom('light', 'dark', 'invalid' as any)])('should initialize theme from localStorage correctly', (savedTheme) => {
    localStorageMock.getItem.mockReturnValue(savedTheme)
    
    const store = useThemeStore()
    store.initializeTheme()
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      expect(store.currentTheme).toBe(savedTheme)
    } else {
      expect(store.currentTheme).toBe('light')
    }
    
    expect(setPropertyMock).toHaveBeenCalled()
  })
})