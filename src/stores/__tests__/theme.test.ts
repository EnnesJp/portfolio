import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { fc, test } from '@fast-check/vitest'
import { useThemeStore } from '../theme'
import { setupDOMMocks, resetDOMMocks } from '@/test-utils'

describe('Theme Store', () => {
  let mocks: ReturnType<typeof setupDOMMocks>

  beforeEach(() => {
    mocks = setupDOMMocks()

    setActivePinia(
      createTestingPinia({
        createSpy: vi.fn,
        stubActions: false,
      }),
    )
  })

  afterEach(() => {
    resetDOMMocks()
  })

  test.prop([fc.constantFrom('light', 'dark')])('should toggle theme correctly', (initialTheme) => {
    const store = useThemeStore()

    store.setTheme(initialTheme)
    vi.clearAllMocks()

    store.toggleTheme()

    const expectedTheme = initialTheme === 'light' ? 'dark' : 'light'
    expect(store.currentTheme).toBe(expectedTheme)

    expect(mocks.documentElementMock.style.setProperty).toHaveBeenCalled()
    expect(mocks.localStorageMock.setItem).toHaveBeenCalledWith('portfolio-theme', expectedTheme)
  })

  test.prop([fc.constantFrom('light', 'dark', 'invalid' as any)])(
    'should initialize theme from localStorage correctly',
    (savedTheme) => {
      mocks.localStorageMock.getItem.mockReturnValue(savedTheme)

      const store = useThemeStore()
      store.initializeTheme()

      if (savedTheme === 'light' || savedTheme === 'dark') {
        expect(store.currentTheme).toBe(savedTheme)
      } else {
        expect(store.currentTheme).toBe('light')
      }

      expect(mocks.documentElementMock.style.setProperty).toHaveBeenCalled()
    },
  )
})
